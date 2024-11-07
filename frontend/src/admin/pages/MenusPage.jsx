import { motion } from "framer-motion";
import Header from "../common/Header";
import StatCard from "../common/StatCard";
import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
// import CategoryDistributionChart from "../overview/CategoryDistributionChart";
import DrinksChart from "../menu/DrinksChart";
import MenuTable from "../menu/MenuTable";

const MenusPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Menus' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>


				<MenuTable />


	{/* STATS */}
	<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Menus' icon={Package} value={10} color='#6366F1' />
					<StatCard name='Top Selling' icon={TrendingUp} value={5} color='#10B981' />
					<StatCard name='Low Stock' icon={AlertTriangle} value={2} color='#F59E0B' />
					<StatCard name='Total Revenue' icon={DollarSign} value={"$10,000"} color='#EF4444' />
				</motion.div>
				
			</main>
		</div>
	);
};

export default MenusPage;
