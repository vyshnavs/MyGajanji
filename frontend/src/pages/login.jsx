import React, { useState, useEffect } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [metrics, setMetrics] = useState([]);
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState("");

  useEffect(() => {
    if (isLoggedIn) {
      api.get("/metrics").then((res) => setMetrics(res.data)).catch(() => logout());
      api.get("/activities").then((res) => setActivities(res.data)).catch(() => logout());
    }
  }, [isLoggedIn]);

  const login = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setIsLoggedIn(true);
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed.");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
  };

  const addActivity = async () => {
    if (!newActivity.trim()) return;
    const res = await api.post("/activities", { text: newActivity });
    setActivities((prev) => [res.data, ...prev]);
    setNewActivity("");
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4">
          <h2 className="text-xl font-bold">Login</h2>
          {msg && <p className="text-red-500">{msg}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={login}
            className="w-full bg-indigo-600 text-white py-2 rounded"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m) => (
          <div key={m.title} className="p-4 bg-white shadow rounded">
            <h2 className="font-bold">{m.title}</h2>
            <p className="text-xl">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2">Activities</h2>
        <div className="flex gap-2 mb-4">
          <input
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
            placeholder="New activity"
            className="flex-1 border p-2 rounded"
          />
          <button onClick={addActivity} className="bg-blue-500 text-white px-4 py-2 rounded">
            Add
          </button>
        </div>
        <ul className="space-y-2">
          {activities.map((a) => (
            <li key={a.id} className="p-2 border rounded">
              {a.text} – <span className="text-sm">{a.time || "just now"}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
