const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    title: String,
    author: String,
    description: String,
    category: String,
    image: String,
    rating: Number,
    price: Number,
    originalPrice: Number,
    stock: Number
}, { timestamps: true });

module.exports = mongoose.model("Book", BookSchema);
