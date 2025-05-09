const Customer = require('../models/customer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator')
const crypto = require('crypto')

exports.postSignup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    const { name, email, password, phone, address } = req.body;
    try {
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
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    const { email, password } = req.body;
    try {

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
    const userData = req.body
    try {
        if (!req.isAuth) {
            return res.status(403).json({ success: false, message: "Not Authenticated" })
        }
        const customer = await Customer.findByIdAndUpdate(
            userId,
            userData,
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

exports.changePasswordRequest = (req, res) => {
    try {

    } catch (error) {

    }
}