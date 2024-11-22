import { create } from 'zustand';
import axios from 'axios';

const useOrderStore = create((set, get) => ({
  orders: [],
  dailyOrderStats: [],
  monthlySalesData: [],
  stats: {
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    shippedOrders: 0,
    cancelledOrders: 0
  },
  loading: false,
  error: null,

  // frontend/src/store/orderStore.js - Update fetchDailyOrderStats
  fetchDailyOrderStats: () => {
    const orders = get().orders;

    // Get dates for last 7 days 
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    // Count orders for each day
    const dailyStats = last7Days.map(date => {
      const count = orders.filter(order => {
        const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
        return orderDate === date;
      }).length;

      return {
        date: new Date(date).toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit'
        }),
        orders: count
      };
    });

    set({ dailyOrderStats: dailyStats });
  },

  fetchMonthlySales: () => {
    const orders = get().orders;

    const monthlySales = orders.reduce((acc, order) => {
      const month = new Date(order.createdAt).toLocaleString('en-US', { month: 'short' });
      const year = new Date(order.createdAt).getFullYear();
      const key = `${month} ${year}`;

      if (!acc[key]) {
        acc[key] = 0;
      }

      acc[key] += order.totalPrice;
      return acc;
    }, {});

    const monthlySalesData = Object.keys(monthlySales).map(key => ({
      month: key,
      sales: monthlySales[key]
    }));

    set({ monthlySalesData });
  },

  fetchUserOrders: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('http://localhost:5000/api/orders/user', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      set({ orders: response.data || [], loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error fetching orders', loading: false, orders: []});
    }
  },

  fetchAllOrders: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('http://localhost:5000/api/orders/admin/all', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const orders = response.data.orders;
      const stats = {
        totalOrders: orders.length,
        pendingOrders: orders.filter(order => order.orderStatus === 'Processing').length,
        completedOrders: orders.filter(order => order.orderStatus === 'Delivered').length,
        shippedOrders: orders.filter(order => order.orderStatus === 'Shipped').length,
        cancelledOrders: orders.filter(order => order.orderStatus === 'Cancelled').length,
        totalRevenue: orders.reduce((sum, order) => sum + order.totalPrice, 0)
      };

      set({ 
        orders: orders,
        stats: stats,
        loading: false 
      });
      get().fetchDailyOrderStats();
      get().fetchMonthlySales();
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