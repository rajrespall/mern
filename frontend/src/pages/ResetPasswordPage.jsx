import { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useNavigate, useParams, Link } from "react-router-dom";
import Input from "../components/Input";
import { Lock, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import SNSImage from '../assets/img/SNS.png'; // Assuming you want to keep a similar illustration

const ResetPasswordPage = () => {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const { resetPassword, error, isLoading, message } = useAuthStore();

	const { token } = useParams();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			alert("Passwords do not match");
			return;
		}
		try {
			await resetPassword(token, password);

			toast.success("Password reset successfully, redirecting to login page...");
			setTimeout(() => {
				navigate("/login");
			}, 2000);
		} catch (error) {
			console.error(error);
			toast.error(error.message || "Error resetting password");
		}
	};

	return (
		<div className="flex flex-col min-h-screen">
            <div className="flex items-center justify-center flex-grow bg-gradient-to-r from-[#e9e6de] to-[#0c3a6d]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center"
                >
                    <div className="md:w-1/2 px-8 md:px-16">
                        <h2 className="font-bold text-2xl text-[#002D74] text-center">Reset Password</h2>
                        <p className='text-xs mt-4 text-[#002D74] text-center'>
                            Enter your new password below.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <Input
                                icon={Lock}
                                type='password'
                                placeholder='New Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <Input
                                icon={Lock}
                                type='password'
                                placeholder='Confirm New Password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />

                            {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}
                            {message && <p className='text-green-500 text-sm mb-4'>{message}</p>}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className='w-full py-2 bg-[#002D74] text-white font-bold rounded-xl hover:scale-105 duration-300'
                                type='submit'
                                disabled={isLoading}
                            >
                                {isLoading ? "Resetting..." : "Set New Password"}
                            </motion.button>
                        </form>

                        <div className='flex justify-center py-4'>
                            <Link to={"/login"} className='text-sm text-[#002D74] hover:underline flex items-center'>
                                <ArrowLeft className='h-4 w-4 mr-2' /> Back to Login
                            </Link>
                        </div>
                    </div>

                    <div className="md:block hidden w-1/2">
                        <img className="rounded-2xl" src={SNSImage} alt="Reset Password Illustration" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
