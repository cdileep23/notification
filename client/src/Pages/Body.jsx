import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const Body = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(sessionStorage.getItem("user")); // Parse user

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [navigate, user]);

  const isAuthRoute = location.pathname.includes("/auth");

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthRoute && <Navbar user={user} />} {/* pass user as prop */}
      <main className={isAuthRoute ? "" : "pt-16 flex-grow"}>
        <div className="max-w-6xl mx-auto p-4">
          <Outlet context={{ user }} /> {/* ✅ pass context */}
        </div>
      </main>
    </div>
  );
};

export default Body;
