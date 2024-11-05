import React, { useState } from "react";
import { FaCoffee, FaMugHot, FaGlassWhiskey, FaStar, FaTimes } from "react-icons/fa";
import OrderDetailsModal from "./OrderDetailsModal"; 

const CartCard = ({ isOpen, onClose, title, images = [], rating = 4.5, price = "$12.99" }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [temperature, setTemperature] = useState("hot");
  const [size, setSize] = useState("small");
  const [origin, setOrigin] = useState("Ethiopian Coffee");
  const [quantity, setQuantity] = useState(1);
  const [showOrderDetails, setShowOrderDetails] = useState(false); // State for the order details modal

  const handleAddToOrder = () => {
    setShowOrderDetails(true); // Open the modal when the order is added
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleImageClick = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded-lg w-128 flex relative">
        {/* Close Icon */}
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-600 hover:text-gray-800">
          <FaTimes size={20} />
        </button>

        {/* Left Side: Images */}
        <div className="flex-none mr-4">
          <div className="w-64 h-64 overflow-hidden rounded-lg cursor-pointer" onClick={handleImageClick}>
            <img
              src={images[currentImageIndex]}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300"
              style={{ display: 'block' }}
            />
          </div>

          {/* Item Details: Title, Rating, and Price */}
          <div className="mt-2 text-center">
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="flex items-center justify-center gap-1 text-yellow-500 mt-1">
              {[...Array(Math.floor(rating))].map((_, index) => (
                <FaStar key={index} />
              ))}
              {rating % 1 !== 0 && <FaStar style={{ color: '#ffcc00' }} />}
              <span className="text-sm text-gray-500 ml-1">({rating})</span>
            </div>
            <div className="text-lg font-bold text-gray-800 mt-1">{price}</div>
          </div>
        </div>

        {/* Right Side: Customization */}
        <div className="flex-1">
          {/* Temperature Selection */}
          <div className="mt-4">
            <label className="block mb-2">Select Temperature:</label>
            <div className="flex">
              <button
                onClick={() => setTemperature("hot")}
                className={`px-4 py-2 rounded-lg ${temperature === "hot" ? "bg-[#0c3a6d] text-white hover:text-[#b1d4f7]" : "bg-gray-200"}`}
              >
                Hot
              </button>
              <button
                onClick={() => setTemperature("cold")}
                className={`px-4 py-2 rounded-lg ${temperature === "cold" ? "bg-[#0c3a6d] text-white hover:text-[#b1d4f7]" : "bg-gray-200"}`}
              >
                Cold
              </button>
            </div>
          </div>

          {/* Size Selection */}
          <div className="mt-4">
            <label className="block mb-2">Select Size:</label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSize("small")}
                className={`flex items-center px-4 py-2 border rounded-lg ${size === "small" ? "border-2 border-white bg-[#0c3a6d] text-white hover:text-[#b1d4f7]" : "border-gray-300"}`}
              >
                <FaMugHot size={24} />
                Small
              </button>
              <button
                onClick={() => setSize("medium")}
                className={`flex items-center px-4 py-2 border rounded-lg ${size === "medium" ? "border-2 border-white bg-[#0c3a6d] text-white hover:text-[#b1d4f7]" : "border-gray-300"}`}
              >
                <FaCoffee size={24} />
                Medium
              </button>
              <button
                onClick={() => setSize("large")}
                className={`flex items-center px-4 py-2 border rounded-lg ${size === "large" ? "bg-[#0c3a6d] text-white hover:text-[#b1d4f7]" : "border-gray-300"}`}
              >
                <FaGlassWhiskey size={24} />
                Large
              </button>
            </div>
          </div>

          {/* Origin Selection */}
          <div className="mt-4">
            <label className="block mb-2">Select Origin:</label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="Ethiopian Coffee">Ethiopian Coffee</option>
              <option value="Brazilian Coffee">Brazilian Coffee</option>
              <option value="Vietnamese Coffee">Vietnamese Coffee</option>
            </select>
          </div>

          {/* Quantity Section */}
          <div className="flex items-center mt-4">
            <button onClick={decrementQuantity} className="px-2 py-1 border rounded-lg">-</button>
            <span className="mx-2">{quantity}</span>
            <button onClick={incrementQuantity} className="px-2 py-1 border rounded-lg">+</button>
          </div>

          <button
            onClick={handleAddToOrder}
            className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Add to Order
          </button>
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal 
        isOpen={showOrderDetails} 
        onClose={() => setShowOrderDetails(false)} 
        onCartClose={onClose} // Pass onClose function to close cart modal
        orderDetails={{ title, temperature, size, origin, quantity }} 
      />
    </div>
  );
};

export default CartCard;
