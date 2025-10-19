const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");
const User = require("../models/user");
const sendEmail = require("../utils/mailer");

/**
 * Compute total spent for each budget category
 */
async function computeSpentForBudgets(budgets, userId) {
  const spentMap = {};

  for (const b of budgets) {
    const trans = await Transaction.find({
      user: userId,
      category: b.category,
      type: "expense",
    });

    const total = trans.reduce((sum, t) => sum + t.amount, 0);
    spentMap[b._id] = total;
  }

  return spentMap;
}

/**
 * Notify user if spending exceeds threshold
 */
async function notifyThreshold(userId, budget, spent) {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    // ✅ Check if user has mailing notifications enabled
    if (!user.mailing) {
      console.log(`User ${user.email} has disabled mail notifications.`);
      return;
    }

    const percent = (spent / budget.amount) * 100;

    // ✅ Send email only if threshold reached and not already notified
    if (percent >= budget.thresholdNotify && !budget.notified) {
      const subject = `Budget Alert: ${budget.name}`;

      const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin:0; padding:20px;">
          <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 0 10px rgba(0,0,0,0.1);">
            <div style="background-color:#FF6B6B; color:#fff; padding:20px; text-align:center;">
              <h1 style="margin:0; font-size:24px;">Budget Alert!</h1>
            </div>
            <div style="padding:30px; color:#555; font-size:16px; line-height:1.5;">
              <p>Hi <strong>${user.name}</strong>,</p>
              <p>You have reached <strong>${percent.toFixed(0)}%</strong> of your budget for <strong>${budget.name}</strong> in the category <strong>${budget.category}</strong>.</p>
              
              <table style="width:100%; margin:20px 0; border-collapse: collapse;">
                <tr style="background:#f4f4f4;">
                  <td style="padding:8px; font-weight:bold;">Budget Name:</td>
                  <td style="padding:8px;">${budget.name}</td>
                </tr>
                <tr>
                  <td style="padding:8px; font-weight:bold;">Category:</td>
                  <td style="padding:8px;">${budget.category}</td>
                </tr>
                <tr style="background:#f4f4f4;">
                  <td style="padding:8px; font-weight:bold;">Budget Amount:</td>
                  <td style="padding:8px;">₹${budget.amount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding:8px; font-weight:bold;">Amount Spent:</td>
                  <td style="padding:8px;">₹${spent.toFixed(2)}</td>
                </tr>
                <tr style="background:#f4f4f4;">
                  <td style="padding:8px; font-weight:bold;">Threshold:</td>
                  <td style="padding:8px;">${budget.thresholdNotify}%</td>
                </tr>
              </table>

              <p style="text-align:center; margin:30px 0;">
                <a href="http://localhost:5000/user/budgets" 
                   style="background-color:#FF6B6B; color:#fff; text-decoration:none; padding:12px 24px; border-radius:6px; font-weight:bold; display:inline-block;">
                   View Budget
                </a>
              </p>

              <p style="color:#777; font-size:13px; text-align:center;">
                Stay on top of your finances by keeping track of your budgets regularly.
              </p>
            </div>
            <div style="background:#f4f4f4; text-align:center; padding:15px; font-size:12px; color:#aaa;">
              © ${new Date().getFullYear()} MyGajanji. All rights reserved.
            </div>
          </div>
        </body>
      </html>
      `;

      const textContent = `
Hi ${user.name},

You have reached ${percent.toFixed(0)}% of your budget for "${budget.name}" in category "${budget.category}".

Budget Amount: ₹${budget.amount.toFixed(2)}
Amount Spent: ₹${spent.toFixed(2)}
Threshold: ${budget.thresholdNotify}%

Check your budgets: http://localhost:5000/user/budgets
      `;

      // Send styled email
      await sendEmail(user.email, subject, {
        text: textContent,
        html: htmlContent
      });

      // ✅ Update notification status
      await Budget.updateOne(
        { _id: budget._id },
        { $set: { notified: true, lastNotifiedAt: new Date() } }
      );

      console.log(`Budget alert sent to ${user.email} for ${budget.name}`);
    }
  } catch (err) {
    console.error("Budget threshold notification failed:", err);
  }
}

/**
 * Create new budget
 */
exports.createBudget = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const budget = new Budget({ ...req.body, user: userId });
    await budget.save();
    res.status(201).json(budget);
  } catch (err) {
    console.error("Create budget failed:", err);
    res.status(500).json({ message: "Failed to create budget." });
  }
};

/**
 * Get all budgets for logged-in user + compute spent + trigger notifications
 */
exports.getBudgets = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const budgets = await Budget.find({ user: userId })
      .sort({ createdAt: -1 })
      .lean();

    const spentMap = await computeSpentForBudgets(budgets, userId);

    // Parallel notify all thresholds
    await Promise.all(
      budgets.map(async (b) => {
        const spent = spentMap[b._id] || 0;
        await notifyThreshold(userId, b, spent);
      })
    );

    const result = budgets.map((b) => ({
      ...b,
      spent: spentMap[b._id] || 0,
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error("Fetch budgets failed:", err);
    res.status(500).json({ message: "Failed to fetch budgets." });
  }
};

/**
 * Get single budget with spent info
 */
exports.getBudget = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const budget = await Budget.findOne({ _id: req.params.id, user: userId });
    if (!budget) return res.status(404).json({ message: "Budget not found." });

    const spentMap = await computeSpentForBudgets([budget], userId);
    res
      .status(200)
      .json({ ...budget.toObject(), spent: spentMap[budget._id] || 0 });
  } catch (err) {
    console.error("Fetch budget failed:", err);
    res.status(500).json({ message: "Failed to fetch budget." });
  }
};

/**
 * Update existing budget
 */
exports.updateBudget = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, user: userId },
      req.body,
      { new: true }
    );
    if (!budget) return res.status(404).json({ message: "Budget not found." });
    res.status(200).json(budget);
  } catch (err) {
    console.error("Update budget failed:", err);
    res.status(500).json({ message: "Failed to update budget." });
  }
};

/**
 * Delete budget
 */
exports.deleteBudget = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });
    if (!budget) return res.status(404).json({ message: "Budget not found." });
    res.status(200).json({ message: "Budget deleted." });
  } catch (err) {
    console.error("Delete budget failed:", err);
    res.status(500).json({ message: "Failed to delete budget." });
  }
};
