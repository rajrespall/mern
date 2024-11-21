// frontend/src/store/reviewStore.js
import { create } from 'zustand';
import axios from 'axios';

const useReviewStore = create((set) => ({
  reviews: [],
  error: null,
  isLoading: false,
  unreviewedProducts: [],

  fetchProductReviews: async (productId) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`http://localhost:5000/api/reviews/product/${productId}`);
      set({ reviews: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Error fetching reviews',
        isLoading: false 
      });
      throw error;
    }
  },
    
  createReview: async (productId, reviewData) => {
    set({ isLoading: true });
    try {
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('rating', reviewData.rating);
      formData.append('text', reviewData.text);
      
      if (reviewData.images) {
        reviewData.images.forEach(image => {
          formData.append('files', image);
        });
      }

      const response = await axios.post('http://localhost:5000/api/reviews', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      set({ isLoading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Error creating review',
        isLoading: false 
      });
      throw error;
    }
  },
  
  fetchUnreviewedProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get('http://localhost:5000/api/reviews/unreviewed', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      set({ 
        unreviewedProducts: response.data,
        isLoading: false 
      });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Error fetching unreviewed products',
        isLoading: false 
      });
      throw error;
    }
  }
}));

export default useReviewStore;