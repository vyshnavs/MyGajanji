import React, { useEffect, useState } from "react";
import {
  formatISO,
  endOfMonth,
  endOfYear,
  endOfWeek,
} from "date-fns";
import api from "../api/connection";

export default function BudgetForm({ budget = null, onClose, onSaved }) {
  const isEdit = Boolean(budget);

  const [name, setName] = useState(budget?.name || "");
  const [category, setCategory] = useState(budget?.category || "");
  const [amount, setAmount] = useState(budget?.amount || "");
  const [recurrence, setRecurrence] = useState(budget?.recurrence || "monthly");
  const [startDate, setStartDate] = useState(
    budget?.startDate?.slice(0, 10) || ""
  );
  const [endDate, setEndDate] = useState(
    budget?.endDate?.slice(0, 10) || ""
  );
  const [thresholdNotify, setThresholdNotify] = useState(
    budget?.thresholdNotify || 90
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [type, setType] = useState(budget?.type || "expense");

  // Category suggestion list
  const categorySuggestions = {
    expense: [
      "Groceries",
      "Dining",
      "Transportation",
      "Fuel",
      "Utilities",
      "Rent",
      "Mortgage",
      "Entertainment",
      "Shopping",
      "Healthcare",
      "Insurance",
      "Education",
      "Travel",
      "Gifts",
      "Personal Care",
      "Subscriptions",
      "Bills",
      "Home Maintenance",
      "Car Maintenance",
      "Clothing",
      "Electronics",
      "Hobbies",
      "Fitness",
      "Pets",
      "Childcare",
    ],
    income: [
      "Salary",
      "Freelance",
      "Business",
      "Investments",
      "Dividends",
      "Rental Income",
      "Bonus",
      "Commission",
      "Side Hustle",
      "Gifts",
      "Refund",
      "Interest",
      "Royalties",
      "Pension",
      "Social Security",
      "Scholarship",
      "Grant",
      "Lottery",
      "Sale",
      "Tips",
    ],
  };

  useEffect(() => {
    if (!budget)
      setStartDate(formatISO(new Date(), { representation: "date" }));
  }, [budget]);

  const calculateEndDate = (start, recurrenceType) => {
    if (!start) return "";
    const startDateObj = new Date(start);
    switch (recurrenceType) {
      case "weekly":
        return formatISO(endOfWeek(startDateObj), { representation: "date" });
      case "monthly":
        return formatISO(endOfMonth(startDateObj), { representation: "date" });
      case "yearly":
        return formatISO(endOfYear(startDateObj), { representation: "date" });
      default:
        return endDate;
    }
  };

  useEffect(() => {
    if (startDate && recurrence !== "custom") {
      const calculatedEndDate = calculateEndDate(startDate, recurrence);
      setEndDate(calculatedEndDate);
    }
  }, [startDate, recurrence]);

  const handleRecurrenceChange = (e) => {
    const newRecurrence = e.target.value;
    setRecurrence(newRecurrence);
    if (newRecurrence !== "custom" && startDate) {
      const calculatedEndDate = calculateEndDate(startDate, newRecurrence);
      setEndDate(calculatedEndDate);
    }
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (newStartDate && recurrence !== "custom") {
      const calculatedEndDate = calculateEndDate(newStartDate, recurrence);
      setEndDate(calculatedEndDate);
    }
  };

  // Handle category input & show suggestions
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);

    if (value.trim()) {
      const filtered = categorySuggestions[type].filter((c) =>
        c.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  // When user clicks a suggestion
  const handleCategorySelect = (selected) => {
    setCategory(selected);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !category || !amount) {
      setError("Please fill name, category and amount.");
      return;
    }

    const payload = {
      name,
      category,
      amount: Number(amount),
      recurrence,
      type,
      startDate: startDate ? new Date(startDate).toISOString() : null,
      endDate: endDate ? new Date(endDate).toISOString() : null,
      thresholdNotify: Number(thresholdNotify),
    };

    setSaving(true);
    try {
      if (isEdit) await api.put(`/budgets/${budget._id}`, payload);
      else await api.post("/budgets", payload);
      onSaved();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save budget.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-lg bg-slate-800 border border-slate-700 rounded-lg p-6 shadow-lg transform animate-slide-in"
      >
        <h2 className="text-xl font-semibold mb-4">
          {isEdit ? "Edit Budget" : "New Budget"}
        </h2>

        {error && (
          <div className="mb-3 text-sm text-red-300 bg-red-900/20 p-2 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            className="input"
            placeholder="Budget name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Type Selector */}
          <select
            className="input"
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setCategory("");
              setShowSuggestions(false);
            }}
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          {/* Category Input + Suggestions */}
          <div className="relative col-span-2">
            <input
              className="input w-full"
              placeholder="Category"
              value={category}
              onChange={handleCategoryChange}
              onFocus={() => {
                if (categorySuggestions[type].length > 0)
                  setShowSuggestions(true);
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
              <ul className="absolute z-20 bg-slate-700 border border-slate-600 rounded-md mt-1 w-full max-h-40 overflow-y-auto">
                {filteredSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-3 py-1 hover:bg-slate-600 cursor-pointer text-sm transition"
                    onMouseDown={() => handleCategorySelect(suggestion)} // use onMouseDown to register before blur
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <input
            className="input"
            placeholder="Amount"
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <select
            className="input"
            value={recurrence}
            onChange={handleRecurrenceChange}
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="yearly">Yearly</option>
            <option value="custom">Custom</option>
          </select>

          <label className="text-sm text-slate-300">Start date</label>
          <label className="text-sm text-slate-300">End date</label>

          <input
            className="input"
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
          />

          <input
            className="input"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={recurrence !== "custom"}
          />

          <div className="col-span-2">
            <label className="block text-sm text-slate-300 mb-1">
              Notify (%) threshold
            </label>
            <input
              className="input"
              type="number"
              min="0"
              max="100"
              value={thresholdNotify}
              onChange={(e) => setThresholdNotify(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-slate-600 hover:bg-slate-700 transition"
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-red-500 hover:brightness-110 transition"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : isEdit
              ? "Update Budget"
              : "Create Budget"}
          </button>
        </div>
      </form>

      <style>{`
        .input { 
          background: rgba(255,255,255,0.03); 
          border: 1px solid rgba(255,255,255,0.04); 
          padding: 0.5rem 0.75rem; 
          border-radius: 0.5rem; 
          color: #e6eef8; 
          outline: none; 
        }
        .input:focus { 
          box-shadow: 0 0 0 4px rgba(99,102,241,0.08); 
          border-color: rgba(99,102,241,0.8); 
        }
        @keyframes slide-in { 
          from { transform: translateY(12px); opacity: 0; } 
          to { transform: translateY(0); opacity: 1; } 
        }
        .animate-slide-in { animation: slide-in 220ms ease-out; }
      `}</style>
    </div>
  );
}
