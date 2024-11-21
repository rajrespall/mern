// frontend/src/pages/Feedback.jsx
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useReviewStore from "../../store/reviewStore";
import StarRating from "./StarRating";

const Feedback = () => {
  const { unreviewedProducts, fetchUnreviewedProducts, createReview, isLoading } = useReviewStore();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewImages, setReviewImages] = useState([]);

  useEffect(() => {
    fetchUnreviewedProducts().catch(err => 
      toast.error(err.response?.data?.message || "Failed to fetch products")
    );
  }, [fetchUnreviewedProducts]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setReviewImages(files);
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
      // Reset form
      setSelectedProduct(null);
      setRating(0);
      setReviewText("");
      setReviewImages([]);
      // Refresh unreviewed products list
      fetchUnreviewedProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#fffdf9] to-[#134278] pt-24 pb-20">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Product Reviews</h1>

        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : unreviewedProducts.length === 0 ? (
          <div className="text-center">No products to review</div>
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
    </div>
  );
};

export default Feedback;