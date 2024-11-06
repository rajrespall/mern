import React, { useState, useEffect } from "react";
import { IconButton, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const EditDrinks = ({ isOpen, onClose, drink }) => {
  const [drinkName, setDrinkName] = useState("");
  const [origin, setOrigin] = useState(""); // Changed from category to origin
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (drink) {
      setDrinkName(drink.name || ""); // Provide a default value
      setOrigin(drink.origin || ""); // Set origin from the drink object
      setPrice(drink.price || ""); // Provide a default value
      setStock(drink.stock || ""); // Provide a default value
      setImages(drink.image || []); // Default to an empty array if no images
    }
  }, [drink]);

  if (!isOpen) return null; // Don't render if not open

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = () => {
    const updatedDrink = {
      name: drinkName,
      origin, // Use the origin state
      price: parseFloat(price), // Ensure price is a number
      stock: parseInt(stock, 10), // Ensure stock is a number
      image: images,
    };
    console.log("Updated Drink:", updatedDrink);
    onClose(); // Close the modal after submission
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-gray-800 rounded-lg p-6 w-11/12 md:w-1/3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-100">Edit Drink</h3>
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
            placeholder="Drink Name"
            value={drinkName}
            onChange={(e) => setDrinkName(e.target.value)}
            className="bg-gray-700 text-white rounded-lg w-full p-2 mb-2"
          />

          {/* Dropdown for Origin Selection */}
          <FormControl fullWidth variant="outlined" className="mb-2">
            <InputLabel id="origin-label">Origin</InputLabel>
            <Select
              labelId="origin-label"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="bg-gray-700 text-white"
            >
              <MenuItem value="">
                <em>Select Origin</em>
              </MenuItem>
              <MenuItem value="Ethiopian Coffee">Ethiopian Coffee</MenuItem>
              <MenuItem value="Brazilian Coffee">Brazilian Coffee</MenuItem>
              <MenuItem value="Vietnamese Coffee">Vietnamese Coffee</MenuItem>
            </Select>
          </FormControl>

          <input
            type="text"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-gray-700 text-white rounded-lg w-full p-2 mb-2"
          />
          <input
            type="text"
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
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
          onClick={handleSubmit} // Logic to save the edited drink
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditDrinks;
