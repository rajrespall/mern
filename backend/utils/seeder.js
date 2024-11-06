import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from '../models/product.model.js'; // Adjust the path as needed
import products from '../data/products.js'; // Adjust the path as needed

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(error => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

// Function to insert sample data
const importData = async () => {
  try {
    await Product.deleteMany(); // Clear existing data
    await Product.insertMany(products); // Insert sample data

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error('Error with data import:', error);
    process.exit(1);
  }
};

// Run the import function
importData();
