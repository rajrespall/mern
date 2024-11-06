import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { motion } from "framer-motion";
import { Edit, Search, Trash2, Plus } from "lucide-react";
import AddOrigin from "./AddOrigin"; // Import the AddOrigin component
import EditOrigin from "./EditOrigin"; // Import the EditOrigin component

const ORIGIN_DATA = [
  { id: 1, name: "Ethiopian Coffee", price: 25.99, stock: 143, sales: 1200, image: "/img/ethiopia.png" },
  { id: 3, name: "Brazilian Coffee", price: 19.99, stock: 56, sales: 650, image: "/img/brazil.png" },
  { id: 5, name: "Vietnamese Coffee", price: 15.99, stock: 78, sales: 720, image: "/img/vietnam.png" },
];

const OriginTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrigins, setFilteredOrigins] = useState(ORIGIN_DATA);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Modal state for adding origin
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Modal state for editing origin
  const [selectedOrigin, setSelectedOrigin] = useState(null); // Store the selected origin to edit

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = ORIGIN_DATA.filter(
      (origin) =>
        origin.name.toLowerCase().includes(term) || origin.variety.toLowerCase().includes(term)
    );
    setFilteredOrigins(filtered);
  };

  const handleAddOrigin = () => {
    setIsAddModalOpen(true); // Open modal for adding origin
  };

  const handleEditOrigin = (origin) => {
    setSelectedOrigin(origin); // Set the selected origin to edit
    setIsEditModalOpen(true); // Open modal for editing
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false); // Close the add modal
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false); // Close the edit modal
    setSelectedOrigin(null); // Reset selected origin
  };

  const columns = [
    {
      name: "Country",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
           <div className="flex items-center gap-2">
          <img src={row.image} alt={row.name} className="w-10 h-10 rounded-full" />
          <span>{row.name}</span>
        </div>
      ),
    },
    {
      name: "Price",
      selector: (row) => `$${row.price.toFixed(2)}`,
      sortable: true,
    },
    {
      name: "Stock",
      selector: (row) => row.stock,
      sortable: true,
    },
    {
      name: "Sales",
      selector: (row) => row.sales,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex gap-2">
          <button
            className="text-indigo-400 hover:text-indigo-300"
            onClick={() => handleEditOrigin(row)} // Trigger edit modal
          >
            <Edit size={18} />
          </button>
          <button className="text-red-400 hover:text-red-300">
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
        <h2 className="text-xl font-semibold text-gray-100">Coffee Origins</h2>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search origins..."
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleSearch}
              value={searchTerm}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          <button
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition"
            onClick={handleAddOrigin}
          >
            <Plus size={18} className="mr-2" />
            Add Origin
          </button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredOrigins}
        pagination
        highlightOnHover
        customStyles={{
          rows: {
            style: {
              backgroundColor: 'rgb(31 41 55 / var(--tw-bg-opacity))',
              '--tw-bg-opacity': '1',
              color: '#ddd',
            },
          },
          headCells: {
            style: {
              backgroundColor: 'rgb(31 41 55 / var(--tw-bg-opacity))',
              '--tw-bg-opacity': '1',
              color: '#fff',
            },
          },
          cells: {
            style: {
              color: '#ddd',
            },
          },
          pagination: {
            style: {
              backgroundColor: 'rgb(31 41 55 / var(--tw-bg-opacity))',
              '--tw-bg-opacity': '1',
              color: '#fff',
            },
          },
        }}
      />

      {/* AddOrigin modal */}
      <AddOrigin isOpen={isAddModalOpen} onClose={closeAddModal} />

      {/* EditOrigin modal */}
      {isEditModalOpen && (
        <EditOrigin isOpen={isEditModalOpen} onClose={closeEditModal} origin={selectedOrigin} />
      )}
    </motion.div>
  );
};

export default OriginTable;
