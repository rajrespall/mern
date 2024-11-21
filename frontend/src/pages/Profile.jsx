import React, { useState, useEffect } from "react";
import avatar from "../assets/img/profile.png"; 
import toast, { Toaster } from "react-hot-toast";
import useProfileStore from "../store/profileStore";

const Profile = () => {
  const { profile, loading, error, fetchProfile, updateProfile } = useProfileStore();
  const [file, setFile] = useState(null); // State for uploaded image
  const [firstName, setFirstName] = useState(""); // Example existing data
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [previousOrders, setPreviousOrders] = useState([
    { id: 1, date: "2024-09-01", item: "Cappuccino", quantity: 2, price: 120, totalPrice: 240, image: avatar },
    { id: 2, date: "2024-09-15", item: "Latte", quantity: 1, price: 150, totalPrice: 150, image: avatar },
    { id: 3, date: "2024-10-01", item: "Espresso", quantity: 3, price: 100, totalPrice: 300, image: avatar },
  ]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setMobile(profile.contactNo || "");
      setEmail(profile.user.email || "");
      setAddress(profile.address || "");
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ firstName, lastName, contactNo: mobile, address, profileImage: file });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#fffdf9] to-[#134278] pt-24 pb-20">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex bg-white shadow-md rounded-lg p-4 w-11/12 lg:w-8/12 space-x-2">
        {/* Profile Section */}
        <div className="flex flex-col w-full">
          <h4 className="text-4xl font-bold text-center mt-4">Profile</h4>
          <span className="py-2 text-lg text-center text-gray-500">
            You can update your details.
          </span>

          <form className="py-1" onSubmit={handleSubmit}>
            <div className="flex justify-center py-4">
              <label htmlFor="profile">
                <img
                  src={file ? URL.createObjectURL(file) : profile?.profileImage?.url || avatar}
                  className="w-32 h-32 rounded-full border-2 border-gray-300"
                  alt="avatar"
                />
              </label>
              <input onChange={onUpload} type="file" id="profile" name="profile" className="hidden" />
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="flex w-full gap-4">
                <input
                  className="border rounded-md p-2 w-full"
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                  className="border rounded-md p-2 w-full"
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>

              <div className="flex w-full gap-4">
                <input
                  className="border rounded-md p-2 w-full"
                  type="text"
                  placeholder="Mobile No."
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>

              <input
                className="border rounded-md p-2 w-full"
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              <button className="border-2 border-white bg-[#0c3a6d] text-white hover:text-[#8b98a7] rounded-md p-2 mt-4" type="submit">
                Update
              </button>
            </div>

            <div className="text-center py-4">
              <span className="text-gray-500">
                Come back later?{" "}
                <button className="text-red-500" type="button">
                  Logout
                </button>
              </span>
            </div>
          </form>
        </div>

        {/* Previous Orders Section */}
        <div className="flex flex-col w-full">
          <h4 className="text-3xl font-bold text-center">Previous Orders</h4>
          <div className="mt-4 overflow-auto">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 text-center font-semibold border-b mb-2">
              <span>Date</span>
              <span>Item</span>
              <span>Quantity</span>
              <span>Total Price</span>
            </div>

            {/* Order Items */}
            {previousOrders.map(order => (
              <div key={order.id} className="grid grid-cols-4 gap-4 items-center border-b py-2">
                <span className="text-center">{order.date}</span>
                <div className="flex items-center">
                  <img src={order.image} alt={order.item} className="w-12 h-12 rounded mr-2" />
                  <span>{order.item}</span>
                </div>
                <span className="text-center">{order.quantity}</span>
                <span className="text-center">{order.totalPrice}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
