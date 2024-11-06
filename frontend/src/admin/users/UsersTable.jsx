import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { motion } from "framer-motion";
import { Edit, Search, Trash2 } from "lucide-react";
import { Button } from "@mui/material";
import AddUser from "./AddUser"; // Import your AddUser component
import EditUser from "./EditUser"; // Import your EditUser component

const USERS_DATA = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", password: "password123", profilePicture: null },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User", password: "securepass", profilePicture: null },
  { id: 3, name: "Alice Johnson", email: "alice@example.com", role: "Editor", password: "alicepass456", profilePicture: null },
];

const UsersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState(USERS_DATA);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = USERS_DATA.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const handleOpenEdit = () => setOpenEdit(true);
  const handleCloseEdit = () => setOpenEdit(false);

  const handleAddUser = (newUser) => {
    const updatedUsers = [
      ...filteredUsers,
      { ...newUser, id: filteredUsers.length + 1 }, // Add a unique ID
    ];
    setFilteredUsers(updatedUsers);
    handleCloseAdd();
  };

  const handleEditClick = (user) => {
    setCurrentUser(user);
    handleOpenEdit();
  };

  const handleUpdateUser = (updatedUser) => {
    const updatedUsers = filteredUsers.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    );
    setFilteredUsers(updatedUsers);
    handleCloseEdit();
  };

  const handleDeleteClick = (id) => {
    const updatedUsers = filteredUsers.filter((user) => user.id !== id);
    setFilteredUsers(updatedUsers);
  };

  const columns = [
    {
      name: "Profile",
      cell: (row) => (
        <div className="flex items-center">
          <img
            src={row.profilePicture ? URL.createObjectURL(row.profilePicture) : "/img/admin.png"} // Default image if no picture
            alt="Profile"
            className="h-10 w-11 rounded-full object-cover mr-2" // Adjust margin for spacing
          />
          <span>{row.name}</span> {/* Display the name next to the profile picture */}
        </div>
      ),
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: "Password",
      selector: (row) => row.password,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            className="text-indigo-400 hover:text-indigo-300"
            onClick={() => handleEditClick(row)}
          >
            <Edit size={18} />
          </button>
          <button
            className="text-red-400 hover:text-red-300"
            onClick={() => handleDeleteClick(row.id)}
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Users List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <Button onClick={handleOpenAdd} variant="contained" className="ml-4 bg-indigo-500">
          Add User
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filteredUsers}
        pagination
        highlightOnHover
        customStyles={{
          rows: {
            style: {
              backgroundColor: "rgb(31 41 55 / var(--tw-bg-opacity))",
              "--tw-bg-opacity": "1",
              color: "#ddd",
            },
          },
          headCells: {
            style: {
              backgroundColor: "rgb(31 41 55 / var(--tw-bg-opacity))",
              "--tw-bg-opacity": "1",
              color: "#fff",
            },
          },
          cells: {
            style: {
              color: "#ddd",
            },
          },
          pagination: {
            style: {
              backgroundColor: "rgb(31 41 55 / var(--tw-bg-opacity))",
              "--tw-bg-opacity": "1",
              color: "#fff",
            },
          },
        }}
      />

      {/* AddUser component */}
      <AddUser isOpen={openAdd} onClose={handleCloseAdd} handleAddUser={handleAddUser} />
      {/* EditUser component */}
      <EditUser isOpen={openEdit} onClose={handleCloseEdit} user={currentUser} onUpdateUser={handleUpdateUser} />
    </motion.div>
  );
};

export default UsersTable;
