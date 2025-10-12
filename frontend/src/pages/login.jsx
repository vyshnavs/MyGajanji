import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/connection";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.accessToken);
      setTimeout(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      },60 * 60 * 1000); // or accessToken if used
      navigate("/");
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/google-login", {
        token: credentialResponse.credential,
      });
      localStorage.setItem("token", res.data.accessToken); // assuming response has accessToken
      setTimeout(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }, 60 * 60 * 1000);
      navigate("/");
    } catch (err) {
      setMsg(err.response?.data?.message || "Google Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] px-4">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-[#1e293b] bg-opacity-80 backdrop-blur-md border border-blue-800 p-10 rounded-2xl shadow-2xl w-full max-w-md relative"
      >
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-2xl">
            <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <h2 className="text-3xl font-bold mb-4 text-center text-blue-400">
          Login
        </h2>

        {msg && (
          <p className="text-red-400 mb-3 text-sm text-center font-semibold">
            {msg}
          </p>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-[#0f172a] border border-blue-500 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-[#0f172a] border border-blue-500 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-all"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-300">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-400 font-semibold">
            Register
          </Link>
        </div>

        <div className="mt-6 flex justify-center">
          {!loading && (
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setMsg("Google Sign In Failed")}
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
