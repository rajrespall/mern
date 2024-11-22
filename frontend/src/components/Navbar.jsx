import React, { useState, useEffect } from 'react';
import logo from '../assets/img/logo.png';
import snsLogo from '../assets/img/SnSlogo.png';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AiOutlineClose, AiOutlineMenuUnfold, AiOutlineShoppingCart, AiOutlineSearch } from "react-icons/ai";
import profilePic from '../assets/img/profile.png'; // Adjust this path to your actual profile image
import { useAuthStore } from "../store/authStore"; // Import the auth store for logout
import { motion } from 'framer-motion';
import useProfileStore from '../store/profileStore' ;

const Navbar = () => {
  const { profile, fetchProfile } = useProfileStore();
  const [menu, setMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Logging out state
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleChange = () => {
    setMenu(!menu);
  };

  const closeMenu = () => {
    setMenu(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log(searchTerm); // Replace with your search functionality
  };

  const toggleSearchBar = () => {
    setIsSearchOpen(!isSearchOpen); // Toggle search bar visibility
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle dropdown visibility
  };

  const handleLogout = async () => {
    setIsLoggingOut(true); // Set logging out state to true
    try {
      await logout();
      navigate('/Login');
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false); // Reset logging out state
    }
  };

  return (
    <div className="fixed w-full z-10">
      <div className="flex flex-row justify-between p-4 lg:px-32 px-4 bg-gradient-to-r from-[#fffdf9] to-[#134278]">
        <div className="flex flex-row items-center cursor-pointer gap-2">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
          <img src={snsLogo} alt="Sip & Scripts Logo" className="h-14 w-auto" />
        </div>

        <nav className="hidden md:flex flex-row items-center text-2xl font-medium gap-8 navbar-header">
          <RouterLink to="/home" className="group relative inline-block hover:text-blue-200 transition-all cursor-pointer">
            Home
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-black transform scale-x-0 origin-left transition-transform group-hover:scale-x-100"></span>
          </RouterLink>
          <RouterLink to="/menu" className="group relative inline-block hover:text-blue-200 transition-all cursor-pointer">
            Menu
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-black transform scale-x-0 origin-left transition-transform group-hover:scale-x-100"></span>
          </RouterLink>
          {/* <RouterLink to="/products" className="group relative inline-block cursor-pointer hover:text-blue-200">
            Products
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-black transform scale-x-0 origin-left transition-transform group-hover:scale-x-100"></span>
          </RouterLink> */}
          <RouterLink to="/feedbacks" className="group relative inline-block hover:text-blue-200 transition-all cursor-pointer">
            Feedbacks
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-200 transform scale-x-0 origin-left transition-transform group-hover:scale-x-100"></span>
          </RouterLink>
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <RouterLink to="/cart" className="hover:text-blue-200 transition-all cursor-pointer">
            <AiOutlineShoppingCart size={30} />
          </RouterLink>
          <AiOutlineSearch size={30} className="cursor-pointer hover:text-blue-200" onClick={toggleSearchBar} />

          {/* Profile Picture Icon with Dropdown */}
          
          {isAuthenticated ? (
          // Show profile picture and dropdown when logged in
          <div className="relative">
            <img
              src={profile?.profileImage?.url}
              alt="Profile"
              className="h-11 w-11 rounded-full cursor-pointer"
              onClick={toggleDropdown}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                <RouterLink to="/profile" className="block px-4 py-2 text-black hover:bg-gray-200">
                  View Profile
                </RouterLink>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="block w-full text-left px-4 py-2 text-black hover:bg-gray-200"
                >
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </motion.button>
              </div>
            )}
          </div>
        ) : (
          // Show sign in button when logged out
          <RouterLink to="/signup" className="hover:text-blue-200 transition-all cursor-pointer">
            <button className="px-6 py-1 border-2 border-white bg-[#0c3a6d] text-white hover:text-[#8b98a7] transition-all rounded-full">
              Sign In
            </button>
          </RouterLink>
        )}
      </div>

        <div className="md:hidden flex items-center">
          {menu ? (
            <AiOutlineClose size={25} onClick={handleChange} />
          ) : (
            <AiOutlineMenuUnfold size={25} onClick={handleChange} />
          )}
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="flex justify-center mt-2">
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
            <button type="submit" className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Search</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Navbar;
