// frontend/src/store/reviewStore.js
import { create } from 'zustand';
import axios from 'axios';

const useReviewStore = create((set) => ({
  reviews: [],
  error: null,
  isLoading: false,
  unreviewedProducts: [],
  userReviews: [],
  allReviews: [],
  stats: {
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: []
  },
  pagination: null,

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
          formData.append('images', image);
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
  },
  
  fetchUserReviews: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get('http://localhost:5000/api/reviews/user', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      set({ userReviews: response.data, isLoading: false });
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Error fetching user reviews',
        isLoading: false 
      });
      throw error;
    }
  },

  updateReview: async (reviewId, reviewData) => {
    set({ isLoading: true });
    try {
      const formData = new FormData();
      formData.append('rating', reviewData.rating);
      formData.append('text', reviewData.text);
      
      if (reviewData.images) {
        reviewData.images.forEach(image => {
          formData.append('images', image);
        });
      }
  
      const response = await axios.put(
        `http://localhost:5000/api/reviews/${reviewId}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
  
      // Update userReviews state
      set(state => ({
        userReviews: state.userReviews.map(review =>
          review._id === reviewId ? response.data : review
        ),
        isLoading: false
      }));
  
      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Error updating review',
        isLoading: false 
      });
      throw error;
    }
  },

  fetchAllReviews: async (page = 1, limit = 10, sortField = 'createdAt', sortOrder = 'desc', rating = null) => {
    set({ isLoading: true });
    try {
      const params = new URLSearchParams({
        page,
        limit,
        sortField,
        sortOrder,
        ...(rating && { rating })
      });

      const response = await axios.get(`http://localhost:5000/api/reviews/admin/all?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      set({ 
        allReviews: response.data.reviews,
        stats: response.data.stats,
        pagination: response.data.pagination,
        isLoading: false 
      });

      return response.data;
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Error fetching all reviews',
        isLoading: false 
      });
      throw error;
    }
  },

  deleteReview: async (reviewId) => {
    set({ isLoading: true });
    try {
      await axios.delete(`http://localhost:5000/api/reviews/${reviewId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      set(state => ({
        allReviews: state.allReviews.filter(review => review._id !== reviewId),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Error deleting review',
        isLoading: false 
      });
      throw error;
    }
  }
}));

export default useReviewStore;