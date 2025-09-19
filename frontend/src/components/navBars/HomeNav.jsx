// components/Navbar.jsx
import React, { useRef, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          name: decoded.name || "User",
          image: decoded.picture || "", // optional: include default later
        });
      } catch (error) {
        console.error("Invalid token");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 backdrop-blur-md bg-black/20 border-b border-blue-600 z-50 relative">
      <div className="text-2xl font-bold text-blue-400">MyGajanji</div>

      <div className="flex gap-6 items-center relative">
        <a href="#features" className="hover:text-blue-300">
          Features
        </a>
        <a href="#built" className="hover:text-blue-300">
          Tech
        </a>
        <a href="#about" className="hover:text-blue-300">
          About
        </a>
          <a href="/chatbot" className="hover:text-blue-300">
          chatbot
        </a>

        {!user ? (
          <a
            href="/login"
            className="px-4 py-2 bg-blue-600 rounded-full hover:bg-blue-500 transition-all"
          >
            Login
          </a>
        ) : (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
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

            {menuOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-48 bg-black/90 text-white rounded-md shadow-lg py-2 border border-blue-700 z-50"
              >
                <button
                  onClick={() => {
                    navigate("/profile");
                    setMenuOpen(false);
                  }}
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
    </nav>
  );
};

export default Navbar;
