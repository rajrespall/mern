import React, { useState, useEffect } from "react";
import { AiOutlineMinus, AiOutlinePlus, AiOutlineDelete, AiOutlineFilePdf, AiOutlineFileExcel } from "react-icons/ai";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import useCartStore from "../../store/cartStore";

const CartPage = () => {
    const { cartItems, loading, fetchCart, updateQuantity, removeItem } = useCartStore();
    const [selectedItems, setSelectedItems] = useState([]);
    const [userInfo, setUserInfo] = useState({
        name: "John Doe",
        address: "123 Coffee St, Brewtown, CA 12345",
    });
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);

     // Fetch cart on component mount
     useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const calculateTotal = () => {
        return selectedItems.reduce((total, id) => {
            const item = cartItems.find(item => item.id === id);
            return item ? total + item.price * item.quantity : total;
        }, 0).toFixed(2);
    };

    const calculateTotalItems = () => {
        return selectedItems.reduce((total, id) => {
            const item = cartItems.find(item => item.id === id);
            return item ? total + item.quantity : total;
        }, 0);
    };

    const toggleSelectItem = (id) => {
        setSelectedItems(prev =>
            prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
        );
    };

    const handleUpdateQuantity = async (id, change, currentQuantity) => {
        const newQuantity = Math.max(currentQuantity + change, 1);
        await updateQuantity(id, newQuantity);
    };

    const handleRemoveItem = async (productId) => {
        try {
          await removeItem(productId);
          // Also remove from selected items if it was selected
          setSelectedItems(prev => prev.filter(id => id !== productId));
        } catch (error) {
          console.error("Error removing item:", error);
          // You could add a toast notification here
        }
      };

    const handleAddressChange = (e) => {
        setUserInfo({ ...userInfo, address: e.target.value });
    };

    const handleCheckout = () => {
        if (selectedItems.length === 0) {
            alert("Please select items to proceed with the checkout.");
        } else {
            setShowCheckoutModal(true);
        }
    };

    const confirmCheckout = () => {
        // Logic to handle the checkout process goes here
        setOrderPlaced(true);
        setShowCheckoutModal(false);
        setSelectedItems([]); // Clear selected items after ordering
    };

    const generatePDFReceipt = () => {
        const doc = new jsPDF();
        doc.text("Receipt", 10, 10);
        doc.text(`Name: ${userInfo.name}`, 10, 20);
        doc.text(`Address: ${userInfo.address}`, 10, 30);
        doc.text("Items:", 10, 40);

        let yPos = 50;
        selectedItems.forEach(id => {
            const item = cartItems.find(item => item.id === id);
            if (item) {
                doc.text(`${item.name} - ₱${item.price} x ${item.quantity} = ₱${(item.price * item.quantity).toFixed(2)}`, 10, yPos);
                yPos += 10;
            }
        });
        doc.text(`Total Price: ₱${calculateTotal()}`, 10, yPos + 10);
        doc.save("receipt.pdf");
    };

    const generateExcelReceipt = () => {
        const data = selectedItems.map(id => {
            const item = cartItems.find(item => item.id === id);
            return {
                Name: item.name,
                Price: item.price,
                Quantity: item.quantity,
                Subtotal: item.price * item.quantity,
            };
        });
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Receipt");
        XLSX.writeFile(workbook, "receipt.xlsx");
    };

    if (loading) {
        return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
    }
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-[#fffdf9] to-[#134278]">
            <div className="flex flex-col lg:flex-row justify-center gap-5">
                <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-2xl">
                    <h1 className="text-2xl font-bold mb-5 text-center">Your Cart</h1>
                    {cartItems.length === 0 ? (
                        <p className="text-center">Your cart is empty.</p>
                    ) : (
                        <table className="w-full table-fixed">
                            <thead>
                                <tr>
                                    <th className="w-1/12 text-left py-2">Select</th>
                                    <th className="w-1/2 text-left py-2">Item</th>
                                    <th className="w-1/6 text-left py-2">Price</th>
                                    <th className="w-1/6 text-left py-2">Subtotal</th>
                                    <th className="w-1/12 text-left py-2">Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cartItems.map((item) => (
                                    <tr key={item._id} className="border-b border-gray-300">
                                        <td className="py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedItems.includes(item._id)}
                                                onChange={() => toggleSelectItem(item._id)}
                                            />
                                        </td>
                                        <td className="py-3 flex items-center">
                                            <img src={item.product.images[0].url} alt={item.product.name} className="w-16 h-16 mr-4" />
                                            <div>
                                                <span>{item.product.name}</span>
                                                <div className="flex items-center mt-1">
                                                    <button onClick={() => handleUpdateQuantity(item.product._id, -1, item.quantity)} className="p-1">
                                                        <AiOutlineMinus />
                                                    </button>
                                                    <span className="mx-2">{item.quantity}</span>
                                                    <button onClick={() => handleUpdateQuantity(item.product._id, 1, item.quantity)} className="p-1">
                                                        <AiOutlinePlus />
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3">₱{item.product.price}</td>
                                        <td className="py-3">₱{(item.product.price * item.quantity).toFixed(2)}</td>
                                        <td className="py-3 text-red-500 cursor-pointer" onClick={() => handleRemoveItem(item.product._id)}>
                                            <AiOutlineDelete />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xs">
                    <h2 className="text-xl font-bold mb-4 text-center">Total Receipt</h2>
                    <div className="mb-2">
                        <strong>Name:</strong> {userInfo.name}
                    </div>
                    <div className="mb-4">
                        <strong>Shipping Address:</strong>
                        <input
                            type="text"
                            value={userInfo.address}
                            onChange={handleAddressChange}
                            className="mt-1 p-2 w-full border rounded"
                        />
                    </div>
                    <div className="flex justify-between mb-2 border-b border-gray-300 pb-2">
                        <span>Total Items:</span>
                        <span>{calculateTotalItems()}</span>
                    </div>
                    <div className="flex justify-between mb-4 border-b border-gray-300 pb-2">
                        <span>Total Price:</span>
                        <span>₱{calculateTotal()}</span>
                    </div>
                    <button
                        onClick={handleCheckout}
                        className="w-full mb-2 border-2 border-white bg-[#0c3a6d] text-white hover:text-[#8b98a7] transition duration-400"
                    >
                        Checkout
                    </button>
                    <div className="flex justify-around mb-2">
                        <button
                            onClick={generatePDFReceipt}
                            className="text-[#0c3a6d] hover:text-[#8b98a7] transition duration-400"
                        >
                            <AiOutlineFilePdf size={24} />
                        </button>
                        <button
                            onClick={generateExcelReceipt}
                            className="text-[#0c3a6d] hover:text-[#8b98a7] transition duration-400"
                        >
                            <AiOutlineFileExcel size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {showCheckoutModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-11/12 max-w-md">
                        <h2 className="text-xl font-bold mb-4">Confirm Checkout</h2>
                        <p>Are you sure you want to proceed with the checkout?</p>
                        <div className="flex justify-end mt-4">
                            <button onClick={() => setShowCheckoutModal(false)} className="mr-2 px-4 py-2 bg-red-500 text-white rounded">
                                Cancel
                            </button>
                            <button onClick={confirmCheckout} className="px-4 py-2 bg-[#0c3a6d] text-white rounded">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {orderPlaced && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-11/12 max-w-md text-center">
                        <h2 className="text-xl font-bold mb-4">Thank You!</h2>
                        <p>Your order has been placed successfully. Enjoy your coffee!</p>
                        <button onClick={() => setOrderPlaced(false)} className="mt-4 px-4 py-2 bg-[#0c3a6d] text-white rounded">
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
