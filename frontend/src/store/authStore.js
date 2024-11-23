import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api/auth" : "/api/auth";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
	user: null,
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	message: null,
	role: null,

	signup: async (email, password, name) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/signup`, { email, password, name });
			set({
				user: response.data.user,
				isAuthenticated: true,
				role: response.data.user.role, // Set role after signup
				isLoading: false
			});
		} catch (error) {
			set({ error: error.response.data.message || "Error signing up", isLoading: false });
			throw error;
		}
	},

	login: async (email, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/login`, { email, password });
			set({
				isAuthenticated: true,
				user: response.data.user,
				role: response.data.user.role, // Set role after login
				error: null,
				isLoading: false,
			});
		} catch (error) {
			set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
			throw error;
		}
	},

	logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout`);
			set({ user: null, isAuthenticated: false, role: null, error: null, isLoading: false }); // Reset role
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},

	verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/verify-email`, { code });
			set({
				user: response.data.user,
				isAuthenticated: true,
				role: response.data.user.role, // Set role after email verification
				isLoading: false
			});
			return response.data;
		} catch (error) {
			set({ error: error.response.data.message || "Error verifying email", isLoading: false });
			throw error;
		}
	},
	
	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get(`${API_URL}/check-auth`);
			const user = response.data.user;
			const isAuthenticated = true;

			// Log the authentication and verification status
			console.log("isAuthenticated:", isAuthenticated);
			console.log("isVerified:", user?.isVerified);

			set({
				user: user,
				isAuthenticated: isAuthenticated,
				role: user.role, // Set role on authentication check
				isCheckingAuth: false
			});
		} catch (error) {
			set({ error: null, isCheckingAuth: false, isAuthenticated: false, role: null });
		}
	},

	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/forgot-password`, { email });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error sending reset password email",
			});
			throw error;
		}
	},

	resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},

	facebookLogin: async (accessToken) => {
		set({ isLoading: true, error: null });
		try {
		  const response = await axios.post(`${API_URL}/facebook`, { accessToken });
		  set({
			user: response.data.user,
			isAuthenticated: true,
			role: response.data.user.role,
			isLoading: false,
		  });
		} catch (error) {
		  set({ error: error.response?.data?.message || "Error logging in with Facebook", isLoading: false });
		  throw error;
		}
	  },
}));
