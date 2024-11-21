// src/store/cartStore.js
import { create } from 'zustand';
import axios from 'axios';

const useCartStore = create((set) => ({
  cartItems: [],
  loading: false,
  error: null,

  addToCart: async (productId, quantity) => {
    set({ loading: true });
    try {
      await axios.post('http://localhost:5000/api/cart', 
        { product: productId, quantity },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }}
      );
      
      // Refresh cart after adding
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      set({ cartItems: response.data.cartItems, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  
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

  checkout: async (checkoutData) => {
    set({ loading: true });
    try {
        const response = await axios.post(
            'http://localhost:5000/api/orders/checkout',
            {
                selectedItems: checkoutData.selectedItems,
                shippingAddress: checkoutData.shippingAddress
            },
            { 
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
            }
        );

        // Update cart to remove checked out items
        set(state => ({
            cartItems: state.cartItems.filter(item => 
                !checkoutData.selectedItems.includes(item._id)
            ),
            loading: false
        }));

        return response.data;
    } catch (error) {
        set({ error: error.message, loading: false });
        throw error;
    }
}
}));

export default useCartStore;