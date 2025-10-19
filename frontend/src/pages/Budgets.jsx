import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BudgetForm from "../components/BudgetForm";
import api from "../api/connection";

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [filteredBudgets, setFilteredBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [recurrenceFilter, setRecurrenceFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchBudgets();
  }, []);

  useEffect(() => {
    filterBudgets();
  }, [budgets, recurrenceFilter, selectedDate, dateFilter]);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const res = await api.get("/budgets");
      console.log(res.data)
      setBudgets(res.data || []);

      // Desktop notifications
      res.data.forEach((b) => {
        if (b.spent && b.thresholdNotify && (b.spent / b.amount) * 100 >= b.thresholdNotify) {
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Budget Alert", {
              body: `You reached ${b.thresholdNotify}% of ${b.name}`,
            });
          }
        }
      });
    } catch (err) {
      console.error("Failed to fetch budgets", err);
    } finally {
      setLoading(false);
    }
  };

  const filterBudgets = () => {
    let filtered = [...budgets];

    // Filter by recurrence type
    if (recurrenceFilter !== "all") {
      filtered = filtered.filter(budget => budget.recurrence === recurrenceFilter);
    }

    // Filter by date
    if (dateFilter && selectedDate) {
      const filterDate = new Date(selectedDate);
      
      filtered = filtered.filter(budget => {
        const budgetDate = new Date(budget.createdAt || budget.date);
        
        switch (dateFilter) {
          case "specificDate":
            return budgetDate.toDateString() === filterDate.toDateString();
          
          case "thisWeek":
            const startOfWeek = new Date(filterDate);
            startOfWeek.setDate(filterDate.getDate() - filterDate.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            return budgetDate >= startOfWeek && budgetDate <= endOfWeek;
          
          case "thisMonth":
            return budgetDate.getMonth() === filterDate.getMonth() && 
                   budgetDate.getFullYear() === filterDate.getFullYear();
          
          case "thisYear":
            return budgetDate.getFullYear() === filterDate.getFullYear();
          
          default:
            return true;
        }
      });
    }

    setFilteredBudgets(filtered);
  };

  const openNew = () => {
    setEditingBudget(null);
    setShowForm(true);
  };

  const openEdit = async (budget) => {
    try {
      const res = await api.get(`/budgets/${budget._id}`);
      setEditingBudget(res.data);
      setShowForm(true);
    } catch (err) {
      console.error("Failed to fetch budget details", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this budget?")) {
      try {
        await api.delete(`/budgets/${id}`);
        fetchBudgets();
      } catch (err) {
        console.error("Failed to delete budget", err);
      }
    }
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditingBudget(null);
    fetchBudgets();
  };


  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const calculateProgress = (spent, amount) => {
    return Math.min((spent / amount) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return "bg-red-600";
    if (percentage >= 75) return "bg-orange-500";
    return "bg-green-600";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-black to-red-900 text-slate-100">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-md shadow-md transform hover:-translate-y-0.5 transition"
            >
              {/* Home Icon - White */}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-white" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" 
                />
              </svg>
            </Link>
            <h1 className="text-3xl font-bold">Budgets</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={openNew}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800
                         px-4 py-2 rounded-md shadow-md transform hover:-translate-y-0.5 transition font-semibold"
            >
              + New Budget
            </button>
          </div>
        </header>

        {/* Filter Section */}
        <div className="mb-6 p-4 bg-gray-800/70 rounded-lg border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Recurrence Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Recurrence</label>
              <select
                value={recurrenceFilter}
                onChange={(e) => setRecurrenceFilter(e.target.value)}
                className="w-full p-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Recurrence</option>
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="yearly">Yearly</option>
                <option value="daily">Daily</option>
                <option value="one-time">One-time</option>
              </select>
            </div>

            {/* Date Filter Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Date</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full p-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">No Date Filter</option>
                <option value="specificDate">Specific Date</option>
                <option value="thisWeek">This Week</option>
                <option value="thisMonth">This Month</option>
                <option value="thisYear">This Year</option>
              </select>
            </div>

            {/* Date Selector */}
            {dateFilter && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {dateFilter === "specificDate" ? "Select Date" : 
                   dateFilter === "thisWeek" ? "Week Starting" :
                   dateFilter === "thisMonth" ? "Month" : "Year"}
                </label>
                <input
                  type={dateFilter === "thisYear" ? "number" : "date"}
                  value={dateFilter === "thisYear" ? new Date(selectedDate).getFullYear() : selectedDate}
                  onChange={(e) => {
                    if (dateFilter === "thisYear") {
                      setSelectedDate(`${e.target.value}-01-01`);
                    } else {
                      setSelectedDate(e.target.value);
                    }
                  }}
                  className="w-full p-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  min={dateFilter === "thisYear" ? "2020" : undefined}
                  max={dateFilter === "thisYear" ? "2030" : undefined}
                />
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-xl">Loading budgets...</div>
        ) : filteredBudgets.length === 0 ? (
          <div className="text-center py-20">
            <p className="mb-4 text-lg">No budgets found for the selected filters.</p>
            <button 
              onClick={openNew} 
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-md transition font-semibold"
            >
              Create Your First Budget
            </button>
          </div>
        ) : (
          <div className="bg-gray-800/70 rounded-xl border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Budget Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Recurrence</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Spent</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Progress</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Alert At</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredBudgets.map((budget) => {
                    const progress = calculateProgress(budget.spent || 0, budget.amount);
                    const progressColor = getProgressColor(progress);
                    
                    return (
                      <tr key={budget._id} className="hover:bg-gray-750 transition">
                        <td className="px-6 py-4">
                          <div className="font-medium text-white">{budget.name}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900 text-red-200 capitalize">
                            {budget.recurrence}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {formatDate(budget.createdAt || budget.date || new Date())}
                        </td>
                        <td className="px-6 py-4 font-semibold text-white">
                          {formatCurrency(budget.amount)}
                        </td>
                        <td className="px-6 py-4 font-medium text-white">
                          {formatCurrency(budget.spent || 0)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${progressColor} transition-all duration-300`}
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-300 min-w-12">
                              {progress.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {budget.category || "-"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          {budget.thresholdNotify ? `${budget.thresholdNotify}%` : "-"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEdit(budget)}
                              className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm font-medium transition transform hover:scale-105"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(budget._id)}
                              className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded text-sm font-medium transition transform hover:scale-105"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <BudgetForm 
          budget={editingBudget} 
          onClose={() => setShowForm(false)} 
          onSaved={handleSaved} 
        />
      )}
    </div>
  );
}