import React, { useState } from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AddOrigin = ({ isOpen, onClose }) => {
  const [originName, setOriginName] = useState("");
  const [price, setPrice] = useState("");
  const [stocks, setStocks] = useState("");
  const [images, setImages] = useState([]);

  if (!isOpen) return null; // Don't render if not open

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = () => {
    // Logic to save the origin with images
    console.log("Origin Name:", originName);
    console.log("Price:", price);
    console.log("Stocks:", stocks);
    console.log("Images:", images);
    onClose(); // Close the modal after submission
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-gray-800 rounded-lg p-6 w-11/12 md:w-1/3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-100">Add New Origin</h3>
          <IconButton
            className="text-gray-400 hover:text-gray-200"
            onClick={onClose} // Close the modal
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div className="mt-4">
          <input
            type="text"
            placeholder="Origin Name"
            value={originName}
            onChange={(e) => setOriginName(e.target.value)}
            className="bg-gray-700 text-white rounded-lg w-full p-2 mb-2"
          />
          <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-gray-700 text-white rounded-lg w-full p-2 mb-2"
          />
          <input
            type="text"
            placeholder="Stocks"
            value={stocks}
            onChange={(e) => setStocks(e.target.value)}
            className="bg-gray-700 text-white rounded-lg w-full p-2 mb-2"
          />
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="bg-gray-700 text-white rounded-lg w-full p-2 mb-2"
          />
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4"
          onClick={handleSubmit} // Logic to save the origin
        >
          Save Origin
        </button>
      </div>
    </div>
  );
};

export default AddOrigin;
