import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  const { t, i18n } = useTranslation();
  const changeLanguage = (lng) => i18n.changeLanguage(lng);
  const [languageOpen, setLanguageOpen] = useState(false);

  if (location.pathname === "/verify-waiting") return null;

  const links = [
    {
      to: "/",
      icon: <HomeIcon className="h-5 w-5" />,
      label: t("nav.home"),
      show: true,
    },
    {
      to: "/login",
      icon: <ArrowRightOnRectangleIcon className="h-5 w-5" />,
      label: t("nav.login"),
      show: !currentUser,
    },
    {
      to: "/register",
      icon: <UserPlusIcon className="h-5 w-5" />,
      label: t("nav.register"),
      show: !currentUser,
    },
    {
      to: "/profile",
      icon: <UserCircleIcon className="h-5 w-5" />,
      label: t("nav.profile"),
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
              className={`hover:text-green-400 ${location.pathname === link.to ? "text-green-500" : ""
                }`}
              title={link.label}
            >
              {link.icon}
            </Link>
          ))}

          {/* Tema düğmesi */}
          <button onClick={toggleTheme} title={t("nav.theme")}>
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>

          {/* Dil seçimi */}
          <div className="relative">
            <button
              onClick={() => setLanguageOpen(!languageOpen)}
              className="text-xs px-2 py-1 rounded hover:bg-green-700"
            >
              {i18n.language.toUpperCase()}
            </button>
            {languageOpen && (
              <div className="absolute top-9 right-0 bg-[#2c2c2c] text-white rounded shadow-md z-50">
                <button
                  onClick={() => {
                    changeLanguage("tr");
                    setLanguageOpen(false);
                  }}
                  className="block px-4 py-2 hover:bg-gray-700 w-full text-left"
                >
                  {t("nav.lang_tr")}
                </button>
                <button
                  onClick={() => {
                    changeLanguage("en");
                    setLanguageOpen(false);
                  }}
                  className="block px-4 py-2 hover:bg-gray-700 w-full text-left"
                >
                  {t("nav.lang_en")}
                </button>
              </div>
            )}
          </div>


          {/* Çıkış */}
          {currentUser && (
            <button
              onClick={handleLogout}
              className="text-red-300 hover:text-red-500 transition"
              title={t("landing.logout")}
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`sm:hidden absolute top-16 left-4 right-4 bg-[#1f1f1f] rounded-md shadow-md transition-all duration-300 ease-in-out overflow-hidden ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <div className="flex flex-col px-4 py-3 space-y-2">
          {links
            .filter((link) => link.show)
            .map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block py-2 px-3 rounded hover:bg-gray-700 ${location.pathname === link.to
                  ? "text-green-500"
                  : "text-white"
                  }`}
              >
                {link.label}
              </Link>
            ))}

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 text-white"
          >
            {t("nav.theme")}:{" "}
            {theme === "dark" ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
          </button>

          <div className="flex gap-2 px-3">
            <button
              onClick={() => changeLanguage("tr")}
              className="text-xs hover:text-green-300"
            >
              {t("nav.lang_tr")}
            </button>
            <button
              onClick={() => changeLanguage("en")}
              className="text-xs hover:text-green-300"
            >
              {t("nav.lang_en")}
            </button>
          </div>

          {currentUser && (
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="block text-left px-3 py-2 text-red-300 hover:bg-red-800 rounded"
            >
              {t("landing.logout")}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
