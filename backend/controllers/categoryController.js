const Transaction = require("../models/Transaction");

/**
 * 📍 GET /api/categories
 * 🔒 Protected: requires JWT (req.user injected by auth middleware)
 * 🧠 Returns categorized transactions split into income and expense,
 *     with totals and counts for each category.
 */
exports.getCategories = async (req, res) => {
  try {
    const userId = req.user._id;
    const { period, year, month, week } = req.query;

    // Build date filter based on period selection
    let dateFilter = {};
    const now = new Date();
    
    if (period === 'yearly' && year) {
      const startDate = new Date(parseInt(year), 0, 1);
      const endDate = new Date(parseInt(year) + 1, 0, 1);
      dateFilter = {
        date: {
          $gte: startDate,
          $lt: endDate
        }
      };
    } else if (period === 'monthly' && year && month) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 1);
      dateFilter = {
        date: {
          $gte: startDate,
          $lt: endDate
        }
      };
    } else if (period === 'weekly' && year && week) {
      // Get first day of the year
      const firstDay = new Date(parseInt(year), 0, 1);
      // Calculate start of week (assuming week starts on Monday)
      const startDate = new Date(firstDay);
      startDate.setDate(firstDay.getDate() + (parseInt(week) - 1) * 7 - firstDay.getDay() + 1);
      // Calculate end of week
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 7);
      
      dateFilter = {
        date: {
          $gte: startDate,
          $lt: endDate
        }
      };
    }

    // Fetch transactions with date filter
    const transactions = await Transaction.find({ 
      user: userId,
      ...dateFilter
    })
      .sort({ date: -1 })
      .lean();

    const groups = { income: {}, expense: {} };

    transactions.forEach((tx) => {
      const { type, category = "Uncategorized", amount } = tx;

      if (!groups[type][category]) {
        groups[type][category] = {
          category,
          count: 0,
          total: 0,
          items: [],
        };
      }

      groups[type][category].count++;
      groups[type][category].total += Number(amount) || 0;
      groups[type][category].items.push(tx);
    });

    // Convert grouped objects into sorted arrays
    const incomeArr = Object.values(groups.income).sort((a, b) => b.total - a.total);
    const expenseArr = Object.values(groups.expense).sort((a, b) => b.total - a.total);

    // Calculate summary totals
    const incomeTotal = incomeArr.reduce((sum, c) => sum + c.total, 0);
    const expenseTotal = expenseArr.reduce((sum, c) => sum + c.total, 0);

    res.status(200).json({
      success: true,
      income: incomeArr,
      expense: expenseArr,
      summary: {
        incomeTotal,
        expenseTotal,
        net: incomeTotal - expenseTotal,
      },
      periodInfo: {
        period,
        year,
        month,
        week
      }
    });
  } catch (error) {
    console.error("❌ Error fetching category data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch category data",
    });
  }
};

/**
 * 📍 DELETE /api/categories/:id
 * 🔒 Protected: requires JWT
 * 🧠 Deletes a specific transaction owned by the user.
 */
exports.deleteTransaction = async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ message: "Transaction not found" });

    if (tx.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this transaction" });
    }

    await tx.deleteOne();
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting transaction:", error);
    res.status(500).json({ message: "Failed to delete transaction" });
  }
};

/**
 * 📍 PUT /api/categories/:id
 * 🔒 Protected: requires JWT
 * 🧠 Updates an existing transaction.
 */
exports.updateTransaction = async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);
    if (!tx) return res.status(404).json({ message: "Transaction not found" });

    if (tx.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to edit this transaction" });
    }

    // Update only valid fields
    const allowedFields = ["amount", "type", "category", "date", "method", "notes"];
    allowedFields.forEach((key) => {
      if (req.body[key] !== undefined) tx[key] = req.body[key];
    });

    await tx.save();

    res.status(200).json({
      message: "Transaction updated successfully",
      transaction: tx,
    });
  } catch (error) {
    console.error("❌ Error updating transaction:", error);
    res.status(500).json({ message: "Failed to update transaction" });
  }
};