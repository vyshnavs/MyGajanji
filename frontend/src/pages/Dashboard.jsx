import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const miniData = (seed = 1) =>
  Array.from({ length: 10 }).map((_, i) => ({
    x: i,
    y: Math.round((Math.sin((i + seed) / 2) + 1) * 50 + Math.random() * 10),
  }));

const SummaryCard = ({ title, value, delta, chartSeed }) => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-4 flex flex-col justify-between gap-3">
    <div className="flex items-start justify-between">
      <div>
        <div className="text-sm text-slate-400">{title}</div>
        <div className="text-2xl font-semibold mt-1">{value}</div>
        <div
          className={`mt-1 text-xs ${
            delta >= 0 ? "text-green-600" : "text-red-500"
          }`}
        >
          {delta >= 0 ? `+${delta}%` : `${delta}%`}
        </div>
      </div>
      <div className="w-28 h-14">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={miniData(chartSeed)}>
            <Line
              type="monotone"
              dataKey="y"
              stroke="#4f46e5"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [metrics, setMetrics] = useState([]);
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quickAddText, setQuickAddText] = useState("");

  // Fetch metrics and activities from backend
  useEffect(() => {
    axios.get("http://localhost:5000/metrics").then((res) => setMetrics(res.data));
    axios.get("http://localhost:5000/activities").then((res) => setItems(res.data));
  }, []);

  // Add new activity (pending)
  function handleQuickAdd() {
    if (!quickAddText.trim()) return;
    axios
      .post("http://localhost:5000/activities", { text: quickAddText })
      .then((res) => {
        setItems((prev) => [res.data, ...prev]);
        setQuickAddText("");
        setIsModalOpen(false);
      });
  }

  // Approve an activity
  function handleApprove(id) {
    axios.put(`http://localhost:5000/activities/${id}/approve`).then((res) => {
      setItems((prev) => prev.map((item) => (item.id === id ? res.data : item)));
    });
  }

  // Reject an activity
  function handleReject(id) {
    axios.put(`http://localhost:5000/activities/${id}/reject`).then((res) => {
      setItems((prev) => prev.map((item) => (item.id === id ? res.data : item)));
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm text-slate-500">Overview of important metrics</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow"
            >
              + Quick Add
            </button>
          </div>
        </div>

        {/* summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metrics.map((m) => (
            <SummaryCard
              key={m.id}
              title={m.title}
              value={m.value}
              delta={m.delta}
              chartSeed={m.seed}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* left: activity / quick add feed */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium">Recent Activity</div>
              </div>

              <div className="space-y-3">
                {items.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-start justify-between p-2 rounded-md border"
                  >
                    <div>
                      <div className="text-sm">{it.text}</div>
                      <div className="text-xs text-slate-400">
                        {it.time} —{" "}
                        <span
                          className={`font-semibold ${
                            it.status === "pending"
                              ? "text-yellow-600"
                              : it.status === "approved"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {it.status}
                        </span>
                      </div>
                    </div>

                    {it.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          className="px-2 py-1 text-xs bg-green-500 text-white rounded"
                          onClick={() => handleApprove(it.id)}
                        >
                          Approve
                        </button>
                        <button
                          className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                          onClick={() => handleReject(it.id)}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium">Sales Trend</div>
                <div className="text-sm text-slate-400">7 days</div>
              </div>

              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={miniData(42)}>
                    <Line
                      type="monotone"
                      dataKey="y"
                      stroke="#06b6d4"
                      strokeWidth={3}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* right: quick links */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow">
              <div className="font-medium mb-3">Quick Links</div>
              <div className="grid gap-3">
                <button className="text-left p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition w-full">
                  📁 Projects
                </button>
                <button className="text-left p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition w-full">
                  🧾 Invoices
                </button>
                <button className="text-left p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition w-full">
                  ⚙️ Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Add modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsModalOpen(false)}
          />
          <motion.div className="relative z-50 w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Quick Add</h3>
            <p className="text-sm text-slate-400 mb-4">Add a quick note or event</p>
            <input
              value={quickAddText}
              onChange={(e) => setQuickAddText(e.target.value)}
              className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 mb-4"
              placeholder="Write something..."
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-lg"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                onClick={handleQuickAdd}
              >
                Add
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
