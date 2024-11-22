import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import avatar from "../assets/img/profile.png"; 
import toast, { Toaster } from "react-hot-toast";
import useProfileStore from "../store/profileStore";
import useOrderStore from "../store/orderStore";

const Profile = () => {
  const { profile, loading: profileLoading, error: profileError, fetchProfile, updateProfile } = useProfileStore();
  const { orders, loading: ordersLoading, error: ordersError, fetchUserOrders } = useOrderStore();
  const [file, setFile] = useState(null); // State for uploaded image

  useEffect(() => {
    fetchProfile();
    fetchUserOrders();
  }, [fetchProfile, fetchUserOrders]);

  const initialValues = {
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    mobile: profile?.contactNo || "",
    email: profile?.user?.email || "",
    address: profile?.address || ""
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    mobile: Yup.string().required("Mobile No. is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    address: Yup.string().required("Address is required")
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await updateProfile({ ...values, profileImage: file });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const onUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
    }
  };

  if (profileLoading || ordersLoading) return <div>Loading...</div>;
  if (profileError) return <div>Error: {profileError}</div>;
  if (ordersError) return <div>Error: {ordersError}</div>;

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

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isSubmitting }) => (
              <Form className="py-1">
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
                    <div className="w-full">
                      <Field
                        className="border rounded-md p-2 w-full"
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                      />
                      <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
                    </div>
                    <div className="w-full">
                      <Field
                        className="border rounded-md p-2 w-full"
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                      />
                      <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
                    </div>
                  </div>

                  <div className="flex w-full gap-4">
                    <div className="w-full">
                      <Field
                        className="border rounded-md p-2 w-full"
                        type="text"
                        name="mobile"
                        placeholder="Mobile No."
                      />
                      <ErrorMessage name="mobile" component="div" className="text-red-500 text-sm" />
                    </div>
                  </div>

                  <div className="w-full">
                    <Field
                      className="border rounded-md p-2 w-full"
                      type="text"
                      name="address"
                      placeholder="Address"
                    />
                    <ErrorMessage name="address" component="div" className="text-red-500 text-sm" />
                  </div>

                  <button
                    className="border-2 border-white bg-[#0c3a6d] text-white hover:text-[#8b98a7] rounded-md p-2 mt-4"
                    type="submit"
                    disabled={isSubmitting}
                  >
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
              </Form>
            )}
          </Formik>
        </div>

        {/* Previous Orders Section */}
        <div className="flex flex-col w-full">
          <h4 className="text-3xl font-bold text-center">Previous Orders</h4>
          <div className="mt-4 overflow-auto">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 text-center font-semibold border-b mb-2">
              <span>Date</span>
              <span>Items</span>
              <span>Status</span>
              <span>Total Price</span>
            </div>

            {/* Order Items */}
            {orders && orders.length > 0 ? (
              orders.map(order => (
                <div key={order._id} className="grid grid-cols-4 gap-4 items-center border-b py-2">
                  <span className="text-center">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center justify-center">
                    <span>
                      {order.orderItems?.map(item => item.product?.name).join(', ')}
                    </span>
                  </div>
                  <span className="text-center">{order.orderStatus}</span>
                  <span className="text-center">${order.totalPrice?.toFixed(2)}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">No orders found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;