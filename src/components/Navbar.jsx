import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout error ❌", err);
    }
  };

  const links = [
    { label: "Ana Sayfa", to: "/" },
    !currentUser && { label: "Giriş", to: "/login" },
    !currentUser && { label: "Kayıt", to: "/register" },
  ].filter(Boolean);

  return (
    <nav className="bg-[#2c2c2c] text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold tracking-wide">NextStepCV</div>
        <div className="ml-auto space-x-6 ">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`hover:underline transition ${
                location.pathname === link.to ? "underline font-semibold" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
          {currentUser && (
            <button
              onClick={handleLogout}
              className="ml-4 text-sm text-red-300 hover:underline"
            >
              Çıkış Yap
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
