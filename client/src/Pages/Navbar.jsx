import { useSocket } from "@/lib/Socketcontext";
import React from "react";
import { Link, useNavigate } from "react-router-dom";


const Navbar = ({ user }) => {
  const navigate = useNavigate();
  const {  disconnect } = useSocket(); 

  const handleLogout = () => {
   disconnect();
   console.log("🛑 Socket disconnected on logout");

    sessionStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        Notifications
      </Link>

      <nav className="flex gap-6 items-center">
        <Link
          to="/"
          className="text-gray-700 hover:text-blue-600 transition-colors"
        >
          Home
        </Link>
        <Link
          to="/notifications"
          className="text-gray-700 hover:text-blue-600 transition-colors"
        >
          Notifications
        </Link>

        {user && (
          <span className="text-gray-700 font-semibold">
            Hello, {user.username}
          </span>
        )}

        <button
          onClick={handleLogout}
          className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition-colors"
        >
          Logout
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
