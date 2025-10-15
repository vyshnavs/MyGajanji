import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/connection";

// 🎨 SVG Icons (Tailwind-friendly)
const EditIcon = () => (
  <svg className="w-5 h-5 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 21v-3l11-11 3 3L6 21H3z" />
    <path d="M14 7l3 3" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-5 h-5 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-6 h-6 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <path d="M16 2v4" />
    <path d="M8 2v4" />
    <path d="M3 10h18" />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

export default function CategoryManagement() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [grouped, setGrouped] = useState({ income: [], expense: [], summary: {} });
  const [expanded, setExpanded] = useState({});
  const navigate = useNavigate();

  // Budget period state
  const [period, setPeriod] = useState("monthly");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedWeek, setSelectedWeek] = useState(1);

  // Generate years (last 5 years and next 1 year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 7 }, (_, i) => currentYear - 3 + i);

  // Months for dropdown
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  // Weeks for dropdown (1-52)
  const weeks = Array.from({ length: 52 }, (_, i) => i + 1);

  // 🔹 Fetch category summaries and items
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const params = { period };
      
      // Add period-specific parameters
      if (period === "yearly") {
        params.year = selectedYear;
      } else if (period === "monthly") {
        params.year = selectedYear;
        params.month = selectedMonth;
      } else if (period === "weekly") {
        params.year = selectedYear;
        params.week = selectedWeek;
      }

      const res = await api.get("/categories", {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });
      setGrouped(res.data);
    } catch (err) {
      console.error("❌ Fetch categories error:", err);
      setError(err?.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [period, selectedYear, selectedMonth, selectedWeek]);

  const toggleExpand = (type, category) => {
    const key = `${type}__${category}`;
    setExpanded((s) => ({ ...s, [key]: !s[key] }));
  };

  const goEdit = (id) => navigate(`/transaction/edit/${id}`);

  const handleDelete = async (id) => {
    if (!confirm("Delete this transaction? This cannot be undone.")) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCategories(); // Refresh after delete
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete transaction");
    }
  };

  const quickAdd = () => navigate("/addtransaction");
  const goHome = () => navigate("/");

  // Get current period display text
  const getPeriodDisplay = () => {
    if (period === "yearly") return `${selectedYear}`;
    if (period === "monthly") return `${months[selectedMonth - 1]?.label} ${selectedYear}`;
    if (period === "weekly") return `Week ${selectedWeek}, ${selectedYear}`;
    return "Current Period";
  };

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-gray-100 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl animate-bounce" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-green-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }}></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }}></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/5 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${15 + Math.random() * 20}s infinite linear`,
                animationDelay: `${Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, -10px) rotate(90deg); }
          50% { transform: translate(0, -20px) rotate(180deg); }
          75% { transform: translate(-10px, -10px) rotate(270deg); }
        }
      `}</style>

      <div className="max-w-6xl mx-auto relative">
        {/* Header */}
<header className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
  <div className="flex items-center gap-4">
    {/* Home Button - now inside the header flow */}
    <button
      onClick={goHome}
      className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transform hover:-translate-y-0.5 transition-all duration-300 group"
    >
      <HomeIcon className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
      <span className="text-sm font-medium group-hover:text-blue-300 transition-colors hidden sm:block">
        Home
      </span>
    </button>
    
    <div>
      <h1 className="text-2xl md:text-3xl font-semibold tracking-tight bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Category Management
      </h1>
      <div className="flex items-center gap-2 mt-2 text-gray-400">
        <CalendarIcon />
        <span className="text-sm">{getPeriodDisplay()}</span>
      </div>
    </div>
  </div>
  
  <div className="flex gap-3 items-center">
    <button
      onClick={quickAdd}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 transform hover:-translate-y-0.5 transition-all duration-300 backdrop-blur-sm border border-blue-500/30"
    >
      <PlusIcon />
      <span className="hidden sm:inline">Quick Add</span>
    </button>
    <button
      onClick={fetchCategories}
      className="px-3 py-2 rounded-xl border border-gray-700 hover:bg-gray-800/50 transition-all duration-300 backdrop-blur-sm"
    >
      Refresh
    </button>
  </div>
</header>
        {/* Period Selector */}
        <div className="mb-8 p-4 rounded-xl bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Period Type Selector */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Budget Period
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-gray-700/80 backdrop-blur-sm border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              >
                <option value="yearly">Yearly</option>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>

            {/* Year Selector */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-gray-700/80 backdrop-blur-sm border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Selector (shown for monthly period) */}
            {period === "monthly" && (
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-gray-700/80 backdrop-blur-sm border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                >
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Week Selector (shown for weekly period) */}
            {period === "weekly" && (
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Week
                </label>
                <select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-gray-700/80 backdrop-blur-sm border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                >
                  {weeks.map((week) => (
                    <option key={week} value={week}>
                      Week {week}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Loading / Error */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-pulse text-gray-400">Loading categories...</div>
          </div>
        ) : error ? (
          <div className="p-4 rounded-lg bg-red-900/30 backdrop-blur-sm border border-red-700/50 text-red-300">
            {error}
          </div>
        ) : (
          <>
            {/* Summary Bar */}
            <div className="mb-8 flex flex-col md:flex-row justify-between gap-3">
              <div className="bg-blue-900/30 backdrop-blur-sm border border-blue-700/30 p-4 rounded-xl flex-1 text-center hover:border-blue-600/50 transition-all duration-300">
                <h3 className="text-sm text-gray-400">Total Income</h3>
                <p className="text-2xl font-semibold text-blue-300">
                  ₹{grouped.summary?.incomeTotal?.toFixed(2) || 0}
                </p>
              </div>
              <div className="bg-red-900/30 backdrop-blur-sm border border-red-700/30 p-4 rounded-xl flex-1 text-center hover:border-red-600/50 transition-all duration-300">
                <h3 className="text-sm text-gray-400">Total Expense</h3>
                <p className="text-2xl font-semibold text-red-300">
                  ₹{grouped.summary?.expenseTotal?.toFixed(2) || 0}
                </p>
              </div>
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/30 p-4 rounded-xl flex-1 text-center hover:border-gray-600/50 transition-all duration-300">
                <h3 className="text-sm text-gray-400">Net Balance</h3>
                <p
                  className={`text-2xl font-semibold ${
                    grouped.summary?.net >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  ₹{grouped.summary?.net?.toFixed(2) || 0}
                </p>
              </div>
            </div>

            {/* Income + Expense Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Income */}
              <section className="space-y-4">
                <h2 className="text-xl font-medium text-blue-300">Income</h2>
                {grouped.income?.length === 0 ? (
                  <div className="p-4 rounded-lg bg-gray-800/40 backdrop-blur-sm border border-gray-700/50">
                    No income categories yet.
                  </div>
                ) : (
                  grouped.income.map((cat) => {
                    const key = `income__${cat.category}`;
                    const isOpen = !!expanded[key];
                    return (
                      <div
                        key={cat.category}
                        className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-4 hover:shadow-lg transition-all duration-300 relative overflow-hidden border border-gray-700/50 hover:border-blue-500/30"
                      >
                        <button
                          onClick={() => toggleExpand("income", cat.category)}
                          className="w-full text-left flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-700/40">
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 8v8" />
                                <path d="M8 12h8" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-lg font-semibold">{cat.category}</div>
                              <div className="text-sm text-gray-400">
                                {cat.count} transaction{cat.count > 1 ? "s" : ""}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-blue-200">
                              ₹{cat.total.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-400">
                              {isOpen ? "Hide" : "Show"} items
                            </div>
                          </div>
                        </button>

                        <div
                          className={`mt-4 space-y-3 transition-all duration-300 ease-in-out ${
                            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                          }`}
                          style={{ overflow: "hidden" }}
                        >
                          {isOpen &&
                            cat.items.map((tx) => (
                              <div
                                key={tx._id}
                                className="flex items-center justify-between p-3 rounded-xl bg-gray-900/40 border border-gray-800 backdrop-blur-sm hover:border-blue-500/20 transition-all duration-300"
                              >
                                <div>
                                  <div className="font-medium">
                                    {tx.notes || tx.category}
                                  </div>
                                  <div className="text-sm text-gray-400">
                                    {new Date(tx.date).toLocaleDateString()}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="text-sm font-semibold">
                                    ₹{tx.amount.toFixed(2)}
                                  </div>
                                  <button
                                    title="Edit"
                                    onClick={() => goEdit(tx._id)}
                                    className="p-2 rounded-full hover:bg-gray-800 transition-all duration-300"
                                  >
                                    <EditIcon />
                                  </button>
                                  <button
                                    title="Delete"
                                    onClick={() => handleDelete(tx._id)}
                                    className="p-2 rounded-full hover:bg-red-900/60 transition-all duration-300"
                                  >
                                    <TrashIcon />
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </section>

              {/* Expense */}
              <section className="space-y-4">
                <h2 className="text-xl font-medium text-red-300">Expense</h2>
                {grouped.expense?.length === 0 ? (
                  <div className="p-4 rounded-lg bg-gray-800/40 backdrop-blur-sm border border-gray-700/50">
                    No expense categories yet.
                  </div>
                ) : (
                  grouped.expense.map((cat) => {
                    const key = `expense__${cat.category}`;
                    const isOpen = !!expanded[key];
                    return (
                      <div
                        key={cat.category}
                        className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-4 hover:shadow-lg transition-all duration-300 relative overflow-hidden border border-gray-700/50 hover:border-red-500/30"
                      >
                        <button
                          onClick={() => toggleExpand("expense", cat.category)}
                          className="w-full text-left flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-700/40">
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 16V8" />
                                <path d="M8 12h8" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-lg font-semibold">{cat.category}</div>
                              <div className="text-sm text-gray-400">
                                {cat.count} transaction{cat.count > 1 ? "s" : ""}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-red-200">
                              ₹{cat.total.toFixed(2)}
                            </div>
                            <div className="text-sm text-gray-400">
                              {isOpen ? "Hide" : "Show"} items
                            </div>
                          </div>
                        </button>

                        <div
                          className={`mt-4 space-y-3 transition-all duration-300 ease-in-out ${
                            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                          }`}
                          style={{ overflow: "hidden" }}
                        >
                          {isOpen &&
                            cat.items.map((tx) => (
                              <div
                                key={tx._id}
                                className="flex items-center justify-between p-3 rounded-xl bg-gray-900/40 border border-gray-800 backdrop-blur-sm hover:border-red-500/20 transition-all duration-300"
                              >
                                <div>
                                  <div className="font-medium">
                                    {tx.notes || tx.category}
                                  </div>
                                  <div className="text-sm text-gray-400">
                                    {new Date(tx.date).toLocaleDateString()}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="text-sm font-semibold">
                                    ₹{tx.amount.toFixed(2)}
                                  </div>
                                  <button
                                    title="Edit"
                                    onClick={() => goEdit(tx._id)}
                                    className="p-2 rounded-full hover:bg-gray-800 transition-all duration-300"
                                  >
                                    <EditIcon />
                                  </button>
                                  <button
                                    title="Delete"
                                    onClick={() => handleDelete(tx._id)}
                                    className="p-2 rounded-full hover:bg-red-900/60 transition-all duration-300"
                                  >
                                    <TrashIcon />
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
}