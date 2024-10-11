import mongoose from "mongoose"

const ProductSchema = new mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    rating: {
        type: Number, 
        default: 0, 
        min: 0, 
        max: 5 
    },
    description: { 
        type: String, 
        required: true 
    },
    inStock: { 
        type: Boolean, 
        default: false 
    },
    stockQuantity: { 
        type: Number, 
        default: 0 
    },
    category: { 
        type: String, 
        required: true 
    },
    imageUrl: String,
    imagePublicId: String, 
  },{ timestamps: true }
);

ProductSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

export const Product = mongoose.model("Product", ProductSchema);