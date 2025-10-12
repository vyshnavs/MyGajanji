const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddlleware");
const {
  createTransaction,
  getTransactions,
  getSummary,
  getSuggestion,
} = require("../controllers/transactionController");

// ✅ POST /api/transactions -> add transaction
router.post("/", auth, createTransaction);

// ✅ GET /api/transactions -> get user transactions
router.get("/",auth, getTransactions);

// ✅ GET /api/transactions/summary?period=2025-10
router.get("/summary", auth, getSummary);

// ✅ GET /api/transactions/suggestion?period=2025-10
router.get("/suggestion", auth, getSuggestion);

module.exports = router;
