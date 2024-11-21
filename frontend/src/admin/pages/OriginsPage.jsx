import { motion } from "framer-motion";
import Header from "../common/Header";
import StatCard from "../common/StatCard";

import { Coffee, Globe, MapPin, DollarSign } from "lucide-react";
import OriginTable from "../origins/OriginTable";
import useReviewStore from '../../store/reviewStore';

const OriginsPage = () => {
	const { stats } = useReviewStore();
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Feedback' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Reviews' icon={Globe} value={stats.totalReviews} color='#6366F1' />
					<StatCard name='Average Rating' icon={MapPin} value={stats.averageRating} color='#10B981' />
					<StatCard name='5★ Reviews' icon={DollarSign} value={stats.ratingDistribution.find(r => r._id === 5)?.count || 0} color='#F59E0B' />
					<StatCard name='1★ Reviews' icon={Coffee} value={stats.ratingDistribution.find(r => r._id === 1)?.count || 0} color='#EF4444' />
				</motion.div>

				<OriginTable />

				{/* You can add any additional admin related to coffee origins here */}
			</main>
		</div>
	);
};

export default OriginsPage;
