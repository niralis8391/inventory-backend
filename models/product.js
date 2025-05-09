// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    subCategory: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 0 },
    image: { type: String },
    // sku: { type: String, unique: true },
    // supplier: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
