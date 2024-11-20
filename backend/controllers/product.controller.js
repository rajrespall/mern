import { Product } from '../models/product.model.js';
import cloudinary from '../utils/cloudinary.js';

export const createProduct = async (req, res) => {
  const { name, description, price, category, stock } = req.body;
  try {
    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              url: result.secure_url,
              cloudinary_id: result.public_id
            });
          }
        });
        uploadStream.end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);

    const images = results.map(result => ({
      url: result.url,
      cloudinary_id: result.cloudinary_id
    }));

    const newProduct = new Product({
      name, description, price, category, stock,
      images
    });

    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error uploading images:', error);
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
  const { name, description, price, category } = req.body;
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    let updatedData = { name, description, price, category };

    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      for (const image of product.images) {
        await cloudinary.uploader.destroy(image.cloudinary_id);
      }

      // Upload new images
      const uploadPromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve({
                url: result.secure_url,
                cloudinary_id: result.public_id
              });
            }
          });
          uploadStream.end(file.buffer);
        });
      });

      const results = await Promise.all(uploadPromises);

      const images = results.map(result => ({
        url: result.url,
        cloudinary_id: result.cloudinary_id
      }));

      updatedData.images = images;
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

    // Delete all images associated with the product from cloudinary
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map(image => {
        if (image.cloudinary_id) {
          return cloudinary.uploader.destroy(image.cloudinary_id);
        }
        return Promise.resolve(); // Skip if no cloudinary_id
      });

      await Promise.all(deletePromises);
    }

    // Delete the product from database
    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({ 
      success: true, 
      message: "Product and associated images deleted successfully" 
    });

  } catch (error) {
    console.error("Error deleting product: ", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message || error
    });
  }
};

export const bulkDeleteProducts = async (req, res) => {
  try {
    const { ids } = req.body;
    
    // Fetch all products to be deleted
    const products = await Product.find({ _id: { $in: ids } });
    
    // Delete images from cloudinary
    const deletePromises = products.flatMap(product => 
      product.images.map(image => {
        if (image.cloudinary_id) {
          return cloudinary.uploader.destroy(image.cloudinary_id);
        }
        return Promise.resolve();
      })
    );

    await Promise.all(deletePromises);
    
    // Delete products from database
    await Product.deleteMany({ _id: { $in: ids } });

    res.status(200).json({
      success: true,
      message: "Products deleted successfully"
    });

  } catch (error) {
    console.error("Error bulk deleting products:", error);
    res.status(500).json({
      success: false, 
      message: "Server error",
      error: error.message
    });
  }
};