import { BarChart, AttachMoney, Menu as MUI_Menu, Settings, ShoppingCart, TrendingUp, People, Logout } from "@mui/icons-material";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

const SIDEBAR_ITEMS = [
  { name: "Overview", icon: BarChart, color: "#6366f1", href: "/admin/overview" },
  { name: "Menu", icon: "/img/menu.png", color: "#FF5722", href: "/admin/menus" },
  { name: "Origins", icon: "/img/origins.png", color: "#FFEB3B", href: "/admin/origins" },
  { name: "Users", icon: People, color: "#EC4899", href: "/admin/users" },
  { name: "Orders", icon: ShoppingCart, color: "#F59E0B", href: "/admin/orders" },
  { name: "Sales", icon: AttachMoney, color: "#10B981", href: "/admin/sales" },
  { name: "Analytics", icon: TrendingUp, color: "#3B82F6", href: "/admin/analytics" },
  { name: "Settings", icon: Settings, color: "#6EE7B7", href: "/admin/settings" },
];

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const logout = useAuthStore((state) => state.logout); // Access logout function from auth store

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? "w-64" : "w-20"}`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className="h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit"
        >
          <MUI_Menu size={24} />
        </motion.button>

        <nav className="mt-8 flex-grow">
          {SIDEBAR_ITEMS.map((item) => (
            <Link key={item.href} to={item.href}>
              <motion.div className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2">
                {typeof item.icon === "string" ? (
                  <img src={item.icon} alt={item.name} className="w-7 h-7" style={{ minWidth: "20px" }} />
                ) : (
                  <item.icon style={{ color: item.color, minWidth: "20px" }} />
                )}
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className="ml-4 whitespace-nowrap"
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <motion.button
          onClick={logout}
          className="flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mt-auto"
        >
          <Logout size={20} style={{ color: "#F87171" }} />
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.span
                className="ml-4 whitespace-nowrap"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2, delay: 0.3 }}
              >
                Log Out
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
