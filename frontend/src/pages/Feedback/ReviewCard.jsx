import React, { useState } from "react";
import { FaHeart, FaRegHeart, FaRegComment, FaEdit } from "react-icons/fa"; // Import FaEdit icon
import StarRating from "./StarRating"; // Make sure the import path is correct

const ReviewCard = ({ review, onLike, onAddComment, onEditReview }) => {
  const { id, text, rating, images, reviewerImg, reviewerName, likes, comments } = review;
  const [newComment, setNewComment] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const [editedRating, setEditedRating] = useState(rating);

  const handleLikeClick = () => onLike(id);

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(id, newComment);
      setNewComment("");
    }
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
    if (isEditing) {
      // Save the edited review when editing is toggled off
      onEditReview(id, editedText, editedRating);
    } else {
      // Set the state to the current values when starting to edit
      setEditedText(text);
      setEditedRating(rating);
    }
  };

  return (
    <div className="flex flex-col w-full lg:w-2/6 bg-white p-3 rounded-lg gap-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <img className="w-16 h-16 rounded-full" src={reviewerImg} alt="Reviewer" />
          <div className="ml-4">
            <h2 className="font-semibold">{reviewerName}</h2>
            {isEditing ? (
              <StarRating rating={editedRating} setRating={setEditedRating} />
            ) : (
              <StarRating rating={rating} readOnly /> // Display the star rating
            )}
          </div>
        </div>
        <button onClick={handleEditToggle} className="text-blue-500">
          <FaEdit />
        </button>
      </div>

      {isEditing ? (
        <textarea
          value={editedText}
          onChange={(e) => setEditedText(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
          required
        />
      ) : (
        <p>{text}</p>
      )}

      <div className="relative">
        {images.length > 0 && (
          <div className="flex justify-center items-center">
            <button onClick={handlePrevImage} className="absolute left-0 z-10">
              ❮
            </button>
            <img
              src={images[currentImageIndex]}
              alt={`Review image ${currentImageIndex + 1}`}
              className="rounded-lg object-cover h-48"
            />
            <button onClick={handleNextImage} className="absolute right-0 z-10">
              ❯
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <button onClick={handleLikeClick} className="flex items-center gap-2">
          {likes > 0 ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
          <span>{likes}</span>
        </button>

        <div className="flex items-center gap-2">
          <FaRegComment />
          <span>{comments.length}</span>
        </div>
      </div>

      <div className="mt-4">
        {comments.map((comment, index) => (
          <p key={index} className="bg-gray-100 p-2 rounded-lg">
            {comment}
          </p>
        ))}
      </div>

      <div className="mt-2 flex">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow p-2 border rounded-lg"
        />
        <button
          onClick={handleAddComment}
          className="ml-2 px-4  border-2 border-white bg-[#0c3a6d] text-white hover:text-[#8b98a7] transition-all rounded-full"
        >
          Post
        </button>
      </div>

      {isEditing && (
        <button
          onClick={handleEditToggle}
          className="ml-2 mt-2 px-4  border-2 border-white bg-[#0c3a6d] text-white hover:text-[#8b98a7] transition-all rounded-full"
        >
          Save
        </button>
      )}
    </div>
  );
};

export default ReviewCard;
