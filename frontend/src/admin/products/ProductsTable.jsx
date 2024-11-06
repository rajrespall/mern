import React, { useState } from "react";
import DataTable from "react-data-table-component";
import { motion } from "framer-motion";
import { Edit, Search, Trash2, Plus } from "lucide-react";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct"; // Import the EditProduct component

const PRODUCT_DATA = [
	{ id: 1, name: "Sip&Scripts Blend", origin: "Ethiopian Coffee", price: 59.99, stock: 143, sales: 1200, image: "/img/Pblend.png" },
	{ id: 2, name: "S&S Roast", origin: "Brazilian Coffee", price: 39.99, stock: 89, sales: 800, image: "/img/PRoast.png" },
];

const ProductsTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredProducts, setFilteredProducts] = useState(PRODUCT_DATA);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState(null);

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		const filtered = PRODUCT_DATA.filter(
			(product) => product.name.toLowerCase().includes(term) || product.origin.toLowerCase().includes(term)
		);
		setFilteredProducts(filtered);
	};

	const handleAddProduct = () => {
		setIsAddModalOpen(true);
	};

	const handleEditProduct = (product) => {
		setSelectedProduct(product);
		setIsEditModalOpen(true);
	};

	const closeAddModal = () => {
		setIsAddModalOpen(false);
	};

	const closeEditModal = () => {
		setIsEditModalOpen(false);
		setSelectedProduct(null);
	};

	const columns = [
		{
			name: "Name",
			selector: (row) => row.name,
			sortable: true,
			cell: (row) => (
				<div className="flex items-center gap-2">
					<img
						src={row.image} // Use the image from the product data
						alt="Product"
						className="w-10 h-10 rounded-full"
					/>
					<span>{row.name}</span>
				</div>
			),
		},
		{
			name: "Origin",
			selector: (row) => row.origin,
			sortable: true,
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
						onClick={() => handleEditProduct(row)}
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
				<h2 className="text-xl font-semibold text-gray-100">Product List</h2>
				<div className="flex items-center gap-4">
					<div className="relative">
						<input
							type="text"
							placeholder="Search products..."
							className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
							onChange={handleSearch}
							value={searchTerm}
						/>
						<Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
					</div>
					<button
						className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition"
						onClick={handleAddProduct}
					>
						<Plus size={18} className="mr-2" />
						Add Product
					</button>
				</div>
			</div>

			<DataTable
				columns={columns}
				data={filteredProducts}
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

			{/* AddProduct modal */}
			<AddProduct isOpen={isAddModalOpen} onClose={closeAddModal} />

			{/* EditProduct modal */}
			{isEditModalOpen && (
				<EditProduct isOpen={isEditModalOpen} onClose={closeEditModal} product={selectedProduct} />
			)}
		</motion.div>
	);
};

export default ProductsTable;
