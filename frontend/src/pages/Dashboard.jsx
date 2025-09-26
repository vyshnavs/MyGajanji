import React, { useState } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

// Dashboard.jsx
// Single-file React component for a compact dashboard with:
// - Summary cards
// - Quick Add button (modal)
// - Mini sparkline charts (using recharts)
// - Quick Links
// Tailwind CSS required in the host project.

const miniData = (seed = 1) =>
  Array.from({ length: 10 }).map((_, i) => ({
    x: i,
    y: Math.round((Math.sin((i + seed) / 2) + 1) * 50 + Math.random() * 10),
  }));

const SummaryCard = ({ title, value, delta, chartSeed }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-4 flex flex-col justify-between gap-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm text-slate-400">{title}</div>
          <div className="text-2xl font-semibold mt-1">{value}</div>
          <div className={`mt-1 text-xs ${delta >= 0 ? "text-green-600" : "text-red-500"}`}>
            {delta >= 0 ? `+${delta}%` : `${delta}%`}
          </div>
        </div>
        <div className="w-28 h-14">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={miniData(chartSeed)}>
              <Line type="monotone" dataKey="y" stroke="#4f46e5" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const QuickLink = ({ icon, title, subtitle, onClick }) => (
  <button
    onClick={onClick}
    className="text-left p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm hover:shadow-md transition w-full"
  >
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center">{icon}</div>
      <div className="flex-1">
        <div className="font-medium">{title}</div>
        <div className="text-xs text-slate-400">{subtitle}</div>
      </div>
    </div>
  </button>
);

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [items, setItems] = useState([
    { id: 1, text: "New lead: Ashok", time: "2m" },
    { id: 2, text: "Invoice #342 paid", time: "1h" },
  ]);
  const [quickAddText, setQuickAddText] = useState("");

  const metrics = [
    { id: 1, title: "Revenue", value: "$12,420", delta: 8, seed: 3 },
    { id: 2, title: "Active Users", value: "3,248", delta: -2, seed: 7 },
    { id: 3, title: "Orders", value: "912", delta: 5, seed: 11 },
    { id: 4, title: "Avg. Session", value: "4m 12s", delta: 1.2, seed: 2 },
  ];

  function handleQuickAdd() {
    if (!quickAddText.trim()) return;
    const id = Date.now();
    setItems((s) => [{ id, text: quickAddText.trim(), time: "now" }, ...s]);
    setQuickAddText("");
    setIsModalOpen(false);
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

            <div className="bg-white dark:bg-slate-800 rounded-lg p-2 shadow">
              <button className="px-3 py-1 text-sm">Filters</button>
            </div>
          </div>
        </div>

        {/* summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {metrics.map((m) => (
            <SummaryCard key={m.id} title={m.title} value={m.value} delta={m.delta} chartSeed={m.seed} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* left: activity / quick add feed */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="font-medium">Recent Activity</div>
                <div className="text-sm text-slate-400">live</div>
              </div>

              <div className="space-y-3">
                {items.map((it) => (
                  <div key={it.id} className="flex items-start justify-between">
                    <div>
                      <div className="text-sm">{it.text}</div>
                      <div className="text-xs text-slate-400">{it.time}</div>
                    </div>
                    <div className="text-xs text-slate-400">›</div>
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
                    <Line type="monotone" dataKey="y" stroke="#06b6d4" strokeWidth={3} dot={false} />
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
                <QuickLink icon={<span>📁</span>} title="Projects" subtitle="Open project board" onClick={() => alert("Open Projects")} />
                <QuickLink icon={<span>🧾</span>} title="Invoices" subtitle="Recent invoices" onClick={() => alert("Open Invoices")} />
                <QuickLink icon={<span>⚙️</span>} title="Settings" subtitle="Workspace settings" onClick={() => alert("Open Settings")} />
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow">
              <div className="font-medium mb-3">Shortcuts</div>
              <div className="flex flex-col gap-2">
                <button className="text-sm p-2 rounded-md text-left hover:bg-slate-50 dark:hover:bg-slate-700">Create report</button>
                <button className="text-sm p-2 rounded-md text-left hover:bg-slate-50 dark:hover:bg-slate-700">Export CSV</button>
                <button className="text-sm p-2 rounded-md text-left hover:bg-slate-50 dark:hover:bg-slate-700">Invite team</button>
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
          <div className="absolute inset-0 bg-black/40" onClick={() => setIsModalOpen(false)} />
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
              <button className="px-4 py-2 rounded-lg" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg" onClick={handleQuickAdd}>
                Add
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
