const express = require("express");
const router = express.Router();
const { getReport, downloadPDF, downloadExcel } = require("../controllers/reportController");
const auth = require("../middleware/authMiddlleware");

// Protect all routes with JWT
router.get("/", auth, getReport);
router.get("/download/pdf", auth, downloadPDF);
router.get("/download/csv", auth, downloadExcel);

module.exports = router;
