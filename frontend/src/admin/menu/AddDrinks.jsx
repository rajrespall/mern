import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import useProductStore from "../../store/productStore";
import { Loader } from "lucide-react";

const AddDrinks = ({ onClose }) => {
  const [previewUrls, setPreviewUrls] = useState([]);
  const { addProduct } = useProductStore();

  const coffeeOrigins = ["Ethiopian", "Brazilian", "Vietnamese", "Italian", "Mexican", "American"];

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Drink name is required"),
    origin: Yup.string().required("Please select an origin"),
    price: Yup.number()
      .min(0, "Price must be a positive number")
      .required("Price is required"),
    stock: Yup.number()
      .min(0, "Stock must be a positive number")
      .required("Stock is required"),
    description: Yup.string().required("Description is required"),
    images: Yup.mixed().test("fileCount", "Please upload at least one image", (value) => {
      return value && value.length > 0;
    }),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const { name, description, price, origin, stock, images } = values;

      await addProduct({
        name,
        description,
        price: Number(price),
        category: origin,
        stock: Number(stock),
        images,
      });

      previewUrls.forEach((url) => URL.revokeObjectURL(url)); // Revoke image URLs to free memory
      onClose();
      resetForm();
    } catch (error) {
      alert(error.message || "Error adding product");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md text-white">
        <h2 className="text-2xl mb-4">Add New Drink</h2>

        <Formik
          initialValues={{
            name: "",
            description: "",
            price: "",
            origin: "",
            stock: "",
            images: [],
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue, isSubmitting }) => (
            <Form>
              {/* Name Input */}
              <div className="mb-2">
                <input
                  type="text"
                  name="name"
                  placeholder="Drink Name"
                  value={values.name}
                  onChange={(e) => setFieldValue("name", e.target.value)}
                  className={`bg-gray-700 text-white rounded-lg w-full p-2 ${
                    errors.name && touched.name ? "border-red-500 border" : ""
                  }`}
                />
                {errors.name && touched.name && (
                  <p className="text-red-500 text-sm">{errors.name}</p>
                )}
              </div>

              {/* Origin Dropdown */}
              <div className="mb-2">
                <select
                  name="origin"
                  value={values.origin}
                  onChange={(e) => setFieldValue("origin", e.target.value)}
                  className={`bg-gray-700 text-white rounded-lg w-full p-2 ${
                    errors.origin && touched.origin ? "border-red-500 border" : ""
                  }`}
                >
                  <option value="">Select Origin</option>
                  {coffeeOrigins.map((origin) => (
                    <option key={origin} value={origin}>
                      {origin}
                    </option>
                  ))}
                </select>
                {errors.origin && touched.origin && (
                  <p className="text-red-500 text-sm">{errors.origin}</p>
                )}
              </div>

              {/* Price Input */}
              <div className="mb-2">
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  value={values.price}
                  onChange={(e) => setFieldValue("price", e.target.value)}
                  className={`bg-gray-700 text-white rounded-lg w-full p-2 ${
                    errors.price && touched.price ? "border-red-500 border" : ""
                  }`}
                  min="0"
                />
                {errors.price && touched.price && (
                  <p className="text-red-500 text-sm">{errors.price}</p>
                )}
              </div>

              {/* Stock Input */}
              <div className="mb-2">
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  value={values.stock}
                  onChange={(e) => setFieldValue("stock", e.target.value)}
                  className={`bg-gray-700 text-white rounded-lg w-full p-2 ${
                    errors.stock && touched.stock ? "border-red-500 border" : ""
                  }`}
                  min="0"
                />
                {errors.stock && touched.stock && (
                  <p className="text-red-500 text-sm">{errors.stock}</p>
                )}
              </div>

              {/* Description Input */}
              <div className="mb-2">
                <textarea
                  name="description"
                  placeholder="Description"
                  value={values.description}
                  onChange={(e) => setFieldValue("description", e.target.value)}
                  className={`bg-gray-700 text-white rounded-lg w-full p-2 ${
                    errors.description && touched.description ? "border-red-500 border" : ""
                  }`}
                  rows={3}
                />
                {errors.description && touched.description && (
                  <p className="text-red-500 text-sm">{errors.description}</p>
                )}
              </div>

              {/* Image Upload */}
              <div className="mb-2">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setFieldValue("images", files);
                    const urls = files.map((file) => URL.createObjectURL(file));
                    setPreviewUrls(urls);
                  }}
                  className={`bg-gray-700 text-white rounded-lg w-full p-2 ${
                    errors.images && touched.images ? "border-red-500 border" : ""
                  }`}
                />
                {errors.images && touched.images && (
                  <p className="text-red-500 text-sm">{errors.images}</p>
                )}
              </div>

              {/* Image Previews */}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {previewUrls.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                  ))}
                </div>
              )}

              {/* Buttons */}
              <div className="flex mt-4 justify-between">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader className="animate-spin" /> : "Submit"}
                </button>
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="bg-gray-500 px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddDrinks;
