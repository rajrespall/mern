import { Navigate, Route, Routes } from "react-router-dom";
import SignUpPage from "./pages/SignupPage.jsx";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import Home from "./pages/Home.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Navbar from "./components/Navbar";
import LoadingSpinner from "./components/LoadingSpinner";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import Menu from "./pages/Menu/MenuPage.jsx";
import ProdPage from "./pages/Product/ProdPage.jsx"; // Import the ProdPage component
import Feedbacks from "./pages/Feedback/Feedbacks"; // Import the Feedbacks component
import CartPage from "./pages/Cart/CartPage"; // Import the CartPage component
import Profile from "./pages/Profile"; // Import the Profile component

const ProtectedRoute = ({ children, role }) => {
    const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

    if (isCheckingAuth) return <LoadingSpinner />;

    if (!isAuthenticated) {
        return <Navigate to='/login' replace />;
    }

    if (!user.isVerified) {
        return <Navigate to='/verify-email' replace />;
    }

    if (role && user.role !== role) {
        return <Navigate to='/' replace />;
    }

    return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
    const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

    if (isCheckingAuth) return <LoadingSpinner />;

    if (isAuthenticated && user.isVerified) {
        return <Navigate to='/home' replace />;
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
                            <Navbar /> {/* Include Navbar here */}
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
                            <Profile /> {/* Add Profile component */}
                        </ProtectedRoute>
                    }
                />

                {/* Cart Route */}
                <Route
                    path='/cart'
                    element={
                        <ProtectedRoute role="customer">
                            <Navbar />
                            <CartPage /> {/* Add CartPage component */}
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
                            <ProdPage /> {/* Add ProdPage component */}
                        </ProtectedRoute>
                    }
                />

                {/* Feedback Route */}
                <Route
                    path='/feedbacks'
                    element={
                        <ProtectedRoute role="customer">
                            <Navbar />
                            <Feedbacks /> {/* Add Feedbacks component */}
                        </ProtectedRoute>
                    }
                />

                {/* Admin-specific route */}
                <Route
                    path='/admin-dashboard'
                    element={
                        <ProtectedRoute role="admin">
                            <AdminDashboardPage />
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

                {/* catch all routes */}
                <Route path='*' element={<Navigate to='/' replace />} />
            </Routes>
            <Toaster />
        </div>
    );
}

export default App;
