const Product = require('../models/product');
const { validationResult } = require('express-validator')

exports.addProduct = async (req, res) => {
    const { productName, description, category, subCategory, price, quantity, image } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    if (!req.isAuth) {
        return res.status(403).json({ message: "unauthenticated" })
    }
    try {
        const newProduct = new Product({ productName, description, category, subCategory, price, quantity, image })
        const savedProduct = await newProduct.save()
        res.status(200).json({ message: savedProduct })
    } catch (error) {
        res.status(500).json({ errors: error.message })
    }
}

exports.getProductByCategory = async (req, res) => {
    try {
        // if (!req.isAuth) {
        //     return res.status(403).json({ message: "Not Authenticated" })
        // }
        const category = req.params.category;

        const product = await Product.find({ category: category })

        if (!product) {
            return res.status(404).json({ message: "product not found." })
        }

        res.status(200).json({ success: true, message: "data fetch successfull", product: product })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.getAll = async (req, res) => {
    try {
        if (!req.isAuth) {
            return res.status(403).json({ success: false, message: "Not Authenticated" })
        }
        const products = await Product.find()
        if (!products) {
            return res.status(404).json({ success: false, message: "product not found" });
        }
        res.status(200).json({ success: true, message: "products found", data: products })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

exports.getProductById = async (req, res) => {
    try {
        if (!req.isAuth) {
            return res.status(403).json({ success: false, message: "Not Authenticated" })
        }
        const productId = req.params.productId

        const product = await Product.findById(productId)
        if (!product) {
            return res.status({ success: false, message: "product not found" })
        }
        res.status(200).json({ success: true, message: "product founded", data: product })
    } catch (error) {
        res.status(500).json({ success: true, error: error })
    }
}


exports.productcount = async (req, res) => {
    try {
        if (!req.isAuth) {
            return res.status(403).json({ success: false, message: "Not Authenticated" })
        }
        const productCount = await Product.countDocuments();
        if (!productCount) {
            return res.status(404).json({ success: false, message: "Product count not found" });
        }
        res.status(200).json({ success: true, message: "product count found", data: productCount })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

exports.updateProduct = async (req, res) => {
    const updatedData = req.body;
    const productId = req.params.productId
    try {
        const product = await Product.findByIdAndUpdate(
            productId,
            updatedData,
            { new: true }
        )
        if (!product) {
            return res.status(400).json({ success: false, message: "product not updated" })
        }
        res.status(200).json({ success: false, message: "product updated", data: product })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

exports.deleteProduct = async (req, res) => {
    const productId = req.params.productId
    try {
        const product = await Product.findByIdAndDelete(productId)
        if (!product) {
            res.status(400).json({ success: false, message: "product not deleted" });
        }
        res.status(200).json({ success: true, message: "deleted successfull" })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

exports.getSuggestProduct = async (req, res) => {
    const search = req.query.search || "";
    try {
        const suggestions = await Product.find({
            $or: [
                { productName: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { category: { $regex: search, $options: "i" } },
            ],
        })
            .limit(5);

        res.json(suggestions);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}