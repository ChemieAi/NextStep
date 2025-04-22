import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HomeIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  ArrowLeftOnRectangleIcon, // Çıkış ikonu
} from "@heroicons/react/24/solid";

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
    {
      to: "/",
      icon: <HomeIcon className="h-6 w-6" />,
      label: "Ana Sayfa",
      show: true,
    },
    {
      to: "/login",
      icon: <ArrowRightOnRectangleIcon className="h-6 w-6" />,
      label: "Giriş Yap",
      show: !currentUser,
    },
    {
      to: "/register",
      icon: <UserPlusIcon className="h-6 w-6" />,
      label: "Kayıt Ol",
      show: !currentUser,
    },
  ];

  return (
    <nav className="bg-[#2c2c2c] text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold tracking-wide">NextStepCV</div>
        <div className="ml-auto flex items-center space-x-6">
          {links
            .filter((link) => link.show)
            .map((link) => (
              <Link
                key={link.to}
                to={link.to}
                title={link.label}
                className={`transition hover:text-green-400 ${
                  location.pathname === link.to ? "text-green-500" : ""
                }`}
              >
                {link.icon}
              </Link>
            ))}

          {currentUser && (
            <button
              onClick={handleLogout}
              title="Çıkış"
              className="text-red-300 hover:text-red-500 transition"
            >
              <ArrowLeftOnRectangleIcon className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
