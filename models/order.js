const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderNumber: { type: String, unique: true, required: true },

    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },

    items: {
        type: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
                quantity: { type: Number, required: true },
                // priceAtPurchase: { type: Number, required: true }
            }
        ],
        required: true
    },

    method: {
        type: String,
        enum: ["upi", "cash"],
        default: "cash"
    },

    totalAmount: { type: Number, required: true },

    status: {
        type: String,
        enum: ["pending", "completed", "cancelled"],
        default: "pending"
    }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
