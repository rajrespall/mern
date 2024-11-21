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

//get reviews per product
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

//get unreviewed products per user
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

//get reviews per user
export const getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.userId })
      .populate('product', 'name')
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching user reviews', 
      error: error.message 
    });
  }
};

//update review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, text } = req.body;
    const userId = req.userId;

    // Find review and verify ownership
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to edit this review' });
    }

    // Handle image uploads if any
    let images = review.images; // Keep existing images by default
    if (req.files && req.files.length > 0) {
      // Delete old images from cloudinary
      for (const image of review.images) {
        if (image.cloudinary_id) {
          await cloudinary.uploader.destroy(image.cloudinary_id);
        }
      }

      // Upload new images
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

    // Update review
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      {
        rating,
        text,
        images,
      },
      { new: true }
    ).populate('user', 'name profileImage')
     .populate('product', 'name');

    res.status(200).json(updatedReview);

  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ 
      message: 'Error updating review', 
      error: error.message 
    });
  }
};

//get all reviews
export const getAllReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const filterRating = req.query.rating ? parseInt(req.query.rating) : null;

    // Build filter object
    const filter = {};
    if (filterRating) {
      filter.rating = filterRating;
    }

    // Get total count
    const total = await Review.countDocuments(filter);

    // Get reviews with pagination and filters
    const reviews = await Review.find(filter)
      .populate('user', 'name email profileImage')
      .populate('product', 'name price images')
      .sort({ [sortField]: sortOrder })
      .skip((page - 1) * limit)
      .limit(limit);

    // Calculate stats
    const stats = {
      totalReviews: total,
      averageRating: await Review.aggregate([
        { $group: {
          _id: null,
          avg: { $avg: "$rating" }
        }}
      ]).then(result => result[0]?.avg.toFixed(1) || 0),
      ratingDistribution: await Review.aggregate([
        { $group: {
          _id: "$rating",
          count: { $sum: 1 }
        }},
        { $sort: { _id: 1 } }
      ])
    };

    res.status(200).json({
      success: true,
      stats,
      reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};