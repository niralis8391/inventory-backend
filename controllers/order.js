const Order = require('../models/order');
const { v4: uuidv4 } = require('uuid');

exports.createOrder = async (req, res) => {
    const orderNumber = `ORD-${uuidv4().slice(0, 8).toUpperCase()}`;
    const { items, totalAmount } = req.body;
    const customer = req.userId
    try {
        if (!req.userId) {
            return res.status(404).json({ success: false, message: "customer not found" })
        }
        const formattedItems = items.map(item => ({
            product: item._id,
            quantity: item.quantity
        }));
        const newOrder = new Order({
            orderNumber,
            customer,
            items: formattedItems,
            totalAmount
        });

        await newOrder.save();

        res.status(200).json({ message: "Order created successfully", order: newOrder });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

exports.getOrders = async (req, res) => {
    try {
        if (!req.isAuth) {
            return res.status(403).json({ success: false, message: "Not Authenticated" })
        }
        const order = await Order.find().populate("items.product");
        if (!order) {
            res.status(404).json({ success: false, message: "order not found" })
        }
        res.status(200).json({ success: true, message: "orders found", data: order })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

exports.getOrderDetails = async (req, res) => {
    try {
        if (!req.isAuth) {
            return res.status(403).json({ success: false, message: "Not authenticated" })
        }
        const order = await Order.find({ customer: req.userId }).populate("items.product");
        if (!order) {
            return res.status(404).json({ success: false, message: "order not found" })
        }
        res.status(200).json({ succesL: true, message: "order found", data: order })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

