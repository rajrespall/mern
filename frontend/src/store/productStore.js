// src/stores/productStore.js
import { create } from 'zustand';
import axios from 'axios';

const useProductStore = create((set) => ({
  products: [],
  isLoading: false,
  error: null,

  // Fetch all products with ratings
  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      // Get products
      const productsResponse = await axios.get('http://localhost:5000/api/products');
      const products = productsResponse.data;

      // Get reviews for each product
      const productsWithRatings = await Promise.all(
        products.map(async (product) => {
          try {
            const reviewsResponse = await axios.get(
              `http://localhost:5000/api/reviews/product/${product._id}`
            );
            const reviews = reviewsResponse.data;
            
            // Calculate average rating
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = reviews.length > 0 
              ? Number((totalRating / reviews.length).toFixed(1)) 
              : 0;

            return {
              ...product,
              rating: averageRating,
              reviewCount: reviews.length
            };
          } catch (error) {
            console.error(`Error fetching reviews for product ${product._id}:`, error);
            return {
              ...product,
              rating: 0,
              reviewCount: 0
            };
          }
        })
      );

      set({ 
        products: productsWithRatings, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: error.message, 
        isLoading: false 
      });
    }
  },

  // Add new product
  addProduct: async (productData) => {
    set({ isLoading: true });
    try {
      const formData = new FormData();
      
      // Append basic product data
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('category', productData.category);
      formData.append('stock', productData.stock);
  
      // Append each image file to formData with field name 'images'
      if (productData.images?.length > 0) {
        productData.images.forEach(image => {
          formData.append('images', image);
        });
      }
  
      const response = await axios.post('http://localhost:5000/api/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
  
      set(state => ({
        products: [...state.products, response.data],
        isLoading: false
      }));
      
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    set({ isLoading: true });
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      set(state => ({
        products: state.products.filter(product => product._id !== id),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    set({ isLoading: true });
    try {
      const formData = new FormData();
      
      // Append basic product data
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('category', productData.category);
      formData.append('stock', productData.stock);
  
      // Only append images if new ones are provided
      if (productData.images?.length > 0) {
        productData.images.forEach(image => {
          formData.append('images', image);
        });
      }
  
      const response = await axios.put(
        `http://localhost:5000/api/products/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
  
      set(state => ({
        products: state.products.map(product => 
          product._id === id ? response.data : product
        ),
        isLoading: false
      }));
      
      return response.data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  //bulk delete products
  bulkDeleteProducts: async (ids) => {
    set({ isLoading: true });
    try {
      await axios.post('http://localhost:5000/api/products/bulk-delete', { ids });
      
      set(state => ({
        products: state.products.filter(product => !ids.includes(product._id)),
        isLoading: false 
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));

export default useProductStore;