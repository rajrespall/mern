import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import SignUpPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import AdminDashboardPage from "./pages/AdminDashboardPage"; // Add this if you have a main admin dashboard page
import Home from "./pages/Home.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import Menu from "./pages/Menu/MenuPage.jsx";
import ProdPage from "./pages/Product/ProdPage.jsx";
import Feedbacks from "./pages/Feedback/Feedbacks";
import CartPage from "./pages/Cart/CartPage";
import Profile from "./pages/Profile";

// Admin imports
import Sidebar from "./admin/common/Sidebar";
import OverviewPage from "./admin/pages/OverviewPage";
import ProductsPage from "./admin/pages/ProductsPage";
import UsersPage from "./admin/pages/UsersPage";
import SalesPage from "./admin/pages/SalesPage";
import OrdersPage from "./admin/pages/OrdersPage";
import AnalyticsPage from "./admin/pages/AnalyticsPage";
import SettingsPage from "./admin/pages/SettingsPage";
import MenusPage from "./admin/pages/MenusPage";
import OriginsPage from "./admin/pages/OriginsPage";

const ProtectedRoute = ({ children, role }) => {
    const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

    if (isCheckingAuth) return <LoadingSpinner />;
    if (!isAuthenticated) { return <Navigate to='/login' replace />;}
    if (!user.isVerified) { return <Navigate to='/verify-email' replace />;}
    if (role && user.role !== role) {   return <Navigate to='/' replace />; }

    return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
    const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

    if (isCheckingAuth) return <LoadingSpinner />;

    if (isAuthenticated) {
        if (user.role === "admin") {
            return <Navigate to='/admin/overview' replace />; 
        }
        if (user.role ==="customer" && user.isVerified) {
            return <Navigate to='/home' replace />; 
        }
    }

    return children;
};

function App() {
    const { isCheckingAuth, checkAuth } = useAuthStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth) return <LoadingSpinner />;

    return (
        <div>
            <Routes>
                {/* Main landing page */}
                <Route path='/' element={<Navbar />} />
                {/* Home for authenticated customer */}
                <Route
                    path='/home'
                    element={
                        <ProtectedRoute role="customer">
                            <Navbar />
                            <Home />
                        </ProtectedRoute>
                    }
                />

                {/* Profile Route */}
                <Route
                    path='/profile' 
                    element={
                        <ProtectedRoute role="customer">
                            <Navbar />
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                {/* Cart Route */}
                <Route
                    path='/cart'
                    element={
                        <ProtectedRoute role="customer">
                            <Navbar />
                            <CartPage />
                        </ProtectedRoute>
                    }
                />

                {/* Menu Route */}
                <Route
                    path='/menu'
                    element={
                        <ProtectedRoute role="customer">
                            <Navbar />
                            <Menu />
                        </ProtectedRoute>
                    }
                />

                {/* Product Page Route */}
                <Route
                    path='/products'
                    element={
                        <ProtectedRoute role="customer">
                            <Navbar />
                            <ProdPage />
                        </ProtectedRoute>
                    }
                />

                {/* Feedback Route */}
                <Route
                    path='/feedbacks'
                    element={
                        <ProtectedRoute role="customer">
                            <Navbar />
                            <Feedbacks />
                        </ProtectedRoute>
                    }
                />

                {/* Admin Pages with Sidebar */}
                <Route
                    path='/admin/*'
                    element={
                        <ProtectedRoute role="admin">
                            <div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
                                {/* Background */}
                                <div className='fixed inset-0 z-0'>
                                    <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
                                    <div className='absolute inset-0 backdrop-blur-sm' />
                                </div>
                                <Sidebar />
                                <Routes>
                                    <Route path='overview' element={<OverviewPage />} />
                                    <Route path='menus' element={<MenusPage />} />
                                    <Route path='products' element={<ProductsPage />} />
                                    <Route path='users' element={<UsersPage />} />
                                    <Route path='sales' element={<SalesPage />} />
                                    <Route path='orders' element={<OrdersPage />} />
                                    <Route path='analytics' element={<AnalyticsPage />} />
                                    <Route path='settings' element={<SettingsPage />} />
                                    <Route path='origins' element={<OriginsPage />} />
                                </Routes>
                            </div>
                        </ProtectedRoute>
                    }
                />

                <Route path="/signup" element={<RedirectAuthenticatedUser><SignUpPage /></RedirectAuthenticatedUser>} />

                <Route
                    path='/login'
                    element={
                        <RedirectAuthenticatedUser>
                            <LoginPage />
                        </RedirectAuthenticatedUser>
                    }
                />
                <Route path='/verify-email' element={<EmailVerificationPage />} />
                <Route
                    path='/forgot-password'
                    element={
                        <RedirectAuthenticatedUser>
                            <ForgotPasswordPage />
                        </RedirectAuthenticatedUser>
                    }
                />
                <Route
                    path='/reset-password/:token'
                    element={
                        <RedirectAuthenticatedUser>
                            <ResetPasswordPage />
                        </RedirectAuthenticatedUser>
                    }
                />

                {/* Catch all routes */}
                <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
            <Toaster />
        </div>
    );
}

export default App;
