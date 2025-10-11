// Sample FAQ data - In a real application, this would come from a database
const faqData = [
  {
    question: "How do I add a transaction?",
    answer: "Go to the 'Add Transaction' page from the main navigation. Fill in the required details including amount, category, date, and description. Click 'Save Transaction' to add it to your records."
  },
  {
    question: "How to reset my password?",
    answer: "Use the 'Forgot Password' link on the login page. Enter your email address and we'll send you a password reset link. Follow the instructions in the email to create a new password."
  },
  {
    question: "Can I export my transaction data?",
    answer: "Yes, go to the 'Reports' section and click the 'Export' button. You can export your data in CSV or Excel format for further analysis or record keeping."
  },
  {
    question: "How do I set up a budget?",
    answer: "Navigate to the 'Budgets' section from the main menu. Click 'Create Budget' and select the category, set the amount, and choose the time period. You can track your spending against this budget throughout the period."
  },
  {
    question: "Why can't I see my recent transactions?",
    answer: "Transactions may take a few moments to appear. If you still don't see them, try refreshing the page. Make sure you're looking at the correct date range and that transactions aren't filtered out."
  },
  {
    question: "How do I categorize my expenses?",
    answer: "When adding a transaction, you can select from predefined categories or create custom ones. You can also edit existing transactions to update their categories in the 'Transactions' page."
  },
  {
    question: "Is my financial data secure?",
    answer: "Yes, we use bank-level encryption to protect your data. All information is stored securely and we never share your personal financial information with third parties without your consent."
  },
  {
    question: "Can I use the app on multiple devices?",
    answer: "Absolutely! Your data syncs across all your devices. Simply log in with your account on any device to access your financial information and continue tracking your expenses."
  }
];

// @desc    Get all FAQs
// @route   GET /api/help
// @access  Public
const getFAQs = async (req, res) => {
  try {
    console.log('GET /api/help called');
    // Simulate async operation (in real app, this would be a DB call)
    const faqs = await Promise.resolve(faqData);
    
    res.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({
      message: 'Server error while fetching FAQs',
      error: process.env.NODE_ENV === 'production' ? {} : error.message
    });
  }
};

module.exports = {
  getFAQs
};