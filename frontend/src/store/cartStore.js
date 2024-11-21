// src/store/cartStore.js
import { create } from 'zustand';
import axios from 'axios';

const useCartStore = create((set) => ({
  cartItems: [],
  loading: false,
  error: null,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      set({ cartItems: response.data.cartItems, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateQuantity: async (productId, quantity) => {
    set({ loading: true });
    try {
      await axios.put('http://localhost:5000/api/cart/update-quantity', 
        { productId, quantity },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }}
      );
      set(state => ({
        cartItems: state.cartItems.map(item => 
          item.product._id === productId 
            ? { ...item, quantity } 
            : item
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  removeItem: async (productId) => {
    set({ loading: true });
    try {
      await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      set(state => ({
        cartItems: state.cartItems.filter(item => item.product._id !== productId),
        loading: false
      }));
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  checkout: async (shippingAddress) => {
    set({ loading: true });
    try {
      await axios.post('http://localhost:5000/api/orders/checkout',
        { shippingAddress },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }}
      );
      set({ cartItems: [], loading: false });
      return true;
    } catch (error) {
      set({ error: error.message, loading: false });
      return false;
    }
  }
}));

export default useCartStore;