// routes/chatbotRoutes.js
const express = require("express");
const router = express.Router();
const { postMessage, getMessages } = require("../controllers/chatBotController");
const auth = require("../middleware/authMiddlleware");

router.post("/",auth,postMessage);
router.get("/messages",auth,getMessages);

module.exports = router;
