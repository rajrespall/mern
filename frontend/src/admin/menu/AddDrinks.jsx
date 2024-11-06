import React, { useState } from "react";
import { IconButton, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AddDrinks = ({ open, handleClose, handleAddDrink }) => {
  const [drinkName, setDrinkName] = useState("");
  const [origin, setOrigin] = useState(""); // State for origin
  const [price, setPrice] = useState("");
  const [stocks, setStocks] = useState("");
  const [images, setImages] = useState([]);

  if (!open) return null; // Don't render if not open

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = () => {
    const newDrink = {
      name: drinkName,
      origin,
      price: parseFloat(price), // Ensure price is a number
      stock: parseInt(stocks, 10), // Ensure stock is a number
      images, // You might need to handle images if necessary
    };
    handleAddDrink(newDrink); // Call the parent handler
    handleClose(); // Close the modal after submission
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-gray-800 rounded-lg p-6 w-11/12 md:w-1/3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-100">Add New Drink</h3>
          <IconButton
            className="text-gray-400 hover:text-gray-200"
            onClick={handleClose} // Close the modal
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
            <InputLabel id="origin-label" sx={{ color: 'white' }}>Origin</InputLabel>
            <Select
              labelId="origin-label"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="bg-gray-700 text-white"
              MenuProps={{ PaperProps: { sx: { bgcolor: 'gray.800' } } }} // Optional: Change dropdown background
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
          Save Drink
        </button>
      </div>
    </div>
  );
};

export default AddDrinks;
