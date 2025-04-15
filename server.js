const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
const Admin = require('./models/Admin');
const { router: adminAuthRoutes } = require("./middleware/adminAuth");
const adminRoutes = require("./routes/adminRoutes");


// Models
const Book = require("./models/Book");
const User = require("./models/User");
const { Order } = require("./models/Order");
const Author = require('./models/Author');


// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/admin", adminAuthRoutes);     // Handles /api/admin/register and /login
app.use("/api/admin", adminRoutes);         // Handles /api/admin/books, /users, /orders


// Book Routes
app.get("/api/books", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/books/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        res.json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/books/category/:category", async (req, res) => {
    try {
        const books = await Book.find({ category: req.params.category });
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Author Routes
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

// Register & Login (Non-admin)
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

app.post("/api/register", [
    body("username").isLength({ min: 3 }).withMessage("Username must be at least 3 characters long"),
    body("password").isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });
        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ username, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error });
    }
});

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, message: "Login successful" });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
});

// Contact Route
app.get("/api/contact", (req, res) => {
    res.json({
        location: {
            lat: -1.2921,
            lng: 36.8219
        },
        email: "support@bookstore.com",
        phone: "+254712345678",
        socials: {
            twitter: "@bookstore",
            instagram: "@bookstore_kenya"
        }
    });
});

// MongoDB Connect & Server Listen
mongoose.connect("mongodb://127.0.0.1:27017/bookstore", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});


// Temporary admin creation route

app.post('/create-admin', async (req, res) => {
    const hashedPassword = await bcrypt.hash("admin1234", 10);
    const newAdmin = new Admin({ username: "SecureAdmin123", password: hashedPassword });

    await newAdmin.save();
    res.send("Admin created");
});