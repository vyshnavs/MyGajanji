// router/AppRouter.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import HomePage from "../pages/HomePage";
import Login from "../pages/login";
import Register from "../pages/register";
import Chatbot from "../pages/ChatBot";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoutes";
import SplashScreen from "../components/SplashScreen";
import Help from "../pages/Help";

function AppRouter() {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    // Show splash screen only when on home route
    if (window.location.pathname === "/") {
      setShowSplash(true);
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/help" element={<Help />} />
        {/* Protected Routes */}
        <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default AppRouter;