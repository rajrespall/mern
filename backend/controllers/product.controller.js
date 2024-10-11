// prodController.js
import { Product } from "../models/product.model.js";
import APIFeatures from "../utils/api-features.js";

import {
  uploadImage,
  deleteImage,
  checkImageExists,
} from "../utils/cloudinary.js";

export const getProducts = async (req, res) => {
  try {
    const features = new APIFeatures(Product.find(), req.query)
      .search()
      .filter()
      .pagination(20);

    const products = await features.query;

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOneProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const productData = req.body;

    if (req.file) {
      const result = await uploadImage(req.file.buffer, {
        folder: "products",
      });
      productData.imageUrl = result.secure_url;
      productData.imagePublicId = result.public_id;
    }

    const newProduct = new Product(productData);
    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: savedProduct,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "An error occurred while adding the product",
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    let updatedData = req.body;
    const existingProduct = await Product.findById(req.params.id);

    if (!existingProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (req.file) {
      // Delete old image if it exists
      if (existingProduct.imagePublicId) {
        await deleteImage(existingProduct.imagePublicId);
      }

      // Upload new image
      const result = await uploadImage(req.file.buffer, {
        folder: "products",
      });
      updatedData.imageUrl = result.secure_url;
      updatedData.imagePublicId = result.public_id;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "An error occurred while updating the product",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (product.imagePublicId) {
      const publicId = product.imagePublicId;
      console.log(`Checking if image with publicId: ${publicId} exists`);

      try {
        await checkImageExists(publicId);
        const result = await deleteImage(publicId);

        if (result.result === "ok") {
          console.log("Image deleted successfully from Cloudinary:", publicId);
        } else {
          console.error(
            "Failed to delete product image from Cloudinary:",
            result
          );
          return res.status(500).json({
            success: false,
            message:
              "Failed to delete product image from Cloudinary: " +
              JSON.stringify(result),
          });
        }
      } catch (error) {
        console.error("Image not found on Cloudinary:", error.message);
      }
    } else {
      console.log(
        "No imagePublicId found for this product, skipping Cloudinary deletion."
      );
    }

    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found after deletion attempt",
      });
    }

    console.log("Product deleted successfully:", deletedProduct._id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error while deleting product:", error);
    res.status(500).json({
      success: false,
      message: error.message || "An error occurred while deleting the product",
    });
  }
};
