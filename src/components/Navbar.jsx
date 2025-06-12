import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import {
  HomeIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
  ArrowLeftOnRectangleIcon,
  UserCircleIcon
} from "@heroicons/react/24/solid";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login"); // yönlendirme eklendi
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
    {
      to: "/profile",
      icon: <UserCircleIcon className="h-6 w-6" />,
      label: "Profil",
      show: currentUser && currentUser.emailVerified,
    },
  ];

  if (location.pathname === "/verify-waiting") return null;

  return (
    <nav className="bg-[#2c2c2c] text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img src="/favicon.png" alt="NS" className="h-7"/>
          <span className="text-xl font-bold tracking-wide">NextStepCV</span>
        </div>
        <div className="ml-auto flex items-center space-x-6">
          {links
            .filter((link) => link.show)
            .map((link) => (
              <Link
                key={link.to}
                to={link.to}
                title={link.label}
                className={`transition hover:text-green-400 ${location.pathname === link.to ? "text-green-500" : ""}`}
              >
                {link.icon}
              </Link>
            ))}

          <button onClick={toggleTheme} className="ml-4 hover:text-green-400" title="Tema Değiştir">
            {theme === "dark" ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>

          {currentUser && (
            <button
              onClick={handleLogout}
              title="Çıkış Yap"
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
