// frontend/src/pages/Feedback/Feedbacks.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { FaTimes } from 'react-icons/fa';
import useReviewStore from "../../store/reviewStore";
import StarRating from "./StarRating";

const Feedback = () => {
  const { 
    unreviewedProducts, 
    userReviews, 
    isLoading, 
    fetchUnreviewedProducts, 
    fetchUserReviews, 
    createReview 
  } = useReviewStore();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewImages, setReviewImages] = useState([]);
  const [showPostedReviews, setShowPostedReviews] = useState(false);

  useEffect(() => {
    fetchUnreviewedProducts().catch(err => 
      toast.error(err.response?.data?.message || "Failed to fetch products")
    );
  }, [fetchUnreviewedProducts]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setReviewImages(files);
  };

  const handleViewReviews = async () => {
    try {
      await fetchUserReviews();
      setShowPostedReviews(true);
    } catch (error) {
      toast.error("Failed to fetch your reviews");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedProduct) {
      toast.error("Please select a product");
      return;
    }
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!reviewText.trim()) {
      toast.error("Please enter review text");
      return;
    }

    try {
      await createReview(selectedProduct._id, {
        rating,
        text: reviewText,
        images: reviewImages
      });
      
      toast.success("Review submitted successfully!");
      setSelectedProduct(null);
      setRating(0);
      setReviewText("");
      setReviewImages([]);
      fetchUnreviewedProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#fffdf9] to-[#134278] pt-24 pb-20">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Product Reviews</h1>
          <button
            onClick={handleViewReviews}
            className="px-4 py-2 border-2 border-white bg-[#0c3a6d] text-white hover:text-[#8b98a7] rounded"
          >
            View My Reviews
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading...</div>
        ) : unreviewedProducts.length === 0 ? (
          <div className="text-center py-8 bg-white p-6 rounded-lg shadow">
            No products available to review
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
            <div>
              <label className="block mb-2 font-medium">Select Product</label>
              <select 
                className="w-full p-2 border rounded"
                value={selectedProduct?._id || ""}
                onChange={(e) => setSelectedProduct(
                  unreviewedProducts.find(p => p._id === e.target.value)
                )}
              >
                <option value="">Choose a product</option>
                {unreviewedProducts.map(product => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedProduct && (
              <>
                <div>
                  <label className="block mb-2 font-medium">Rating</label>
                  <StarRating rating={rating} setRating={setRating} />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Review</label>
                  <textarea
                    className="w-full p-2 border rounded"
                    rows="4"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Write your review here..."
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Images (Optional)</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-4 border-2 border-white bg-[#0c3a6d] text-white hover:text-[#8b98a7] rounded"
                  disabled={isLoading}
                >
                  {isLoading ? "Submitting..." : "Submit Review"}
                </button>
              </>
            )}
          </form>
        )}
      </div>

      {/* Posted Reviews Modal */}
      {showPostedReviews && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
            <button 
              onClick={() => setShowPostedReviews(false)}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            >
              <FaTimes size={24} />
            </button>

            <h2 className="text-2xl font-bold mb-4">My Reviews</h2>

            {isLoading ? (
              <div className="text-center py-4">Loading reviews...</div>
            ) : userReviews.length === 0 ? (
              <div className="text-center py-4">No reviews posted yet</div>
            ) : (
              <div className="space-y-4">
                {userReviews.map((review) => (
                  <div key={review._id} className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{review.product?.name}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mb-2">
                      <StarRating rating={review.rating} readOnly />
                    </div>
                    <p className="text-gray-700">{review.text}</p>
                    {review.images?.length > 0 && (
                      <div className="flex gap-2 mt-2">
                        {review.images.map((image, index) => (
                          <img
                            key={index}
                            src={image.url}
                            alt={`Review ${index + 1}`}
                            className="w-20 h-20 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Feedback;