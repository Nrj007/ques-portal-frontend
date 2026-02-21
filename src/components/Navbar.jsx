import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Upload, Menu, X, Heart } from "lucide-react";
import containerLogo from "../assets/Container.png";

const Navbar = () => {
  const { user, logout, openLoginModal } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isFavourites = location.pathname === "/favourites";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navbarClasses = `fixed w-full z-50 transition-all duration-300 ${
    isHome && !isScrolled
      ? "bg-transparent py-4"
      : "bg-white  py-2 border-b border-gray-100"
  }`;

  const linkClasses = `text-sm font-medium transition-colors ${
    isHome && !isScrolled
      ? "text-gray-800 hover:text-blue-600"
      : "text-gray-600 hover:text-blue-600"
  }`;

  return (
    <nav className={navbarClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex flex-col">
                <img
                  src={containerLogo}
                  alt="Container Logo"
                  className="h-12 w-auto object-cover"
                />
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center gap-6 mr-6">
              <Link
                to="/search"
                className={`text-sm font-medium transition-colors ${
                  !isFavourites && !isHome
                    ? "text-gray-900 font-bold"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                All Papers
              </Link>
              {user ? (
                <Link
                  to="/favourites"
                  className={`text-sm font-medium transition-colors ${
                    isFavourites
                      ? "text-gray-900 font-bold"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  Favorites
                </Link>
              ) : (
                <button
                  onClick={openLoginModal}
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                >
                  Favorites
                </button>
              )}

              {/* Admin specific links seamlessly integrated */}
              {user && user.role === "admin" && (
                <>
                  <Link
                    to="/admin/manage"
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === "/admin/manage"
                        ? "text-gray-900 font-bold"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Manage
                  </Link>
                  <Link
                    to="/admin"
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === "/admin"
                        ? "text-gray-900 font-bold"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Upload
                  </Link>
                  <Link
                    to="/admin/analytics"
                    className={`ml-2 px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${
                      location.pathname === "/admin/analytics"
                        ? "bg-gray-900 text-white"
                        : "bg-gray-900 text-white hover:bg-black"
                    }`}
                  >
                    Stats
                  </Link>
                </>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                {/* User icon */}
                <button
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  title={user.username}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </button>

                {/* Logout icon */}
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Login icon */}
                <button
                  onClick={openLoginModal}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Login"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    />
                  </svg>
                </button>

                {/* Login arrow */}
                <button
                  onClick={openLoginModal}
                  className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Login"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
