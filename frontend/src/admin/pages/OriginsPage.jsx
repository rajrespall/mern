import { motion } from "framer-motion";
import Header from "../common/Header";
import StatCard from "../common/StatCard";

import { Coffee, Globe, MapPin, DollarSign } from "lucide-react";
import OriginTable from "../origins/OriginTable";

const OriginsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Coffee Origins' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* STATS */}
				<motion.div
					className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
				>
					<StatCard name='Total Origins' icon={Globe} value={15} color='#6366F1' />
					<StatCard name='Top Region' icon={MapPin} value={"Ethiopia"} color='#10B981' />
					<StatCard name='Average Cost' icon={DollarSign} value={"$25/kg"} color='#F59E0B' />
					<StatCard name='Top Variety' icon={Coffee} value={"Arabica"} color='#EF4444' />
				</motion.div>

				<OriginTable />

				{/* You can add any additional admin related to coffee origins here */}
			</main>
		</div>
	);
};

export default OriginsPage;
