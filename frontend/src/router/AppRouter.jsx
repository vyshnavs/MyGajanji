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
import AddTransaction from "../pages/AddTransaction";
import CategoryManagement from "../pages/CategoryManagement";
import About from "../pages/About";


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
        <Route path="/about" element={<About />} />
        {/* Protected Routes */}
        <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
        <Route path="/addtransaction" element={<ProtectedRoute><AddTransaction /></ProtectedRoute>} />
        <Route path="/category" element={<ProtectedRoute><CategoryManagement /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default AppRouter;