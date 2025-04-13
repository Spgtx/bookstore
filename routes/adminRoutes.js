const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const User = require("../models/User");
const Order = require("../models/Order");
const { authenticateAdmin } = require("../middleware/adminAuth");

// Get all books
router.get("/books", authenticateAdmin, async (req, res) => {
    const books = await Book.find();
    res.json(books);
});

// Add a book
router.post("/books", authenticateAdmin, async (req, res) => {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json(newBook);
});

// Delete a book
router.delete("/books/:id", authenticateAdmin, async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
});

// Get users
router.get("/users", authenticateAdmin, async (req, res) => {
    const users = await User.find().select("-password");
    res.json(users);
});

// Get orders
router.get("/orders", authenticateAdmin, async (req, res) => {
    const orders = await Order.find()
        .populate("user", "name")
        .populate("items.book", "title price");
    res.json(orders);
});

// Update order status
router.patch("/orders/:id", authenticateAdmin, async (req, res) => {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(order);
});

module.exports = router;
