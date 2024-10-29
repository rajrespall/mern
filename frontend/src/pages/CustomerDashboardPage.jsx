import React from 'react'
import img from "../assets/img/home.png";
import aboutImg from "../assets/img/about.jpg";
import Button from "../components/Button";

const CustomerDashboardPage = () => {
    return (
        <>
		<div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-gray-100 to-blue-300">
			{/* Navbar */}
			<nav className="w-full bg-transparent flex items-center justify-between px-8 py-4">
				<div className="flex items-center">
					<img src="/logo.png" alt="Sip & Scripts Logo" className="h-12 w-12" />
					<span className="ml-3 text-2xl font-bold">Sip & Scripts</span>
				</div>
				<ul className="flex space-x-8 text-lg">
					<li><a href="/menu" className="hover:underline">Home</a></li>
					<li><a href="/menu" className="hover:underline">Menu</a></li>
					<li><a href="/products" className="hover:underline">Products</a></li>
					<li><a href="/feedbacks" className="hover:underline">Feedbacks</a></li>
				</ul>
				<div className="flex items-center space-x-4">
					<a href="/cart" className="text-lg"><i className="fas fa-shopping-cart"></i></a>
					<a href="/search" className="text-lg"><i className="fas fa-search"></i></a>
					<a href="/login" className="px-4 py-2 border-2 border-blue-500 rounded-full hover:bg-blue-500 hover:text-white transition duration-200">
						Login
					</a>
				</div>
			</nav>

			{/* Main Content */}
			<div className="flex flex-col items-center justify-center text-center mt-16">
				<h1 className="text-5xl font-bold mb-6">Where Every Cup is a Plot Twist!</h1>
				<p className="text-lg mb-8 max-w-md">
					Savor the moment and let your thoughts flow as freely as your coffee!
				</p>

				<div className="flex space-x-4">
					<button className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-200">
						ADD TO CART
					</button>
					<button className="px-6 py-3 bg-gray-200 text-blue-500 rounded-lg hover:bg-gray-300 transition duration-200">
						MORE MENU
					</button>
				</div>

				{/* Coffee Image */}
				<div className="relative mt-16">
					<img
						src="/coffee.png"
						alt="Coffee Cup"
						className="w-64 h-64 object-cover"
					/>
					<span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg">
						Spanish Latte
					</span>
				</div>
			</div>
		</div>
        </>
	);
}

export default CustomerDashboardPage