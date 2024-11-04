import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Input from "../components/Input";
import { Loader, Lock, Mail, User, Eye, EyeOff } from "lucide-react"; // Added Eye and EyeOff
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import SNSImage from '../assets/img/SNS.png';
import { useAuthStore } from "../store/authStore";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const { signup, error, isLoading } = useAuthStore();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
        await signup(email, password, name);
        alert("Signup successful! Please check your email for verification."); // Alert or state-based notification
        navigate("/verify-email");
    } catch (error) {
        console.error(error);
    }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#e9e6de] to-[#0c3a6d]"> 
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center"
      >
        {/* Form Section */}
        <div className="md:w-1/2 px-5 md:px-8">
          <h2 className="font-bold text-2xl text-[#002D74]">Create Account</h2>
          <p className="text-xs mt-1 mb-5 text-[#002D74]">Create an account to get started</p>

          <form onSubmit={handleSignUp} className="flex flex-col gap-1">
            <Input
              icon={User}
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* Updated Password Input Section */}
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
            <PasswordStrengthMeter password={password} />

            {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}

            <motion.button
              className="bg-[#002D74] rounded-xl text-white mt-4 py-2 hover:scale-105 duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <Loader className="animate-spin mx-auto" size={24} /> : "Sign Up"}
            </motion.button>
          </form>

          <div className="mt-5 text-xs flex justify-between items-center text-[#002D74]">
            <p>Already have an account?</p>
            <button
              onClick={() => navigate('/login')}
              className="py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300"
            >
              Login
            </button>
          </div>
        </div>

        {/* Image Section */}
        <div className="md:block hidden w-1/2">
          <img className="rounded-2xl" src={SNSImage} alt="Register Illustration" />
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
