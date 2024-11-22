import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import useOrderStore from "../../store/orderStore";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SalesOverviewChart = () => {
	const { fetchAllOrders, monthlySalesData, loading } = useOrderStore();
	const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1)); // Start of the year
    const [endDate, setEndDate] = useState(new Date()); // Today

	useEffect(() => {
		fetchAllOrders();
	  }, [fetchAllOrders]);

	const filteredData = monthlySalesData.filter(data => {
        const date = new Date(data.month);
        return date >= startDate && date <= endDate;
    });

	if (loading) {
		return <div>Loading orders...</div>;
	}
	
	if (!monthlySalesData?.length) {
		return <div>No order data available</div>;
	}

	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className='flex items-center justify-between mb-6'>
				<h2 className='text-xl font-semibold text-gray-100'>Sales Overview</h2>

				<div className='flex space-x-4'>
                    <DatePicker
                        selected={startDate}
                        onChange={date => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        className='bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                    <DatePicker
                        selected={endDate}
                        onChange={date => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        className='bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
                </div>
			</div>

			<div className='w-full h-80'>
				<ResponsiveContainer>
					<AreaChart data={filteredData}>
						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
						<XAxis dataKey='month' stroke='#9CA3AF' />
						<YAxis stroke='#9CA3AF' />
						<Tooltip
							contentStyle={{ backgroundColor: "rgba(31, 41, 55, 0.8)", borderColor: "#4B5563" }}
							itemStyle={{ color: "#E5E7EB" }}
						/>
						<Area type='monotone' dataKey='sales' stroke='#8B5CF6' fill='#8B5CF6' fillOpacity={0.3} />
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
export default SalesOverviewChart;
