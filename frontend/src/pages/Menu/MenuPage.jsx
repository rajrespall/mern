import React from "react";
import MenuCard from "./MenuCard";
import img1 from "@assets/img/Menu/2.png";
import img2 from "@assets/img/Menu/3.png";
import img3 from "@assets/img/Menu/8.png";
import img4 from "@assets/img/Menu/5.png"; 
import img5 from "@assets/img/Menu/6.png";
import img6 from "@assets/img/Menu/7.png";


// Add console logs to check the imports
console.log('img1:', img1);
console.log('img2:', img2);
console.log('img3:', img3);
console.log('img4:', img4);
console.log('img5:', img5);
console.log('img6:', img6);

const MenuPage = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center lg:px-32 px-5 bg-gradient-to-r from-[#fffdf9] to-[#134278]">
            <h1 className="font-semibold text-center text-4xl mt-24 mb-8">Our Menu</h1>
            <div className="flex flex-wrap pb-8 gap-8 justify-center">
                <MenuCard img={img1} title="Espresso" price="₱100" rating={4} />
                <MenuCard img={img2} title="Cappuccino" price="₱120" rating={5} />
                <MenuCard img={img3} title="Latte" price="₱130" rating={4} />
                <MenuCard img={img4} title="Americano" price="₱90" rating={3} />
                <MenuCard img={img5} title="Macchiato" price="₱110" rating={5} />
                <MenuCard img={img6} title="Doppio" price="₱140" rating={4} />
            </div>
        </div>
    );
};

export default MenuPage;
