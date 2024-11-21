import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Eye } from "lucide-react";
import useOrderStore from "../../store/orderStore";
import { useSnackbar } from 'notistack';
import { Dialog, DialogContent, Typography, Box } from "@mui/material";

const OrdersTable = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredOrders, setFilteredOrders] = useState([]);
	const { orders, loading, fetchAllOrders, updateOrderStatus } = useOrderStore();
	const { enqueueSnackbar } = useSnackbar();
	const statusOptions = ["Processing", "Shipped", "Delivered", "Cancelled"];
	const [openDetailsModal, setOpenDetailsModal] = useState(false);
  	const [selectedOrder, setSelectedOrder] = useState(null);

	const handleViewDetails = (order) => {
		setSelectedOrder(order);
		setOpenDetailsModal(true);
	};

	useEffect(() => {
		fetchAllOrders();
	}, [fetchAllOrders]);

	useEffect(() => {
		if (orders.length > 0) {
		  setFilteredOrders(orders);
		}
	}, [orders]);

	const handleSearch = (e) => {
		const term = e.target.value.toLowerCase();
		setSearchTerm(term);
		
		// Filter orders from the store instead of non-existent orderData
		const filtered = orders.filter(
		  (order) => 
			order._id.toLowerCase().includes(term) || 
			order.user.name.toLowerCase().includes(term) ||
			order.orderStatus.toLowerCase().includes(term)
		);
		
		setFilteredOrders(filtered);
	  };

	const handleStatusChange = async (orderId, newStatus) => {
		try {
		  await updateOrderStatus(orderId, newStatus);
		  enqueueSnackbar('Order status updated successfully!', { variant: 'success' });
		} catch (error) {
		  enqueueSnackbar('Failed to update order status', { variant: 'error' });
		}
	};
	  
	if (loading) {
		return <div>Loading orders...</div>;
	}
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
		>
			<div className='flex justify-between items-center mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Order List</h2>
				<div className='relative'>
					<input
						type='text'
						placeholder='Search orders...'
						className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
						value={searchTerm}
						onChange={handleSearch}
					/>
					<Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
				</div>
			</div>

			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-700'>
					<thead>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Order ID
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Customer
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Total
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Status
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Date
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
								Actions
							</th>
						</tr>
					</thead>

					<tbody className='divide divide-gray-700'>
						{filteredOrders.map((order) => (
							<motion.tr
								key={order._id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
									{order._id}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
									{order.user.name}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100'>
									${order.totalPrice.toFixed(2)}
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
									<select
										value={order.orderStatus}
										onChange={(e) => handleStatusChange(order._id, e.target.value)}
										className={`px-2 py-1 rounded-full text-xs font-semibold 
										${order.orderStatus === "Delivered"
											? "bg-green-100 text-green-800"
											: order.orderStatus === "Processing"
											? "bg-yellow-100 text-yellow-800"
											: order.orderStatus === "Shipped"
											? "bg-blue-100 text-blue-800"
											: "bg-red-100 text-red-800"}`}
									>
										{statusOptions.map((status) => (
										<option key={status} value={status}>
											{status}
										</option>
										))}
									</select>
								</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{new Date(order.createdAt).toLocaleDateString()}</td>
								<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>
								<button 
									className='text-indigo-400 hover:text-indigo-300 mr-2'
									onClick={() => handleViewDetails(order)}
								>
									<Eye size={18} />
								</button>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
			{openDetailsModal && selectedOrder && (
			<Dialog 
				open={openDetailsModal} 
				onClose={() => setOpenDetailsModal(false)}
				maxWidth="md" 
				fullWidth
			>
				<DialogContent sx={{ bgcolor: '#1b2433', color: '#fff' }}>
				<div className="p-6">
					{/* Header */}
					<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold">Order Details</h2>
					<button 
						onClick={() => setOpenDetailsModal(false)}
						className="text-gray-400 hover:text-gray-200"
					>
						✕
					</button>
					</div>

					{/* Order Info */}
					<div className="grid grid-cols-2 gap-4 mb-6">
					<div>
						<p className="text-gray-400">Order ID:</p>
						<p className="font-semibold">{selectedOrder._id}</p>
					</div>
					<div>
						<p className="text-gray-400">Customer:</p>
						<p className="font-semibold">{selectedOrder.user.name}</p>
					</div>
					<div>
						<p className="text-gray-400">Status:</p>
						<p className={`inline-block px-2 py-1 rounded-full text-xs font-semibold
						${selectedOrder.orderStatus === "Delivered"
							? "bg-green-100 text-green-800"
							: selectedOrder.orderStatus === "Processing"
							? "bg-yellow-100 text-yellow-800"
							: selectedOrder.orderStatus === "Shipped"
							? "bg-blue-100 text-blue-800"
							: "bg-red-100 text-red-800"}`}
						>
						{selectedOrder.orderStatus}
						</p>
					</div>
					<div>
						<p className="text-gray-400">Date:</p>
						<p className="font-semibold">
						{new Date(selectedOrder.createdAt).toLocaleDateString()}
						</p>
					</div>
					</div>

					{/* Order Items */}
					<div className="mb-6">
					<h3 className="text-lg font-semibold mb-4">Order Items</h3>
					<div className="bg-gray-900 rounded-lg overflow-hidden">
						<table className="min-w-full">
						<thead className="bg-gray-800">
							<tr>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Item</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Quantity</th>
							<th className="px-4 py-3 text-right text-xs font-medium text-gray-400">Price</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-800">
							{selectedOrder.orderItems.map((item) => (
							<tr key={item._id}>
								<td className="px-4 py-3">
								<div className="flex items-center">
									<img 
									src={item.product?.images?.[0]?.url || '/img/admin.png'} 
									alt={item.product?.name || 'Product'}  
									className="w-10 h-10 rounded object-cover mr-3"
									/>
									<span>{item.product?.name || 'Unknown Product'}</span>
								</div>
								</td>
								<td className="px-4 py-3">{item.quantity}</td>
								<td className="px-4 py-3 text-right">
								${((item.product?.price || 0) * item.quantity).toFixed(2)}
								</td>
							</tr>
							))}
						</tbody>
						</table>
					</div>
					</div>

					{/* Order Summary */}
					<div className="bg-gray-900 rounded-lg p-4">
					<div className="flex justify-between mb-2">
						<span className="text-gray-400">Subtotal</span>
						<span>${selectedOrder.itemsPrice.toFixed(2)}</span>
					</div>
					<div className="flex justify-between mb-2">
						<span className="text-gray-400">Shipping</span>
						<span>${selectedOrder.shippingPrice.toFixed(2)}</span>
					</div>
					<div className="flex justify-between mb-2">
						<span className="text-gray-400">Tax</span>
						<span>${selectedOrder.taxPrice.toFixed(2)}</span>
					</div>
					<div className="flex justify-between font-semibold text-lg border-t border-gray-700 pt-2 mt-2">
						<span>Total</span>
						<span>${selectedOrder.totalPrice.toFixed(2)}</span>
					</div>
					</div>
				</div>
				</DialogContent>
			</Dialog>
			)}
		</motion.div>
	);
};
export default OrdersTable;
