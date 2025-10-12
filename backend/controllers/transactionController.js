const mongoose = require("mongoose");
const Transaction = require("../models/Transaction");

// 🔹 Create a new transaction (used by both frontend & Rasa)
exports.createTransaction = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { amount, type, category, date, method, notes } = req.body;
    if (!amount || !type || !category || !date)
      return res.status(400).json({ message: "Missing required fields" });

    const transaction = new Transaction({
      user: userId,
      amount,
      type,
      category,
      date: new Date(date),
      method,
      notes,
    });

    await transaction.save();
    return res.status(201).json({ message: "Transaction created", transaction });
  } catch (err) {
    console.error("createTransaction error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Fetch all user transactions
exports.getTransactions = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const transactions = await Transaction.find({ user: userId }).sort({ date: -1 });
    return res.status(200).json({ transactions });
  } catch (err) {
    console.error("getTransactions error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ✅ Helper: get start and end date of month or period
const getPeriodRange = (period) => {
  if (!period || period === "this-month") {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start, end };
  }
  // e.g. 2025-09
  const [year, month] = period.split("-").map(Number);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);
  return { start, end };
};

// 🔹 Get summary (income, expense, balance)
exports.getSummary = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { period } = req.query;
    const { start, end } = getPeriodRange(period);

    const totals = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    const income = totals.find((t) => t._id === "income")?.total || 0;
    const expense = totals.find((t) => t._id === "expense")?.total || 0;
    const balance = income - expense;

    return res.status(200).json({ income, expense, balance });
  } catch (err) {
    console.error("getSummary error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// 🔹 Get spending suggestion based on usage
exports.getSuggestion = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const { period } = req.query;
    const { start, end } = getPeriodRange(period);

    const totals = await Transaction.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          date: { $gte: start, $lte: end },
        },
      },
      { $group: { _id: "$type", total: { $sum: "$amount" } } },
    ]);

    const income = totals.find((t) => t._id === "income")?.total || 0;
    const expense = totals.find((t) => t._id === "expense")?.total || 0;
    const ratio = income > 0 ? expense / income : 1;

    let userType, suggestion;

    if (ratio < 0.3) {
      userType = "Saver";
      suggestion = "You're doing great! Consider investing your surplus income.";
    } else if (ratio < 0.6) {
      userType = "Balanced";
      suggestion = "Good job! Try tracking unnecessary subscriptions to save more.";
    } else if (ratio < 0.9) {
      userType = "High Spender";
      suggestion = "Watch your expenses. Maybe cut down on luxury or dining.";
    } else {
      userType = "Critical Spender";
      suggestion = "Your spending exceeds income! Prioritize essentials and budget tightly.";
    }

    res.status(200).json({
      userType,
      income,
      expense,
      balance: income - expense,
      suggestion,
    });
  } catch (err) {
    console.error("getSuggestion error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
