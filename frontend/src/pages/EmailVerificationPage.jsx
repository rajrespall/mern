import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import { ArrowLeft, Mail } from "lucide-react";
import SNSImage from '../assets/img/SNS.png'; // Assuming you want to keep a similar illustration

const EmailVerificationPage = () => {
	const [code, setCode] = useState(["", "", "", "", "", ""]);
	const inputRefs = useRef([]);
	const navigate = useNavigate();

	const { error, isLoading, verifyEmail } = useAuthStore();

	const handleChange = (index, value) => {
		const newCode = [...code];

		// Handle pasted content
		if (value.length > 1) {
			const pastedCode = value.slice(0, 6).split("");
			for (let i = 0; i < 6; i++) {
				newCode[i] = pastedCode[i] || "";
			}
			setCode(newCode);

			// Focus on the last non-empty input or the first empty one
			const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
			const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
			inputRefs.current[focusIndex].focus();
		} else {
			newCode[index] = value;
			setCode(newCode);

			// Move focus to the next input field if value is entered
			if (value && index < 5) {
				inputRefs.current[index + 1].focus();
			}
		}
	};

	const handleKeyDown = (index, e) => {
		if (e.key === "Backspace" && !code[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const verificationCode = code.join("");
		try {
			await verifyEmail(verificationCode);
			navigate("/");
			toast.success("Email verified successfully");
		} catch (error) {
			console.log(error);
		}
	};

	// Auto submit when all fields are filled
	useEffect(() => {
		if (code.every((digit) => digit !== "")) {
			handleSubmit(new Event("submit"));
		}
	}, [code]);

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
                        <h2 className="font-bold text-2xl text-[#002D74] text-center">Verify Your Email</h2>
                        <p className='text-xs mt-4 text-[#002D74] text-center'>
                            Enter the 6-digit code sent to your email address.
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className='flex justify-between'>
                                {code.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type='text'
                                        maxLength='6'
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className='w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none'
                                    />
                                ))}
                            </div>
                            {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className='w-full py-2 bg-[#002D74] text-white font-bold rounded-xl hover:scale-105 duration-300'
                                type='submit'
                                disabled={isLoading || code.some((digit) => !digit)}
                            >
                                {isLoading ? "Verifying..." : "Verify Email"}
                            </motion.button>
                        </form>

                        <div className='flex justify-center py-4'>
                            <Link to={"/login"} className='text-sm text-[#002D74] hover:underline flex items-center'>
                                <ArrowLeft className='h-4 w-4 mr-2' /> Back to Login
                            </Link>
                        </div>
                    </div>

                    <div className="md:block hidden w-1/2">
                        <img className="rounded-2xl" src={SNSImage} alt="Email Verification Illustration" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
export default EmailVerificationPage;
