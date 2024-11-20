// backend/controllers/review.controller.js
import { Review } from '../models/review.model.js';
import { Order } from '../models/order.model.js';
import cloudinary from '../utils/cloudinary.js';

// Create review
export const createReview = async (req, res) => {
  try {
    const { productId, rating, text } = req.body;
    const userId = req.userId;

    // Check if user has purchased the product
    const hasPurchased = await Order.findOne({
      user: userId,
      'orderItems.product': productId,
      orderStatus: 'Delivered'
    });

    if (!hasPurchased) {
      return res.status(403).json({
        message: 'You can only review products you have purchased and received'
      });
    }

    // Handle image uploads if any
    let images = [];
    if (req.files) {
      const uploadPromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) reject(error);
            else resolve({
              url: result.secure_url,
              cloudinary_id: result.public_id
            });
          }).end(file.buffer);
        });
      });
      images = await Promise.all(uploadPromises);
    }

    const review = new Review({
      user: userId,
      product: productId,
      rating,
      text,
      images
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error: error.message });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const reviews = await Review.find({ product: productId })
      .populate('user', 'name profileImage') 
      .sort({ createdAt: -1 }); 
    
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching product reviews', 
      error: error.message 
    });
  }
};
