import { create } from 'zustand';
import axios from 'axios';

const useOrderStore = create((set) => ({
  orders: [],
  stats: {},
  loading: false,
  error: null,

  fetchUserOrders: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('http://localhost:5000/api/orders/user', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      set({ orders: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error fetching orders', loading: false});
    }
  },

  fetchAllOrders: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('http://localhost:5000/api/orders/admin/all', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      set({ 
        orders: response.data.orders,
        stats: response.data.stats,
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  updateOrderStatus: async (orderId, status) => {
    set({ loading: true });
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, 
        { orderStatus: status },
        { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }}
      );
      
      // Refresh orders after update
      const response = await axios.get('http://localhost:5000/api/orders/admin/all', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      set({ 
        orders: response.data.orders,
        stats: response.data.stats,
        loading: false 
      });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));

export default useOrderStore;