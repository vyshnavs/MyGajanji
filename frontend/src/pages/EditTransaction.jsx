import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/connection";

export default function EditTransaction() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);

  const goHome = () => navigate("/");

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await api.get("/transactions");
        const found = res.data.transactions.find((t) => t._id === id);
        console.log("Fetched transaction:", found);
        if (found) setTransaction(found);
        else console.warn("Transaction not found");
      } catch (err) {
        console.error("Error fetching transaction:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransaction();
  }, [id]);

  const handleUpdate = async (updatedData) => {
    try {
      await api.put(`/categories/${id}`, updatedData);
      navigate("/category");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  // Transaction form component
  const TransactionForm = ({ initialData, onSuccess }) => {
    const [amount, setAmount] = useState(initialData?.amount || "");
    const [type, setType] = useState(initialData?.type || "expense");
    const [category, setCategory] = useState(initialData?.category || "");
    const [date, setDate] = useState(
      initialData?.date?.slice(0, 10) || new Date().toISOString().slice(0, 10)
    );
    const [method, setMethod] = useState(initialData?.method || "cash");
    const [notes, setNotes] = useState(initialData?.notes || "");
    const [formLoading, setFormLoading] = useState(false);
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

      setFormLoading(true);
      setError("");

      try {
        const payload = { amount: Number(amount), type, category, date, method, notes };
        await onSuccess(payload);
      } catch (err) {
        const msg = err?.response?.data?.message || "Failed to update transaction";
        setError(msg);
      } finally {
        setFormLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-sm text-red-400 bg-red-900/20 p-2 rounded">{error}</div>
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
          <label className="block text-sm text-gray-300 mb-1">Notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 resize-none"
            placeholder="Notes about this transaction"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/category")}
            className="px-6 py-3 rounded-2xl bg-gray-600 hover:bg-gray-500 active:scale-95 transform transition shadow-md text-white font-medium"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={formLoading}
            className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-500 active:scale-95 transform transition shadow-md text-white font-medium"
          >
            {formLoading ? "Updating..." : "Update Transaction"}
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-1/2 -right-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl animate-bounce"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-green-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDuration: "12s" }}
        ></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
              animation: "gridMove 20s linear infinite",
            }}
          ></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/5 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${15 + Math.random() * 20}s infinite linear`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(10px, -10px) rotate(90deg);
          }
          50% {
            transform: translate(0, -20px) rotate(180deg);
          }
          75% {
            transform: translate(-10px, -10px) rotate(270deg);
          }
        }
      `}</style>

      {/* Home Button */}
      <button
        onClick={goHome}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-3 rounded-2xl bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm border border-gray-700 hover:border-gray-600 transform hover:-translate-y-0.5 transition-all duration-300 group"
      >
        <svg
          className="w-5 h-5 group-hover:text-blue-400 transition-colors"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span className="text-sm font-medium group-hover:text-blue-300 transition-colors hidden sm:block">
          Home
        </span>
      </button>

      <div className="w-full max-w-3xl bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-2xl p-6 transform transition-transform duration-500 ease-out translate-y-6 animate-slideup border border-gray-700/50">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
              Edit Transaction
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              Update income or expense details.
            </p>
          </div>
        </header>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : transaction ? (
          <TransactionForm initialData={transaction} onSuccess={handleUpdate} />
        ) : (
          <p className="text-center text-red-400">Transaction not found.</p>
        )}
      </div>
    </div>
  );
}
