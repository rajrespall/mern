import React, { useState, useEffect } from "react";
import ReviewCard from "./ReviewCard";
import StarRating from "./StarRating"; 
import img1 from "../../assets/img/pic1.png"; // Adjusted import path
import useReviewStore from "../../store/reviewStore.js";

const Feedbacks = () => {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { unreviewedProducts, fetchUnreviewedProducts, isLoading } = useReviewStore();

  const handleFeedbackChange = (e) => setFeedback(e.target.value);

  useEffect(() => {
    fetchUnreviewedProducts();
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReview = {
      id: Date.now(),
      text: feedback,
      rating,
      images: imagePreviews,
      reviewerImg: img1, // Use the imported img1 here
      reviewerName: "Anonymous",
      likes: 0,
      comments: [],
    };
    setReviews((prev) => [...prev, newReview]);
    resetForm();
  };

  const resetForm = () => {
    setFeedback("");
    setRating(0);
    setImages([]);
    setImagePreviews([]);
    setIsModalOpen(false);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => resetForm();

  const handleLike = (id) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === id ? { ...review, likes: review.likes + 1 } : review
      )
    );
  };

  const handleAddComment = (id, comment) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === id
          ? { ...review, comments: [...review.comments, comment] }
          : review
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-center lg:px-32 px-5 bg-gradient-to-r from-[#fffdf9] to-[#134278] p-5">
      <h1 className="font-semibold text-center text-4xl lg:mt-14 mt-24">
        Products to Review
      </h1>
      {unreviewedProducts.map(product => (
        <div key={product._id}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <button>Post a Review</button>
        </div>
      ))}
      
      <h1 className="font-semibold text-center text-4xl lg:mt-14 mt-24">
        Customer's Reviews
      </h1>

      <div className="flex justify-center mt-8">
        <button
          onClick={handleOpenModal}
          className="py-2 px-4 text-base border-2 border-white bg-[#0c3a6d] text-white hover:text-[#8b98a7] transition-all rounded-full"
        >
          Give Your Feedback
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg w-11/12 md:w-1/3">
            <h2 className="text-lg font-semibold mb-4 border-2 border-white">Submit Feedback</h2>
            <form onSubmit={handleSubmit} className="flex flex-col">
              <textarea
                value={feedback}
                onChange={handleFeedbackChange}
                placeholder="Enter your feedback"
                className="w-full h-24 p-2 border border-gray-300 rounded-lg"
                required
              />
              <StarRating rating={rating} setRating={setRating} />
              <input
                type="file"
                multiple
                onChange={handleImageChange}
                accept="image/*"
                className="mt-4"
              />

              <div className="grid grid-cols-2 gap-3 mt-4">
                {imagePreviews.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-32 object-cover rounded-lg"
                  />
                ))}
              </div>

              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 border-2 border-white bg-[#0c3a6d] text-white hover:text-[#8b98a7] transition-all rounded-full"
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-5 justify-center py-4 my-8">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onLike={handleLike}
            onAddComment={handleAddComment}
          />
        ))}
      </div>
    </div>
  );
};

export default Feedbacks;
