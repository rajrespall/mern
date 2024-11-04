import React, { useState } from 'react';
import { FaCartPlus } from 'react-icons/fa';

const OrderDetailsModal = ({ isOpen, onClose, onCartClose, orderDetails }) => {
  // Check if orderDetails is valid
  if (!isOpen) return null;
  if (!orderDetails) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-5 rounded-lg w-128 relative">
          <h2 className="text-lg font-bold mb-4">No Order Details Available</h2>
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
            aria-label="Close order details"
          >
            <span className="text-xl">✖</span>
          </button>
        </div>
      </div>
    );
  }

  const [isConfirming, setIsConfirming] = useState(false); // State for order confirmation

  const handleCartClose = () => {
    setIsConfirming(true); // Show confirmation state
    setTimeout(() => {
      setIsConfirming(false); // Reset state after a brief delay
      onClose(); // Close the order details modal
      onCartClose(); // Close the cart modal
    }, 1000); // Adjust timing as needed
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded-lg w-128 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
          aria-label="Close order details"
        >
          <span className="text-xl">✖</span>
        </button>

        <h2 className="text-lg font-bold mb-4">Order Details</h2>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div><strong>Title:</strong></div>
          <div>{orderDetails.title}</div>
          <div><strong>Temperature:</strong></div>
          <div>{orderDetails.temperature}</div>
          <div><strong>Size:</strong></div>
          <div>{orderDetails.size}</div>
          <div><strong>Origin:</strong></div>
          <div>{orderDetails.origin}</div>
          <div><strong>Quantity:</strong></div>
          <div>{orderDetails.quantity}</div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleCartClose} // Close the modal and the cart
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg"
            aria-label="Add to cart"
          >
            <FaCartPlus className="mr-2" /> {/* Cart icon */}
            {isConfirming ? 'Order Confirmed' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
