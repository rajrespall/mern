import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  text: {
    type: String,
    required: true
  },
  filteredText: {
    type: String,
  },
  images: [{
    url: String,
    cloudinary_id: String
  }]
}, { timestamps: true });

ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

export const Review = mongoose.model('Review', ReviewSchema);