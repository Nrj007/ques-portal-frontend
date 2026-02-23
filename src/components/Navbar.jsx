import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Upload, Menu, X, Heart, FileText } from "lucide-react";
import containerLogo from "../assets/Container.png";

const Navbar = () => {
  const { user, logout, openLoginModal } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
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
                <div className="flex items-center gap-6">
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
                  <Link
                    to="/request-paper"
                    className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      location.pathname === "/request-paper"
                        ? "text-gray-900 font-bold"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Request Paper
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-6">
                  <button
                    onClick={openLoginModal}
                    className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    Favorites
                  </button>
                  <button
                    onClick={openLoginModal}
                    className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="w-4 h-4" />
                    Request Paper
                  </button>
                </div>
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
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === "/admin/analytics"
                        ? "text-gray-900 font-bold"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Stats
                  </Link>
                  <Link
                    to="/admin/requests"
                    className={`text-sm font-medium transition-colors ${
                      location.pathname === "/admin/requests"
                        ? "text-gray-900 font-bold"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    Requests
                  </Link>
                </>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-3">
                {/* User display */}
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100"
                  title={user.email}
                >
                  <svg
                    className="w-4 h-4 text-blue-500"
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
                  <span className="text-sm font-semibold text-gray-700">
                    {user.email ? user.email.split("@")[0] : user.username}
                  </span>
                </div>

                {/* Logout icon */}
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
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

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-500 hover:text-gray-900 focus:outline-none p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute w-full left-0 top-full">
          <div className="px-4 pt-2 pb-3 space-y-1 flex flex-col">
            <Link
              to="/search"
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                !isFavourites && !isHome
                  ? "text-gray-900 bg-gray-50 font-bold"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              All Papers
            </Link>

            {user ? (
              <>
                <Link
                  to="/favourites"
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    isFavourites
                      ? "text-gray-900 bg-gray-50 font-bold"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Favorites
                </Link>
                <Link
                  to="/request-paper"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === "/request-paper"
                      ? "text-gray-900 bg-gray-50 font-bold"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Request Paper
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={openLoginModal}
                  className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                >
                  Favorites
                </button>
                <button
                  onClick={openLoginModal}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                >
                  <FileText className="w-4 h-4" />
                  Request Paper
                </button>
              </>
            )}

            {user && user.role === "admin" && (
              <>
                <Link
                  to="/admin/manage"
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === "/admin/manage"
                      ? "text-gray-900 bg-gray-50 font-bold"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Manage
                </Link>
                <Link
                  to="/admin"
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === "/admin"
                      ? "text-gray-900 bg-gray-50 font-bold"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Upload
                </Link>
                <Link
                  to="/admin/analytics"
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === "/admin/analytics"
                      ? "text-gray-900 bg-gray-50 font-bold"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Stats
                </Link>
                <Link
                  to="/admin/requests"
                  className={`block px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === "/admin/requests"
                      ? "text-gray-900 bg-gray-50 font-bold"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  Requests
                </Link>
              </>
            )}

            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center">
                {user ? (
                  <>
                    <div className="flex flex-col">
                      <div className="text-base font-medium leading-none text-gray-800">
                        {user.email ? user.email.split("@")[0] : user.username}
                      </div>
                      {user.email && (
                        <div className="text-sm mt-1 font-medium leading-none text-gray-500">
                          {user.email}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        navigate("/");
                      }}
                      className="ml-auto bg-white flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <LogOut className="h-6 w-6" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={openLoginModal}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
