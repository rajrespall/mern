import React, { useEffect, useState } from "react";
import MenuCard from "./MenuCard";
import useProductStore from "../../store/productStore";
import Footer from "../../components/Footer";
import Pagination from "@mui/material/Pagination";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import CloseIcon from "@mui/icons-material/Close";

const MenuPage = () => {
    const { products, fetchProducts, isLoading } = useProductStore();
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        category: "All",
        minPrice: "",
        maxPrice: "",
        minRating: "",
    });
    const [filteredProducts, setFilteredProducts] = useState([]);
    const productsPerPage = 6; // Number of products per page

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Apply filters to the product list
    useEffect(() => {
        let filtered = products;

        if (filters.category !== "All") {
            filtered = filtered.filter((product) => product.category === filters.category);
        }

        if (filters.minPrice) {
            filtered = filtered.filter((product) => product.price >= parseFloat(filters.minPrice));
        }

        if (filters.maxPrice) {
            filtered = filtered.filter((product) => product.price <= parseFloat(filters.maxPrice));
        }

        if (filters.minRating) {
            filtered = filtered.filter((product) => product.rating >= parseFloat(filters.minRating));
        }

        setFilteredProducts(filtered);
    }, [filters, products]);

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    const handlePageChange = (event, value) => {
        setCurrentPage(value); // Update the current page
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(filteredProducts.length / productsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
    };

    const toggleFilters = () => {
        setShowFilters((prev) => !prev); // Toggle filter visibility
    };

    return (
        <>
            <div className="min-h-screen flex flex-col justify-center lg:px-32 px-5 bg-gradient-to-r from-[#fffdf9] to-[#134278] pt-32">
                {/* Filter Button */}
                <div className="flex justify-end mt-4">
                    <Button
                        variant="contained"
                        color= "info"
                        onClick={toggleFilters}
                        sx={{ position: "fixed", right: "50px", top: "100px", zIndex: 50 }}
                    >
                        {showFilters ? "Close Filter" : "Filter Products"}
                    </Button>
                </div>

                {/* Filter Form */}
                {showFilters && (
                    <div className="bg-white shadow-lg rounded-lg p-6 fixed top-32 left-1/2 transform -translate-x-1/2 z-50 w-full lg:w-1/2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Filter Products</h2>
                            <CloseIcon
                                onClick={toggleFilters}
                                className="cursor-pointer text-gray-600"
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="category"
                                    value={filters.category}
                                    onChange={handleFilterChange}
                                    label="Category"
                                >
                                    <MenuItem value="All">All</MenuItem>
                                    <MenuItem value="Beverages">Beverages</MenuItem>
                                    <MenuItem value="Snacks">Snacks</MenuItem>
                                    <MenuItem value="Desserts">Desserts</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField
                                name="minPrice"
                                label="Min Price"
                                type="number"
                                value={filters.minPrice}
                                onChange={handleFilterChange}
                                fullWidth
                            />
                            <TextField
                                name="maxPrice"
                                label="Max Price"
                                type="number"
                                value={filters.maxPrice}
                                onChange={handleFilterChange}
                                fullWidth
                            />
                            <TextField
                                name="minRating"
                                label="Min Rating"
                                type="number"
                                value={filters.minRating}
                                onChange={handleFilterChange}
                                fullWidth
                            />
                        </div>
                    </div>
                )}

                {isLoading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <>
                        <div className={`mt-${showFilters ? "20" : "40"} flex flex-wrap pb-20 gap-8 justify-center`}>
                            {currentProducts.map((product) => (
                                <MenuCard key={product._id} product={product} />
                            ))}
                        </div>
                        <div className="flex justify-center items-center mt-8">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handlePrevPage}
                                disabled={currentPage === 1}
                                sx={{ marginRight: "1rem" }}
                            >
                                Previous
                            </Button>
                            <div className="bg-white shadow-lg rounded-full px-4 py-2 flex items-center">
                                <Pagination
                                    count={Math.ceil(filteredProducts.length / productsPerPage)} // Total pages
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    color="primary"
                                    size="large"
                                    siblingCount={1}
                                    boundaryCount={1}
                                    hidePrevButton
                                    hideNextButton
                                />
                            </div>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleNextPage}
                                disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
                                sx={{ marginLeft: "1rem" }}
                            >
                                Next
                            </Button>
                        </div>
                    </>
                )}
            </div>
            <Footer /> {/* Add Footer component */}
        </>
    );
};

export default MenuPage;
