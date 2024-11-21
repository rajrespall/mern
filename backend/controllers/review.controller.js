import { Review } from '../models/review.model.js';
import { Order } from '../models/order.model.js';
import cloudinary from '../utils/cloudinary.js';

// Create review
export const createReview = async (req, res) => {
  try {
    const { productId, rating, text } = req.body;
    const userId = req.userId;

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

// backend/controllers/review.controller.js
export const getUnreviewedProducts = async (req, res) => {
  try {
    const userId = req.userId;

    // Find all delivered orders for the user
    const orders = await Order.find({
      user: userId,
      orderStatus: 'Delivered'
    }).populate('orderItems.product');

    // Get all products from orders, filtering out any null/undefined products
    const purchasedProducts = orders.reduce((acc, order) => {
      const validProducts = order.orderItems
        .filter(item => item.product && item.product._id) // Only include items with valid products
        .map(item => item.product);
      return [...acc, ...validProducts];
    }, []);

    if (purchasedProducts.length === 0) {
      return res.status(200).json([]); // Return empty array if no products found
    }

    // Find existing reviews by the user
    const existingReviews = await Review.find({
      user: userId,
      product: { $in: purchasedProducts.map(p => p._id) }
    });

    // Filter out products that have been reviewed
    const reviewedProductIds = existingReviews.map(review => review.product.toString());
    const unreviewedProducts = purchasedProducts.filter(
      product => !reviewedProductIds.includes(product._id.toString())
    );

    // Remove duplicates
    const uniqueUnreviewedProducts = [...new Map(
      unreviewedProducts.map(item => [item._id.toString(), item])
    ).values()];

    res.status(200).json(uniqueUnreviewedProducts);
  } catch (error) {
    console.error('Error in getUnreviewedProducts:', error);
    res.status(500).json({ 
      message: 'Error fetching unreviewed products', 
      error: error.message 
    });
  }
};