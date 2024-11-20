import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  cloudinary_id: {
    type: String,
    required: true,
  },
});

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: { 
    type: Number,
    required: true,
    default: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['Ethiopian', 'Brazilian', 'Vietnamese', 'Italian',  'Mexican', 'American', 'Other'],
  },
  images: [ImageSchema], // Array of image objects
}, { timestamps: true });

export const Product = mongoose.model("Product", ProductSchema);
