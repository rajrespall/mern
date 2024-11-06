import React, { useState, useEffect } from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const EditUser = ({ isOpen, onClose, user }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // New state for password
  const [role, setRole] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || ""); // Provide a default value
      setEmail(user.email || ""); // Provide a default value
      setRole(user.role || ""); // Provide a default value
      setProfilePicture(user.profilePicture || null); // Default to null if no profile picture
    }
  }, [user]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
  };

  const handleSubmit = () => {
    const updatedUser = {
      name: name,
      email: email,
      password: password, // Include password in the updated user data
      role: role,
      profilePicture: profilePicture,
    };
    console.log("Updated User:", updatedUser);
    onClose(); // Close the modal after submission
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-gray-800 rounded-lg p-6 w-11/12 md:w-1/3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-100">Edit User</h3>
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
          <input
            id="role"
            name="role"
            type="text"
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-gray-700 text-white rounded-lg w-full p-2 mb-2"
          />

          <label htmlFor="profilePicture" className="sr-only">Profile Picture</label>
          <input
            id="profilePicture"
            name="profilePicture"
            type="file"
            onChange={handleFileChange}
            className="bg-gray-700 text-white rounded-lg w-full p-2 mb-2"
          />
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mt-4"
          onClick={handleSubmit}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default EditUser;
