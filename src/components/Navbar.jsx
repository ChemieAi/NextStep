import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  MoonIcon,
  SunIcon,
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  UserPlusIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (location.pathname === "/verify-waiting") return null;

  const links = [
    {
      to: "/",
      icon: <HomeIcon className="h-5 w-5" />,
      label: "Ana Sayfa",
      show: true,
    },
    {
      to: "/login",
      icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />,
      label: "Giriş Yap",
      show: !currentUser,
    },
    {
      to: "/register",
      icon: <UserPlusIcon className="h-5 w-5" />,
      label: "Kayıt Ol",
      show: !currentUser,
    },
    {
      to: "/profile",
      icon: <UserCircleIcon className="h-5 w-5" />,
      label: "Profil",
      show: currentUser && currentUser.emailVerified,
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout error ❌", err);
    }
  };

  return (
    <nav className="bg-[#2c2c2c] text-white px-4 py-3 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/favicon.svg" alt="NS" className="h-7 w-auto" />
          <span className="text-xl font-bold">NextStepCV</span>
        </Link>

        {/* Hamburger (mobile) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden focus:outline-none"
        >
          {menuOpen ? (
            <XMarkIcon className="h-6 w-6 text-white" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-white" />
          )}
        </button>

        {/* Desktop Menu */}
        <div className="hidden sm:flex items-center space-x-6">
          {links.filter((link) => link.show).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`hover:text-green-400 ${location.pathname === link.to ? "text-green-500" : ""}`}
              title={link.label}
            >
              {link.icon}
            </Link>
          ))}

          <button onClick={toggleTheme} title="Tema Değiştir">
            {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>

          {currentUser && (
            <button
              onClick={handleLogout}
              className="text-red-300 hover:text-red-500 transition"
              title="Çıkış Yap"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`sm:hidden absolute top-16 left-4 right-4 bg-[#1f1f1f] rounded-md shadow-md transition-all duration-300 ease-in-out overflow-hidden ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex flex-col px-4 py-3 space-y-2">
          {links.filter((link) => link.show).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`block py-2 px-3 rounded hover:bg-gray-700 ${location.pathname === link.to ? "text-green-500" : "text-white"}`}
            >
              {link.label}
            </Link>
          ))}

          <button onClick={toggleTheme} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 text-white">
            Tema: {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </button>

          {currentUser && (
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="block text-left px-3 py-2 text-red-300 hover:bg-red-800 rounded"
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
