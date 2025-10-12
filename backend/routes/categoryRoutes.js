// backend/routes/categoryRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddlleware");
const {
  getCategories,
  deleteTransaction,
  updateTransaction,
} = require("../controllers/categoryController");

// Protected routes
router.get("/", auth, getCategories);
router.delete("/:id", auth, deleteTransaction);
router.put("/:id", auth, updateTransaction);

module.exports = router;
