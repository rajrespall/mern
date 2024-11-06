import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const EditOrigin = ({ isOpen, onClose, originData }) => {
  const [originName, setOriginName] = useState("");
  const [price, setPrice] = useState("");
  const [stocks, setStocks] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (originData) {
      setOriginName(originData.name || "");  // Provide a default value
      setPrice(originData.price || "");       // Provide a default value
      setStocks(originData.stocks || "");     // Provide a default value
      setImages(originData.images || []);     // Default to an empty array if no images
    }
  }, [originData]);

  if (!isOpen) return null; // Don't render if not open

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = () => {
    const updatedOrigin = {
      name: originName,
      price: price,
      stocks: stocks,
      images: images,
    };
    console.log("Updated Origin:", updatedOrigin);
    onClose(); // Close the modal after submission
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-gray-800 rounded-lg p-6 w-11/12 md:w-1/3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-100">Edit Origin</h3>
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
          onClick={handleSubmit} // Logic to save the edited origin
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditOrigin;
