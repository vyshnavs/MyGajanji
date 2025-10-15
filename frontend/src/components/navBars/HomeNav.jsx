// components/Navbar.jsx
import React, { useRef, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navRef = useRef(null);
  const navigate = useNavigate();

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        !dropdownRef.current?.contains(event.target) &&
        !navRef.current?.contains(event.target)
      ) {
        setProfileOpen(false);
        setNavOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load user from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          name: decoded.name || "User",
          image: decoded.picture || "",
        });
      } catch {
        console.error("Invalid token");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setProfileOpen(false);
    setNavOpen(false);
    navigate("/login");
  };

  const handleNavClick = (path) => {
    navigate(path);
    setNavOpen(false);
    setProfileOpen(false);
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 backdrop-blur-md bg-black/20 border-b border-blue-600 z-50 relative">
      <div
        className="text-2xl font-bold text-blue-400 cursor-pointer"
        onClick={() => handleNavClick("/")}
      >
        MyGajanji
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-6 items-center">
        <a href="/about" className="hover:text-blue-300">About</a>
        <a href="/chatbot" className="hover:text-blue-300">Chatbot</a>
        <a href="/help" className="hover:text-blue-300">Help</a>
        <a href="/addtransaction" className="hover:text-blue-300">Add Transaction</a>
        <a href="/category" className="hover:text-blue-300">Category</a>
        <a href="/reports" className="hover:text-blue-300">Reports</a>

        {!user ? (
          <a
            href="/login"
            className="px-4 py-2 bg-blue-600 rounded-full hover:bg-blue-500 transition-all"
          >
            Login
          </a>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <img
                src={
                  user.image ||
                  "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"
                }
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border border-blue-400"
              />
              <span className="text-white font-medium hidden sm:block">
                {user.name}
              </span>
              <ChevronDown className="text-white w-4 h-4" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-black/90 text-white rounded-md shadow-lg py-2 border border-blue-700 z-50">
                <button
                  onClick={() => handleNavClick("/profile")}
                  className="block w-full text-left px-4 py-2 hover:bg-blue-600"
                >
                  View Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-blue-600"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Menu Icon */}
      <button
        className="md:hidden text-white"
        onClick={() => setNavOpen(!navOpen)}
      >
        {navOpen ? <X size={26} /> : <Menu size={26} />}
      </button>

      {/* Compact Mobile Dropdown */}
      {navOpen && (
        <div
          ref={navRef}
          className="absolute top-full right-4 w-56 bg-black/90 border border-blue-700 text-white flex flex-col items-start px-4 py-3 space-y-2 md:hidden z-50 rounded-xl shadow-lg"
        >
          {/* Profile Section */}
          {user ? (
            <div className="w-full" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center justify-between w-full px-2 py-2 bg-black/40 rounded-md border border-blue-700"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={
                      user.image ||
                      "https://www.svgrepo.com/show/384674/account-avatar-profile-user-11.svg"
                    }
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover border border-blue-400"
                  />
                  <span className="font-medium text-sm">{user.name}</span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="mt-1 flex flex-col gap-1 bg-black/60 rounded-md border border-blue-700 py-2">
                  <button
                    onClick={() => handleNavClick("/profile")}
                    className="w-full text-left px-3 py-1.5 hover:bg-blue-600 text-sm"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-1.5 hover:bg-blue-600 text-sm"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => handleNavClick("/login")}
              className="w-full text-left px-3 py-1.5 bg-blue-600 rounded-md hover:bg-blue-500 transition-all text-sm"
            >
              Login
            </button>
          )}

          {/* Main Menus */}
          <div className="flex flex-col gap-1 mt-2 w-full text-sm">
            <button onClick={() => handleNavClick("/about")} className="hover:text-blue-300 text-left">About</button>
            <button onClick={() => handleNavClick("/chatbot")} className="hover:text-blue-300 text-left">Chatbot</button>
            <button onClick={() => handleNavClick("/help")} className="hover:text-blue-300 text-left">Help</button>
            <button onClick={() => handleNavClick("/addtransaction")} className="hover:text-blue-300 text-left">Add Transaction</button>
            <button onClick={() => handleNavClick("/category")} className="hover:text-blue-300 text-left">Category</button>
            <button onClick={() => handleNavClick("/reports")} className="hover:text-blue-300 text-left">Reports</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
