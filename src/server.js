require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')

const userRoutes = require('../routes/user');
const productRoutes = require('../routes/product');
const customerRoutes = require('../routes/customer');
const orderRoutes = require('../routes/order');

const app = express();
const PORT = 5000

// "http://localhost:5173", "http://localhost:5174", 

app.use(cors({
    origin: ["https://www.purecots.com", "https://inventory-admin-xi.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(cookieParser())

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get('/', (req, res) => {
    res.send("testing");
});

app.use('/admin', userRoutes);
app.use('/product', productRoutes);
app.use('/customer', customerRoutes);
app.use('/order', orderRoutes);

// Ensure a single database connection is reused across invocations
let isConnected = false;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        if (!isConnected) {
            console.log("DB connected");
            isConnected = true;
        }
    })
    .catch((error) => {
        console.error(error.message);
    });

app.listen(PORT, '0.0.0.0', () => {
    console.log('Server running', PORT);
});


// module.exports.handler = serverless(app);  // Wrap the app for serverless deployment
