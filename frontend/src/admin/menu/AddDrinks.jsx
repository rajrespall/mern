// frontend/src/admin/menu/AddDrinks.jsx
import React, { useState } from 'react';
import useProductStore from '../../store/productStore';
import { Loader } from 'lucide-react';

const AddDrinks = ({ onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [origin, setOrigin] = useState('');
  const [stock, setStock] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const { addProduct } = useProductStore();

  const coffeeOrigins = ['Ethiopian', 'Brazilian', 'Vietnamese', 'Italian', 'Mexican', 'American'];

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async () => {
    try {
      // Validation
      if (!name || !description || !price || !origin || !stock || images.length === 0) {
        alert('Please fill in all fields and upload at least one image.');
        return;
      }

      setLoading(true);

      // Pass data directly to productStore
      await addProduct({
        name,
        description,
        price: Number(price),
        category: origin,
        stock: Number(stock),
        images
      });
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      onClose();
    } catch (error) {
      alert(error.message || 'Error adding product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md text-white">
        <h2 className="text-2xl mb-4">Add New Drink</h2>
        
        <input
          type="text"
          placeholder="Drink Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-gray-700 text-white rounded-lg w-full p-2 mb-2"
          required
        />

        <select
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="bg-gray-700 text-white rounded-lg w-full p-2 mb-2"
          required
        >
          <option value="">Select Origin</option>
          {coffeeOrigins.map((origin) => (
            <option key={origin} value={origin}>
              {origin}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="bg-gray-700 text-white rounded-lg w-full p-2 mb-2"
          min="0"
          required
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="bg-gray-700 text-white rounded-lg w-full p-2 mb-2"
          min="0"
          required
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-gray-700 text-white rounded-lg w-full p-2 mb-2"
          rows={3}
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          multiple
          className="bg-gray-700 text-white rounded-lg w-full p-2 mb-2"
          required
        />
        
        {previewUrls.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {previewUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded"
              />
            ))}
          </div>
        )}
        
        <div className="flex mt-4 justify-between">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? <Loader className="animate-spin" /> : 'Submit'}
          </button>
          <button 
            onClick={onClose}
            disabled={loading}
            className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDrinks;