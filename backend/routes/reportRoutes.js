const express = require("express");
const router = express.Router();
const { getReport, downloadPDF, downloadCSV } = require("../controllers/reportController");
const auth = require("../middleware/authMiddlleware");

// Protect all routes with JWT
router.get("/", auth, getReport);
router.get("/download/pdf", auth, downloadPDF);
router.get("/download/csv", auth, downloadCSV);

module.exports = router;
