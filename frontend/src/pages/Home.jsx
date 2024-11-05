import React from "react";
import { useNavigate } from "react-router-dom";
import img from "../assets/img/home.png";
import aboutImg from "../assets/img/about.png";
import Button from "../components/Button";
import aboutUsImage from "../assets/img/aboutus.png";
import Navbar from "../components/Navbar";

const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) return <LoadingSpinner />;

  if (isAuthenticated && user.isVerified) {
      return <Navigate to='/home' replace />;
  }

  return children;
};


const Home = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col justify-center lg:flex-row lg:justify-between items-center lg:px-32 px-5 gap-10 bg-gradient-to-r from-[#fffdf9] to-[#134278]">
        <div className="w-full lg:w-2/4 space-y-4 mt-8 lg:mt-0">
          <h1 className="font-semibold text-6xl text-center lg:text-start leading-tight">
            Where Every Cup is a Plot Twist!
          </h1>
          <p>
            Savor the moment and let your thoughts flow as freely as your coffee!
          </p>

          <div className="flex flex-row gap-6">
            <Button title="ADD TO CART" />
            <Button title="MORE MENU" />
          </div>
        </div>

        <div className="relative">
          <img
            src={img}
            alt="img"
            className="w-full lg:w-[550px] h-auto object-contain"
          />
          <div className="absolute bg-white px-8 py-2 bottom-0 -left-10 rounded-full">
            <h2 className="font-semibold">Spanish Latte</h2>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="min-h-screen flex flex-col items-center justify-center lg:px-32 px-5 bg-gradient-to-r from-[#fffdf9] to-[#134278]">
        <div className="flex flex-col lg:flex-row items-center gap-5">
          <div className="w-full lg:w-2/4">
            <img className="rounded-lg" src={aboutImg} alt="About Us" />
          </div>
          <div className="w-full lg:w-2/4 p-4 space-y-3">
            <img
              src={aboutUsImage}
              alt="About Us"
              className="mx-auto mt-12 mb-2 lg:mt-7 w-[170px] h-auto object-contain"
              style={{ maxHeight: "180px" }}
            />
            <h2 className="font-semibold text-3xl">What Makes Our Coffee Special?</h2>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Commodi
              quaerat quia quasi beatae et iste, tempora voluptatum corporis sit
              pariatur eaque exercitationem, doloribus eum optio nobis cum?
              Quidem, dolor atque.
            </p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam ut
              minima perspiciatis doloribus quod repellendus molestiae rerum!
              Enim, vero natus.
            </p>

            <Button title="Learn More" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
