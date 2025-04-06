const mongoose = require("mongoose");

const AuthorSchema = new mongoose.Schema({
    name: String,
    bio: String,
    image: String,
    books: [String] // Titles of books written
});

module.exports = mongoose.model("Author", AuthorSchema);
