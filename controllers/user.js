const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require("express-validator");
const { decryptData } = require('../utils/decrypt')



exports.postSignup = async (req, res) => {
    try {
        const { payload } = req.body;
        const decrypted = decryptData(payload);
        const { username, email, password, phone } = decrypted;
        if (!decrypted.username || !decrypted.email || !decrypted.password) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const user = await User.findOne({ email: email })
        if (user) {
            return res.status(401).json({ message: "user already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const newUser = new User({
            username: username,
            email: email,
            password: hashedPassword,
            phone: phone
        })
        await newUser.save();
        res.status(200).json({ data: newUser })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.postLogin = async (req, res) => {
    try {
        const { payload } = req.body;
        const decrypted = decryptData(payload);
        const { email, password } = decrypted;
        const user = await User.findOne({ email: email });
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