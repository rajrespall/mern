// frontend/src/pages/Menu/ReviewsModal.jsx
import React, { useEffect } from 'react';
import { FaTimes, FaStar } from 'react-icons/fa';
import useReviewStore from '../../store/reviewStore';

const ReviewsModal = ({ isOpen, onClose, productId }) => {
  const { reviews, isLoading, error, fetchProductReviews } = useReviewStore();

  useEffect(() => {
    if (isOpen && productId) {
      fetchProductReviews(productId);
    }
  }, [isOpen, productId, fetchProductReviews]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          <FaTimes className="text-gray-600 hover:text-gray-800" />
        </button>
        
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        
        {error && (
          <div className="text-red-500 mb-4">{error}</div>
        )}

        {isLoading ? (
          <div className="text-center py-4">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-4">No reviews yet</div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="border-b pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={review.user?.profileImage || '/default-avatar.png'}
                    alt={review.user?.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{review.user?.name || 'Anonymous'}</p>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </div>
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
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsModal;