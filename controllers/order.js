const Order = require('../models/order');
const { v4: uuidv4 } = require('uuid');

exports.createOrder = async (req, res) => {
    const orderNumber = `ORD-${uuidv4().slice(0, 8).toUpperCase()}`;
    const { items, totalAmount, shippingDetails } = req.body;
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
            name: shippingDetails.name,
            phone: shippingDetails.phone,
            address: shippingDetails.address,
            items: formattedItems,
            orderNumber,
            customer,
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

exports.ordersCount = async (req, res) => {
    try {
        if (!req.isAuth) {
            return res.status(403).json({ success: false, message: "Not Authenticated" })
        }
        const orderCount = await Order.countDocuments();
        if (!orderCount) {
            return res.status(404).json({ success: false, message: "Product count not found" });
        }
        res.status(200).json({ success: true, message: "product count found", data: orderCount })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

exports.updateOrderStatus = async (req, res) => {
    const orderId = req.params.orderId;
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'completed', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        if (!order) {
            return res.status(400).json({ success: false, message: "order not updated" })
        }
        res.status(200).json({ success: true, message: "order status updated" })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

exports.pendingOrderDetails = async (req, res) => {
    try {
        if (!req.isAuth) {
            return res.status(403).json({ success: false, message: "Not authenticated" })
        }
        const order = await Order.find({ status: 'pending' }).populate("items.product");
        if (!order) {
            return res.status(404).json({ success: false, message: "order not found" })
        }
        res.status(200).json({ succesL: true, message: "order found", data: order })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

exports.completedOrderDetails = async (req, res) => {
    try {
        if (!req.isAuth) {
            return res.status(403).json({ success: false, message: "Not Authenticated" });
        }
        const order = await Order.find({ status: 'completed' }).populate("items.product");
        if (!order) {
            return res.status(404).json({ success: false, message: "order not found" })
        }
        res.status(200).json({ succesL: true, message: "order found", data: order })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

exports.cancelledOrderDetails = async (req, res) => {
    try {
        if (!req.isAuth) {
            return res.status(403).json({ success: false, message: "Not Authenticated" });
        }
        const order = await Order.find({ status: 'cancelled' }).populate("items.product");
        if (!order) {
            return res.status(404).json({ success: false, message: "order not found" })
        }
        res.status(200).json({ succesL: true, message: "order found", data: order })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

exports.deleteOrder = async (req, res) => {
    const orderId = req.params.orderId
    try {
        if (!req.isAuth) {
            return res.status(403).json({ success: false, message: "Not Authenticated" });
        }
        const order = await Order.findByIdAndDelete(orderId)
        if (!order) {
            return res.status(400).json({ success: false, message: "order not deleted" })
        }
        res.status(200).json({ success: true, message: "order deleted" })
    } catch (error) {
        res.status(500).json({ success: false, error: error.message })
    }
}

