// src/stores/productStore.js
import { create } from 'zustand';
import axios from 'axios';

const useProductStore = create((set) => ({
  products: [],
  isLoading: false,
  error: null,

  // Fetch all products
  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      set({ products: response.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Add new product
  addProduct: async (productData) => {
    set({ isLoading: true });
    try {
      const formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (key === 'images') {
          productData[key].forEach(image => {
            formData.append('files', image);
          });
        } else {
          formData.append(key, productData[key]);
        }
      });

      const response = await axios.post('http://localhost:5000/api/products', formData);
      set(state => ({
        products: [...state.products, response.data],
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
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
      Object.keys(productData).forEach(key => {
        if (key === 'images' && Array.isArray(productData[key])) {
          productData[key].forEach(image => {
            formData.append('files', image);
          });
        } else {
          formData.append(key, productData[key]);
        }
      });

      const response = await axios.put(`http://localhost:5000/api/products/${id}`, formData);
      set(state => ({
        products: state.products.map(product => 
          product._id === id ? response.data : product
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  }
}));

export default useProductStore;