const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Book = require("./models/Book");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

const User = require("./models/User");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/bookstore", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// 📌 User Registration Route
app.post("/api/register", [
    body("email").isEmail(),
    body("password").isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
});

// 📌 User Login Route
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, message: "Login successful" });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

// API Route to Get Books
app.get("/api/books", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


// Get books by category
app.get("/api/books/category/:category", async (req, res) => {
    try {
        const category = req.params.category;
        const books = await Book.find({ category: category });
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Author route
const Author = require('./models/Author');

app.get("/api/authors", async (req, res) => {
    try {
        const authors = await Author.find();
        res.json(authors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/authors/:id", async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        if (!author) return res.status(404).json({ message: "Author not found" });
        res.json(author);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Fetch contact/social data
app.get("/api/contact", (req, res) => {
    res.json({
        location: {
            lat: -1.2921,
            lng: 36.8219
        },
        socials: {
            facebook: "https://facebook.com/themindbookstore",
            twitter: "https://twitter.com/themindstore",
            instagram: "https://instagram.com/themindbookstore"
        }
    });
});

// Handle form submission
app.post("/api/contact", express.json(), (req, res) => {
    const { name, email, message } = req.body;
    console.log("Contact form submission:", { name, email, message });
    res.json({ success: true, message: "Message received. We'll get back to you!" });
});
