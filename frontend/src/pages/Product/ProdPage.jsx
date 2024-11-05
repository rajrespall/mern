import React from "react";
import img1 from "../../assets/img/product1.jpg";
import img2 from "../../assets/img/product2.jpg";
import img3 from "../../assets/img/product3.jpg";
import ProductCard from "./ProdCard";

const ProdPage = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center lg:px-32 px-5 bg-gradient-to-r from-[#fffdf9] to-[#134278]">
      <h1 className="font-semibold text-center text-4xl lg:mt-14 mt-24 mb-8">
        At Home Coffee
      </h1>
      <div className="flex flex-col lg:flex-row gap-12 justify-center">
        <ProductCard img={img1} title="Nespresso" />
        <ProductCard img={img2} title="AeroPress" />
        <ProductCard img={img3} title="Chemex" />
      </div>
    </div>
  );
};

export default ProdPage;
