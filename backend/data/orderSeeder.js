import mongoose from 'mongoose';
import { Order } from '../models/order.model.js';
import { User } from '../models/user.model.js';
import { Product } from '../models/product.model.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

const seedOrders = async () => {
    await connectDB();

    // Clear existing orders
    await Order.deleteMany();

    // Fetch users and products
    const users = await User.find();
    const products = await Product.find();

    if (users.length === 0 || products.length === 0) {
        console.error('No users or products found. Please seed users and products first.');
        process.exit(1);
    }

    const orders = [];

    // Generate orders for each month of the current year
    const currentYear = new Date().getFullYear();
    for (let month = 0; month < 12; month++) {
        const orderDate = new Date(currentYear, month, Math.floor(Math.random() * 28) + 1);

        const orderItems = products.slice(0, 3).map(product => ({
            product: product._id,
            quantity: Math.floor(Math.random() * 5) + 1,
        }));

        const itemsPrice = orderItems.reduce((acc, item) => acc + item.quantity * products.find(p => p._id.equals(item.product)).price, 0);
        const taxPrice = itemsPrice * 0.1;
        const shippingPrice = 10;
        const totalPrice = itemsPrice + taxPrice + shippingPrice;

        const order = new Order({
            user: users[Math.floor(Math.random() * users.length)]._id,
            orderItems,
            shippingAddress: {
                address: '123 Main St',
                city: 'Anytown',
                postalCode: '12345',
                country: 'USA',
            },
            paymentInfo: {
                id: 'payment_id',
                status: 'Paid',
            },
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            orderStatus: 'Delivered',
            deliveredAt: orderDate,
            createdAt: orderDate,
            updatedAt: orderDate,
        });

        orders.push(order);
    }

    await Order.insertMany(orders);

    console.log('Orders seeded successfully');
    process.exit(0);
};

seedOrders();