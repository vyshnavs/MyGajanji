const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddlleware");
const {
  createBudget,
  getBudgets,
  getBudget,
  updateBudget,
  deleteBudget
} = require("../controllers/budgetController");

router.use(auth);

router.post("/", createBudget);
router.get("/", getBudgets);
router.get("/:id", getBudget);
router.put("/:id", updateBudget);
router.delete("/:id", deleteBudget);

module.exports = router;
