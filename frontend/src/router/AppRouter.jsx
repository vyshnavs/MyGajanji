import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import Login from "../pages/login";
import Register from "../pages/register";
import Chatbot from "../pages/ChatBot";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoutes";
function AppRouter() {
return (
    <Router>
        <Routes>
            {/* public routes */}
            <Route path="/" element={<HomePage/>} />
            <Route path="/login" element={<Login />} />
             <Route path="/register" element={<Register />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
             {/* Protected Routes */}
            
        </Routes>
         
        
    </Router>
);
}

export default AppRouter;
