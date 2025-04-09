const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
  quantity: { type: Number, default: 1 },
  userId: String // Assuming user login system
});

module.exports = mongoose.model("Cart", CartSchema);
