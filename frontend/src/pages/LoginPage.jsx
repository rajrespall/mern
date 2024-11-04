import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader } from "lucide-react"; 
import Input from "../components/Input";
import { useAuthStore } from "../store/authStore";
import SNSImage from '../assets/img/SNS.png';
import { motion } from "framer-motion";

const LoginPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const { login, isLoading, error } = useAuthStore();
	const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		const success = await login(email, password);
		if (success) {
			navigate('/home');
		}
	};

	const handleRegisterClick = () => {
		navigate('/signup');
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
						<h2 className="font-bold text-2xl text-[#002D74]">Login</h2>
						<p className="text-xs mt-2 mb-4 text-[rgb(0,45,116)]">If you are already a member, easily log in</p>

						{error && <p className="text-red-500" aria-live="assertive">{error}</p>}

						<form onSubmit={handleLogin} className="flex flex-col gap-0">
							<Input
								icon={Mail}
								type="email"
								placeholder="Email Address"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>

							<div className="relative mb-6">
								<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
									<Lock className="size-5 text-[#002D74]" />
								</div>
								<input
									type={showPassword ? "text" : "password"}
									placeholder="Password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="w-full pl-10 pr-10 py-2 bg-[#e9e6de] bg-opacity-80 rounded-lg border border-[#0c3a6d] focus:border-[#002D74] focus:ring-2 focus:ring-[#002D74] text-[#0c3a6d] placeholder-[#002D74] transition duration-200"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#002D74]"
								>
									{showPassword ? <EyeOff /> : <Eye />}
								</button>
							</div>

							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								className="w-full py-2 bg-[#002D74] text-white font-bold rounded-xl hover:scale-105 duration-300"
								type="submit"
								disabled={isLoading}
							>
								{isLoading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Login"}
							</motion.button>
						</form>

						<div className="mt-6 grid grid-cols-3 items-center text-gray-400">
							<hr className="border-gray-400" />
							<p className="text-center text-sm">OR</p>
							<hr className="border-gray-400" />
						</div>

						<button className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-[#002D74]">
							Login with Google
						</button>

						<div className="mt-5 text-xs border-b border-[#002D74] py-4 text-[#002D74]">
							<Link to="/forgot-password">Forgot your password?</Link>
						</div>

						<div className="mt-3 text-xs flex justify-between items-center text-[#002D74]">
							<p>Don't have an account?</p>
							<button onClick={handleRegisterClick} className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300">
								Sign Up
							</button>
						</div>
					</div>

					<div className="md:block hidden w-1/2">
						<img className="rounded-2xl" src={SNSImage} alt="Login Illustration" />
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default LoginPage;
