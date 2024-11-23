import React, { useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "../common/Header";
import StatCard from "../common/StatCard";
import { AlertTriangle, DollarSign, Package, TrendingUp } from "lucide-react";
import MenuTable from "../menu/MenuTable";
import useProductStore from "../../store/productStore";

const MenusPage = () => {
  const { products, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Calculating stats based on products
  const stats = useMemo(() => {
    const totalMenus = products.length;
    const totalStocks = products.reduce((sum, product) => sum + product.stock, 0); // Sum of all stocks
    const lowStockCount = products.filter((product) => product.stock <= 5).length; // Low stock items
    const totalRevenue = products.reduce(
      (sum, product) => sum + product.price * product.stock,
      0
    );
    const topSelling = totalMenus > 0 ? products[0].name : "N/A"; // Placeholder for top-selling

    return {
      totalMenus,
      totalStocks,
      lowStockCount,
      totalRevenue: `₱${totalRevenue.toLocaleString()}`,
      topSelling,
    };
  }, [products]);

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Menus" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard
            name="Total Menus"
            icon={Package}
            value={stats.totalMenus}
            color="#6366F1"
          />
          <StatCard
            name="Total Stocks"
            icon={TrendingUp}
            value={stats.totalStocks}
            color="#10B981"
          />
          <StatCard
            name="Low Stock"
            icon={AlertTriangle}
            value={stats.lowStockCount}
            color="#F59E0B"
          />
          <StatCard
            name="Total Revenue"
            icon={DollarSign}
            value={stats.totalRevenue}
            color="#EF4444"
          />
        </motion.div>

				{/* Menu Table */}
        <MenuTable />

      </main>
    </div>
  );
};

export default MenusPage;
