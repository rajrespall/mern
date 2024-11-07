import React, { useState } from 'react';

const AddDrinks = ({ onAddDrink, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [origin, setOrigin] = useState('');
  const [stock, setStock] = useState(''); // Added stock state
  const [images, setImages] = useState([]);

  const coffeeOrigins = ['Brazil', 'Vietnam', 'Ethiopia'];

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...selectedFiles]);
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!name || !description || !price || !origin || !stock || images.length === 0) {
      alert('Please fill in all fields and upload at least one image.');
      return;
    }

    const newDrink = { name, description, price, origin, stocks: stock, images };
    onAddDrink(newDrink);
    onClose(); // Close modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md text-white">
        <h2 className="text-2xl mb-4">Add New Drink</h2>
        
        {/* Drink Name Input */}
        <input
          type="text"
          placeholder="Drink Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-700 text-white rounded-lg w-full p-2 mb-2"
        />

        {/* Origin Dropdown */}
        <select
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="bg-gray-700 text-white rounded-lg w-full p-2 mb-2"
        >
          <option value="">Select Origin</option>
          {coffeeOrigins.map((originOption, index) => (
            <option key={index} value={originOption}>
              {originOption}
            </option>
          ))}
        </select>

        {/* Price Input */}
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="bg-gray-700 text-white rounded-lg w-full p-2 mb-2"
        />

        {/* Stock Input */}
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="bg-gray-700 text-white rounded-lg w-full p-2 mb-2"
        />

        {/* Description Textarea */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-gray-700 text-white rounded-lg w-full p-2 mb-2"
        />

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          multiple
          className="bg-gray-700 text-white rounded-lg w-full p-2 mb-2"
        />
        
        <div className="flex mt-4 justify-between">
          <button onClick={handleSubmit} className="bg-blue-500 px-4 py-2 rounded">Submit</button>
          <button onClick={onClose} className="bg-gray-500 px-4 py-2 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AddDrinks;
