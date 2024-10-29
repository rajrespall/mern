import React from "react";

const Button = (props) => {
  return (
    <div>
      <button className="px-6 py-1 border-2 border-white bg-[#0c3a6d] text-white hover:text-[#8b98a7] transition-all rounded-full">
        {props.title}
      </button>
    </div>
  );
};

export default Button;
