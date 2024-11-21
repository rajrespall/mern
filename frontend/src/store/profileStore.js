import { create } from 'zustand';
import axios from 'axios';

const useProfileStore = create((set) => ({
  profile: null,
  loading: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true });
    try {
      const response = await axios.get('http://localhost:5000/api/profile', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      set({ profile: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error fetching profile', loading: false });
    }
  },

  updateProfile: async (profileData) => {
    set({ loading: true });
    try {
      const formData = new FormData();
      formData.append('firstName', profileData.firstName);
      formData.append('lastName', profileData.lastName);
      formData.append('contactNo', profileData.contactNo);
      formData.append('address', profileData.address);
      if (profileData.profileImage) {
        formData.append('profileImage', profileData.profileImage);
      }

      const response = await axios.put('http://localhost:5000/api/profile', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      set({ profile: response.data, loading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || 'Error updating profile', loading: false });
    }
  }
}));

export default useProfileStore;