import mongoose from "mongoose"

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
    image: {
      type: String,
      required: true,
    },
    cloudinary_id: {
      type: String,
    },
  }, { timestamps: true });

export const Product = mongoose.model("Product", ProductSchema);