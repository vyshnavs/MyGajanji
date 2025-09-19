import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/connection";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check if password is strong
  const isStrongPassword = (pwd) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongRegex.test(pwd);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isStrongPassword(password)) {
      setMsg("Password is not strong enough.");
      return;
    }

    setLoading(true);
    setMsg("");
    try {
      await api.post("/auth/register", { name, email, password });
      setSuccess(true);
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const passwordValid = isStrongPassword(password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-blue-900 text-white">
      <div className="bg-[#1f2937] p-10 rounded-2xl shadow-lg w-full max-w-md border border-blue-500">
        <h2 className="text-3xl font-bold mb-4 text-center text-blue-400">Register</h2>

        {success ? (
          <p className="text-green-400 text-center">
            ✅ Check your email to verify your account.
          </p>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            {msg && <p className="text-red-400 text-sm text-center">{msg}</p>}

            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 border border-blue-700 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 border border-blue-700 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password field with strength indicator */}
            <div className="relative">
              <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-xl">
                {password ? (
                  passwordValid ? (
                    <FaCheckCircle className="text-green-400" />
                  ) : (
                    <FaTimesCircle className="text-red-500" />
                  )
                ) : (
                  <FaTimesCircle className="text-gray-500" />
                )}
              </span>
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-9 p-2 border border-blue-700 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <p>The password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.</p>

            <button
              type="submit"
              className={`w-full py-2 rounded transition flex items-center justify-center ${
                passwordValid
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-600 cursor-not-allowed text-gray-300"
              }`}
              disabled={loading || !passwordValid}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Register"
              )}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 font-semibold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
