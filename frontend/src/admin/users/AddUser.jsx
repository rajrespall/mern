import React, { useState } from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const AddUser = ({ isOpen, onClose, onAddUser }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [profilePictures, setProfilePictures] = useState([]);

  if (!isOpen) return null;

  const handleFileChange = (event) => {
    setProfilePictures([...event.target.files]);
  };

  const handleSubmit = () => {
    const newUser = {
      name,
      email,
      password,
      role,
      profilePictures, // Send multiple images
    };

    if (onAddUser) {
      onAddUser(newUser);
    }

    onClose(); // Close the modal after submission
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-gray-800 rounded-lg p-6 w-11/12 md:w-1/3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-100">Add New User</h3>
          <IconButton
            className="text-gray-400 hover:text-gray-200"
            onClick={onClose}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <div className="mt-4">
          <label htmlFor="name" className="sr-only">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-700 text-white rounded-lg w-full p-2 mb-2"
          />

          <label htmlFor="email" className="sr-only">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-700 text-white rounded-lg w-full p-2 mb-2"
          />

          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-gray-700 text-white rounded-lg w-full p-2 mb-2"
          />

          <label htmlFor="role" className="sr-only">Role</label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-gray-700 text-white rounded-lg w-full p-2 mb-2"
          >
            <option value="" disabled>Select Role</option>
            <option value="Admin">Admin</option>
            <option value="Customer">Customer</option>
          </select>

          <label htmlFor="profilePictures" className="sr-only">Profile Pictures</label>
          <input
            id="profilePictures"
            name="profilePictures"
            type="file"
            multiple
            onChange={handleFileChange}
            className="bg-gray-700 text-white rounded-lg w-full p-2 mb-2"
          />
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4"
          onClick={handleSubmit}
        >
          Save User
        </button>
      </div>
    </div>
  );
};

export default AddUser;
