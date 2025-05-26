// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    description: { type: String, required: true },
    size: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 0, required: true },
    image: {
        url: { type: String, required: true },
        secure_url: { type: String }, // Optional
        public_id: { type: String, required: true }
    }
    // sku: { type: String, unique: true },
    // supplier: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
