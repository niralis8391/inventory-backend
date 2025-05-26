const { validationResult } = require('express-validator');
const Product = require('../models/product');
const cloudinary = require('../utils/cloudinary');

exports.addProduct = async (req, res) => {
    const { productName, description, category, subCategory, price, size, quantity } = req.body;

    if (!req.isAuth) {
        return res.status(403).json({ message: "Unauthenticated" });
    }

    try {

        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'products',
        });

        const newProduct = new Product({
            productName,
            description,
            size,
            category,
            subCategory,
            price,
            quantity,
            image: {
                public_id: result.public_id,
                url: result.url,
                secure_url: result.secure_url
            }
        });

        const savedProduct = await newProduct.save();

        res.status(200).json({ message: 'Product added successfully', product: savedProduct });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateProduct = async (req, res) => {
    const { productId } = req.params;
    const { productName, description, category, subCategory, price, size, quantity } = req.body;

    try {
        if (!req.isAuth) {
            return res.status(403).json({ message: "Unauthenticated" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        let updatedImage = product.image;

        // If a new image is uploaded
        if (req.file) {
            // Optional: Delete previous image from Cloudinary
            if (product.image && product.image.public_id) {
                await cloudinary.uploader.destroy(product.image.public_id);
            }

            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'products',
            });

            updatedImage = {
                public_id: result.public_id,
                url: result.secure_url,
            };
        }

        const updatedFields = {
            productName,
            description,
            size,
            category,
            subCategory,
            price,
            quantity,
            image: updatedImage, // Always set image — new or existing
        };

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $set: updatedFields },
            { new: true }
        );

        res.status(200).json({ success: true, product: updatedProduct });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};



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