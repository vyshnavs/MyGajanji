import React, { useState } from "react";
import api from "../api/connection"; // Import your API instance

export default function TransactionForm({ onSuccess }) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [method, setMethod] = useState("cash");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!amount || Number(amount) <= 0) return "Please enter a valid amount";
    if (!category) return "Please enter a category";
    if (!date) return "Please select a date";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = { amount: Number(amount), type, category, date, method, notes };
      const res = await api.post("/transactions", payload);

      if (res.status === 200 || res.status === 201) {
        // Reset form
        setAmount("");
        setType("expense");
        setCategory("");
        setDate(new Date().toISOString().slice(0, 10));
        setMethod("cash");
        setNotes("");

        if (onSuccess) onSuccess();
      }
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to add transaction";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="text-sm text-red-400 bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}

      {/* Amount & Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Amount</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:outline-none"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
      </div>

      {/* Category, Date, Method */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Category</label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700"
            placeholder="e.g., Groceries, Salary, Bills"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-1">Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="bank">Bank Transfer</option>
            <option value="upi">UPI</option>
          </select>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm text-gray-300 mb-1">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 resize-none"
          placeholder="Notes about this transaction"
        />
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 active:scale-95 transform transition shadow-md text-white font-medium"
        >
          {loading ? "Adding..." : "Add Transaction"}
        </button>
      </div>
    </form>
  );
}
