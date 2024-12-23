import React, { useState } from "react";
import { FaShoppingCart, FaComments } from "react-icons/fa";
import img1 from "@assets/img/Menu/2.png";
import img2 from "@assets/img/Menu/3.png";
import img3 from "@assets/img/Menu/8.png";
import img4 from "@assets/img/Menu/5.png"; 
import img5 from "@assets/img/Menu/6.png";
import img6 from "@assets/img/Menu/7.png";

import CartCard from "./OrderCard";
import ReviewsModal from "./ReviewsModal";

const MenuCard = ({ product }) => {
  const [currentIndex, setCurrentIndex] = useState(0); // State to track the current image index
  const [isCartOpen, setIsCartOpen] = useState(false); // State to track the cart modal visibility
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fallbackImage = img1;

  const handleImageClick = () => {
    if (product?.images?.length > 1) {
      const nextIndex = (currentIndex + 1) % product.images.length; 
      setCurrentIndex(nextIndex);
    }
   };

  const handleCartClick = () => {
    setIsCartOpen(true); // Open the cart modal
  };

  const handleCloseCart = () => {
    setIsCartOpen(false); // Close the cart modal
  };

  if (!product) return null;

  return (
    <>
      <div className="w-full lg:w-1/4 bg-white p-3 rounded-lg shadow-lg hover:shadow-2xl transition-transform duration-300 ease-in-out transform hover:scale-105">
        <div className="relative">
        <img
            className="rounded-xl cursor-pointer w-full h-64 object-cover"
            src={imageError ? fallbackImage : product.images?.[currentIndex]?.url}
            alt={product.name}
            onClick={handleImageClick}
            onError={(e) => {
              setImageError(true);
              e.target.src = fallbackImage;
            }}
          />
          {product.images?.length > 1 && !imageError && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
              {currentIndex + 1} / {product.images.length}
            </div>
          )}
        </div>
        <div className="p-2 mt-5 flex flex-col">
          <h3 className="font-semibold text-xl">{product.name}</h3>

          {/* Ratings Section */}
          <div className="flex items-center mt-1">
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index} className={index < (product.rating) ? "text-yellow-500" : "text-gray-300"}>
                ★
              </span>
            ))}
          </div>

          {/* Price and Cart Section */}
          <div className="flex justify-between items-center mt-2">
            <h3 className="font-semibold text-xl">₱{product.price}</h3>
            <span
              className="flex items-center border-white bg-[#e1e7fe] px-3 py-2 rounded-full hover:text-blue-200 cursor-pointer"
              onClick={() => setIsReviewsOpen(true)}
            >
              <FaComments size={20} />
            </span>
            <span
              className="flex items-center border-white bg-[#e1e7fe] px-3 py-2 rounded-full hover:text-blue-200 cursor-pointer"
              onClick={handleCartClick} // Open cart modal on click
            >
              <FaShoppingCart size={20} />
            </span>
          </div>
        </div>
      </div>
      {/* Include the CartCard modal here */}
      {isCartOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50" onClick={handleCloseCart}></div>
          <CartCard
            isOpen={isCartOpen}
            onClose={handleCloseCart}
            product={product} // Pass images or any other necessary data
          />
        </div>
      )}
      {isReviewsOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsReviewsOpen(false)}></div>
          <ReviewsModal
            isOpen={isReviewsOpen}
            onClose={() => setIsReviewsOpen(false)}
            productId={product._id}
          />
        </div>
      )}
    </>
  );
};

export default MenuCard;