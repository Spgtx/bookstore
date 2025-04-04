const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    title: String,
    author: String,
    image: String,
    rating: Number,
    price: Number,
    originalPrice: Number,
    description: String,
    category: String
});

module.exports = mongoose.model("Book", BookSchema);
