import React, { useState } from "react";
import { FaCoffee, FaMugHot, FaGlassWhiskey, FaStar, FaTimes } from "react-icons/fa";
import OrderDetailsModal from "./OrderDetailsModal"; 

const CartCard = ({ isOpen, onClose, product }) => {
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
    if (product?.images?.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
    }
  };

  if (!isOpen || !product) return null;

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
              src={product.images?.[currentImageIndex]?.url || product.images?.[0]?.url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300"
              style={{ display: 'block' }}
            />
          </div>

          {/* Item Details: Title, Rating, and Price */}
          <div className="mt-2 text-center">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <div className="text-lg font-bold text-gray-800 mt-1">₱{product.price}</div>
          </div>
        </div>

        <div className="flex-1">
          <div className="mt-4">
            <label className="block mb-2">Select Temperature:</label>
            <div className="flex">
              {["hot", "cold"].map((temp) => (
                <button
                  key={temp}
                  onClick={() => setTemperature(temp)}
                  className={`px-4 py-2 rounded-lg ${
                    temperature === temp ? "bg-[#0c3a6d] text-white hover:text-[#b1d4f7]" : "bg-gray-200"
                  }`}
                >
                  {temp.charAt(0).toUpperCase() + temp.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mt-4">
            <label className="block mb-2">Select Size:</label>
            <div className="flex gap-2 flex-wrap">
              {[
                { size: "small", icon: FaMugHot },
                { size: "medium", icon: FaCoffee },
                { size: "large", icon: FaGlassWhiskey }
              ].map(({ size: sizeOption, icon: Icon }) => (
                <button
                  key={sizeOption}
                  onClick={() => setSize(sizeOption)}
                  className={`flex items-center px-4 py-2 border rounded-lg ${
                    size === sizeOption
                      ? "border-2 border-white bg-[#0c3a6d] text-white hover:text-[#b1d4f7]"
                      : "border-gray-300"
                  }`}
                >
                  <Icon size={24} className="mr-2" />
                  {sizeOption.charAt(0).toUpperCase() + sizeOption.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Origin Selection */}
          <div className="mt-4">
            <label className="block mb-2">Select Origin:</label>
            <select
              value={product.category}
              disabled
              className="w-full p-2 border rounded-lg bg-gray-100"
            >
              <option value={product.category}>{product.category}</option>
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
        orderDetails={{
          productId: product._id,
          title: product.name,
          price: product.price,
          temperature,
          size,
          origin: product.category,
          quantity,
          images: product.images
        }} 
      />
    </div>
  );
};

export default CartCard;
