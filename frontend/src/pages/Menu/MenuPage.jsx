import React, { useEffect } from "react";
import MenuCard from "./MenuCard";
import useProductStore from "../../store/productStore";

const MenuPage = () => {
    const { products, fetchProducts, isLoading } = useProductStore();

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    return (
        <div className="min-h-screen flex flex-col justify-center lg:px-32 px-5 bg-gradient-to-r from-[#fffdf9] to-[#134278]">
            <h1 className="font-semibold text-center text-4xl mt-24 mb-8">Our Menu</h1>
            
            {isLoading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <div className="flex flex-wrap pb-8 gap-8 justify-center">
                    {products.map((product) => (
                        <MenuCard
                            key={product._id}
                            img={product.images[0]?.url}
                            title={product.name}
                            price={`₱${product.price}`}
                            rating={4} // You can add a rating field to your product model if needed
                            description={product.description}
                            origin={product.category}
                            stock={product.stock}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MenuPage;
