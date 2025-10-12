// router/AppRouter.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import HomePage from "../pages/HomePage";
import Login from "../pages/login";
import Register from "../pages/register";
import Chatbot from "../pages/ChatBot";
import Dashboard from "../pages/Dashboard";
import SplashScreen from "../components/SplashScreen";
import Help from "../pages/Help";
import AddTransaction from "../pages/AddTransaction";
import CategoryManagement from "../pages/CategoryManagement";
import About from "../pages/About";
import RouteWrapper from "./RouteWrapper";

function AppRouter() {
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    // Show splash screen only on home route
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
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/help" element={<Help />} />
        <Route path="/about" element={<About />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <RouteWrapper protect={true}>
              <Dashboard />
            </RouteWrapper>
          }
        />
        <Route
          path="/chatbot"
          element={
            <RouteWrapper protect={true}>
              <Chatbot />
            </RouteWrapper>
          }
        />
        <Route
          path="/addtransaction"
          element={
            <RouteWrapper protect={true}>
              <AddTransaction />
            </RouteWrapper>
          }
        />
        <Route
          path="/category"
          element={
            <RouteWrapper protect={true}>
              <CategoryManagement />
            </RouteWrapper>
          }
        />
      </Routes>
    </Router>
  );
}

export default AppRouter;
