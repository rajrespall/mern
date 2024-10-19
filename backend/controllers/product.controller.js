import { Product } from '../models/product.model.js';
import cloudinary from '../utils/cloudinary.js';
import fs from 'fs';

export const createProduct = async (req, res) => {
  const { name, description, price } = req.body;
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const newProduct = new Product({
      name, description, price,
      image: result.secure_url,
      cloudinary_id: result.public_id
    });
    await newProduct.save();
    fs.unlinkSync(req.file.path);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const updateProduct = async (req, res) => {
  const { name, description, price } = req.body;
  try {
      const product = await Product.findById(req.params.id);
      if (!product) {
          return res.status(404).json({ success: false, message: "Product not found" });
      }

      let updatedData = { name, description, price };

      if (req.file) {
          await cloudinary.uploader.destroy(product.cloudinary_id);

          const result = await cloudinary.uploader.upload(req.file.path);
          updatedData.image = result.secure_url;
          updatedData.cloudinary_id = result.public_id;

          fs.unlinkSync(req.file.path);
      }

      // Update product details
      const updatedProduct = await Product.findByIdAndUpdate(
          req.params.id,
          updatedData,
          { new: true } 
      );

      res.status(200).json(updatedProduct);

  } catch (error) {
      console.error("Error updating product: ", error); 

      res.status(500).json({
          success: false,
          message: "Server error",
          error: error.message || error 
      });
  }
};

export const deleteProduct = async (req, res) => {
  try {
      const product = await Product.findById(req.params.id);
      if (!product) {
          return res.status(404).json({ success: false, message: "Product not found" });
      }

      await cloudinary.uploader.destroy(product.cloudinary_id);

      await Product.findByIdAndDelete(req.params.id);

      res.status(200).json({ success: true, message: "Product deleted successfully" });

  } catch (error) {
      console.error("Error deleting product: ", error); 

      res.status(500).json({
          success: false,
          message: "Server error",
          error: error.message || error 
      });
  }
};
