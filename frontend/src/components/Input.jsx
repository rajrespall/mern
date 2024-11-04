const Input = ({ icon: Icon, ...props }) => {
	return (
			<div className='relative mb-6'>
					<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
							<Icon className='size-5 text-[#002D74]' />
					</div>
					<input
							{...props}
							className='w-full pl-10 pr-3 py-2 bg-[#e9e6de] bg-opacity-80 rounded-lg border border-[#0c3a6d] focus:border-[#002D74] focus:ring-2 focus:ring-[#002D74] text-[#0c3a6d] placeholder-[#002D74] transition duration-200'
					/>
			</div>
	);
};
export default Input;
