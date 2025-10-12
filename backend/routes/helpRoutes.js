const express = require('express');
const router = express.Router();
const  {getFAQs}  = require('../controllers/helpController');

// GET /api/help - Get all FAQs
router.get('/', getFAQs);

module.exports = router;