const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { promisify } = require('util')

const { decryptData } = require('../utils/decrypt');
const Customer = require('../models/customer');
const Order = require('../models/order');
const { syncBuiltinESMExports } = require('module');

if (!process.env.SENDGRID_API_KEY) {
    console.error("Missing SENDGRID_API_KEY in .env file");
    process.exit(1);
}


exports.postSignup = async (req, res) => {
    try {
        const { payload } = req.body;
        const decrypted = decryptData(payload);
        const { name, email, password, phone, address } = decrypted;
        const customer = await Customer.findOne({ email: email })
        if (customer) {
            return res.status(401).json({ message: "user already exist" })
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const newCustomer = new Customer({
            name, email, password: hashedPassword, phone, address
        })
        await newCustomer.save();
        res.status(200).json({ message: newCustomer })
    } catch (error) {
        res.status(500).json({ errors: error.message })
    }
}

exports.postLogin = async (req, res) => {
    try {
        const { payload } = req.body;
        const decrypted = decryptData(payload);
        const { email, password } = decrypted;
        const user = await Customer.findOne({ email: email });
        if (!user) {
            return res.status(403).json({ message: "Invalid Credentials" })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(403).json({ message: "Invalid Credentials" })
        }
        const token = jwt.sign({ email: user.email, userId: user._id.toString() }, process.env.JWT_SECRET);
        res.status(200).json({ token: token, userId: user._id.toString() })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.customerData = async (req, res) => {
    try {
        if (!req.isAuth) {
            return res.status(403).json({ success: false, message: "Not Authenticated" })
        }
        const customer = await Customer.findById(req.userId)
        if (!customer) {
            return res.status(404).json({ success: false, message: "user not found" });
        }
        res.status(200).json({ success: true, message: "user found", data: customer });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

exports.updateProfile = async (req, res) => {
    const userId = req.userId
    try {
        if (!req.isAuth) {
            return res.status(403).json({ success: false, message: "Not Authenticated" })
        }
        const { payload } = req.body;
        const decrypted = decryptData(payload);
        const customer = await Customer.findByIdAndUpdate(
            userId,
            decrypted,
            { new: true }
        )
        if (!customer) {
            return res.status(400).json({ success: false, message: "profile not updated" })
        }
        res.status(200).json({ success: false, message: "profile updated successfull", data: customer })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

exports.findOrderByStatus = async (req, res) => {
    let search = req.query.search || ""
    try {
        if (!req.userId) {
            return res.status(403).json({ success: false, message: "Not Autnehticated" })
        }
        let customer = req.userId;
        let order = await Order.find({ customer: customer });
        let filter = order.filter((orders) => {
            return orders.status === search
        })
        res.status(200).json({ success: true, data: filter.length, message: "found order by status" })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

exports.getTotalOrdersCount = async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(403).json({ success: false, message: "Not Autnehticated" })
        }
        let customer = req.userId;
        let order = await Order.find({ customer: customer });
        const orderCount = order.length;
        if (!orderCount) {
            return res.status(404).json({ success: false, message: "orders count not found" });
        }
        res.status(200).json({ success: true, message: "orders count found", data: orderCount })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}



exports.postReset = async (req, res) => {
    try {
        if (!req.isAuth) {
            return res.status(403).json({ success: false, message: "Not Authenticated" });
        }

        const randomBytesAsync = promisify(crypto.randomBytes);
        const buffer = await randomBytesAsync(32);
        const token = buffer.toString('hex');

        const customer = await Customer.findOne({ email: req.body.email });
        if (!customer) {
            return res.status(404).json({ message: "No account with that email found." });
        }

        customer.resetToken = token;
        customer.resetTokenExpiration = Date.now() + 36000000; // e.g., 10 hours
        await customer.save();

        // Use your sendEmail utility here
        await sendEmail({
            to: req.body.email,
            from: 'parthrkakdiya.atmiya13@gmail.com',  // Must be verified in SendGrid
            subject: "Reset Password",
            html: `Click <a href="http://localhost:5174/user/reset/${token}">here</a> to reset your password`
        });

        res.status(200).json({ success: true, message: "Reset email sent" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.changePasswordRequest = (req, res) => {
    try {

    } catch (error) {

    }
}