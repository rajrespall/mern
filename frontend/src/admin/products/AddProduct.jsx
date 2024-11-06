import React, { useState } from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ORIGINS = [
  { label: "Ethiopian Coffee", value: "ethiopian" },
  { label: "Brazilian Coffee", value: "brazilian" },
  { label: "Vietnamese Coffee", value: "vietnamese" },
];

const AddProduct = ({ isOpen, onClose }) => {
  const [productName, setProductName] = useState("");
  const [origin, setOrigin] = useState("");
  const [price, setPrice] = useState("");
  const [stocks, setStocks] = useState("");
  const [images, setImages] = useState([]);

  if (!isOpen) return null; // Don't render if not open

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = () => {
    // Logic to save the product with images
    console.log("Product Name:", productName);
    console.log("Origin:", origin);
    console.log("Price:", price);
    console.log("Stocks:", stocks);
    console.log("Images:", images);
    onClose(); // Close the modal after submission
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-gray-800 rounded-lg p-6 w-11/12 md:w-1/3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-100">Add New Product</h3>
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
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="bg-gray-700 text-white rounded-lg w-full p-2 mb-2"
          />
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="bg-gray-700 text-white rounded-lg w-full p-2 mb-2"
          >
            <option value="" disabled>Select Origin</option>
            {ORIGINS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
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
          onClick={handleSubmit} // Logic to save the product
        >
          Save Product
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
