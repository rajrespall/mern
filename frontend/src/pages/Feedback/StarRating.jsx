import React from "react";

const StarRating = ({ rating, setRating, readOnly }) => {
  const stars = Array(5).fill(0);

  return (
    <div className="flex">
      {stars.map((_, index) => (
        <span
          key={index}
          className={`cursor-pointer ${index < rating ? "text-yellow-500" : "text-gray-300"}`}
          onClick={() => !readOnly && setRating(index + 1)} // Allow clicking only if not readOnly
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
