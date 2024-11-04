import { motion } from "framer-motion";
import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import Input from "../components/Input";
import { ArrowLeft, Loader, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import SNSImage from '../assets/img/SNS.png'; // Assuming you want to keep a similar illustration

const ForgotPasswordPage = () => {
	const [email, setEmail] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	const { isLoading, forgotPassword } = useAuthStore();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await forgotPassword(email);
		setIsSubmitted(true);
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
						<h2 className="font-bold text-2xl text-[#002D74] text-center">Forgot Password</h2>

						{!isSubmitted ? (
							<form onSubmit={handleSubmit} className="flex flex-col gap-4">
								<p className='text-xs mt-4 text-[#002D74] text-center'>
									Enter your email address and we'll send you a link to reset your password.
								</p>
								<Input
									icon={Mail}
									type='email'
									placeholder='Email Address'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									className='w-full py-2 bg-[#002D74] text-white font-bold rounded-xl hover:scale-105 duration-300'
									type='submit'
								>
									{isLoading ? <Loader className='w-6 h-6 animate-spin mx-auto' /> : "Send Reset Link"}
								</motion.button>
							</form>
						) : (
							<div className='text-center'>
								<motion.div
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ type: "spring", stiffness: 500, damping: 30 }}
									className='w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4'
								>
									<Mail className='h-8 w-8 text-white' />
								</motion.div>
								<p className='text-gray-300 mb-6'>
									If an account exists for {email}, you will receive a password reset link shortly.
								</p>
							</div>
						)}
						
						<div className='flex justify-center py-4'>
							<Link to={"/login"} className='text-sm text-[#002D74] hover:underline flex items-center'>
								<ArrowLeft className='h-4 w-4 mr-2' /> Back to Login
							</Link>
						</div>
					</div>

					<div className="md:block hidden w-1/2">
						<img className="rounded-2xl" src={SNSImage} alt="Forgot Password Illustration" />
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default ForgotPasswordPage;
