// frontend/src/store/reviewStore.js
import { create } from 'zustand';
import axios from 'axios';

const useReviewStore = create((set) => ({
  error: null,
  isLoading: false,

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
  }
}));

export default useReviewStore;