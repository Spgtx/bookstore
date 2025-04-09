const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Book = require("./models/Book");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
require("dotenv").config();
const Cart = require("../models/Cart");
const express = require("express");
const { Order } = require("./models/order");
const User = require("./models/User");

const adminRouter = express.Router();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/admin", adminRouter);

adminRouter.use((req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });

    try {
        const decoded = jwt.verify(token, "your_admin_secret");
        if (!decoded.isAdmin) throw new Error();
        next();
    } catch {
        res.status(403).json({ error: "Unauthorized" });
    }
});

// Books

// Get all books
app.get("/api/books", async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single book
app.get("/api/books/:id", async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        res.json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create a new book
app.post("/api/books", async (req, res) => {
    try {
        const newBook = new Book(req.body);
        await newBook.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Update a book
app.put("/api/books/:id", async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBook);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a book
app.delete("/api/books/:id", async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: "Book deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Users
adminRouter.get("/users", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

// Orders
adminRouter.get("/orders", async (req, res) => {
    const orders = await Order.find().populate("user");
    res.json(orders);
});

adminRouter.patch("/orders/:id", async (req, res) => {
    const order = await Order.findByIdAndUpdate(req.params.id, {
        status: req.body.status
    });
    res.json(order);
});



const { router: adminAuthRoutes, authenticateAdmin } = require("./routes/adminAuth");
app.use("/api/admin", adminAuthRoutes);

// Example protected admin route
app.get("/api/admin/dashboard", authenticateAdmin, (req, res) => {
    res.json({ message: "Welcome to Admin Dashboard" });
});



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


// Get all cart items for a user
app.get("/api/cart", async (req, res) => {
    try {
        const userId = req.session.userId; // or req.user.id from auth middleware
        const cart = await Cart.find({ userId }).populate("book");
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete cart item
app.delete("/api/cart/:id", async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.json({ message: "Item removed from cart" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});