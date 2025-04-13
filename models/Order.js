const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    books: [
        {
            bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
            quantity: { type: Number, default: 1 }
        }
    ],
    totalPrice: Number,
    status: {
        type: String,
        enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
        default: "Pending"
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.Order || mongoose.model("Order", OrderSchema);
