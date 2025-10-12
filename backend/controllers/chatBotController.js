// controllers/chatbotController.js (relevant parts)
const axios = require("axios");
const ChatMessage = require("../models/ChatMessage");

const RASA_URL = process.env.RASA_URL || "http://localhost:5005/webhooks/rest/webhook";

exports.postMessage = async (req, res) => {
  try {
    const { _id: userId, email, name } = req.user; // extracted from token
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "message is required" });
    }

    // Get token from Authorization header (frontend should send it)
    const token = req.headers.authorization || "";
    console.log("[DEBUG] Authorization header received:", token);

    // Save user message
    await ChatMessage.create({ userId, role: "user", text: message.trim() });

    // Forward to Rasa with token inside metadata
    const rasaResp = await axios.post(
      RASA_URL,
      {
        sender: String(userId),
        message: message.trim(),
        metadata: { token }, // <-- send token in metadata
      },
      {
        timeout: 1500000,
        headers: { "Content-Type": "application/json" },
      }
    );

    // Process Rasa replies
    const rasaMsgs = Array.isArray(rasaResp.data) ? rasaResp.data : [];
    const replies = [];

    for (const m of rasaMsgs) {
      const text =
        m.text ??
        (m.image
          ? `[image] ${m.image}`
          : m.buttons?.length
          ? `Options: ${m.buttons.map((b) => b.title).join(" | ")}`
          : "[unsupported message]");
      const doc = await ChatMessage.create({ userId, role: "bot", text });
      replies.push({ role: "bot", text: doc.text, createdAt: doc.createdAt });
    }

    return res.json({ replies });
  } catch (err) {
    console.error("[ERROR] postMessage:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


exports.getMessages = async (req, res) => {
  const { _id: userId } = req.user; // from token
  const docs = await ChatMessage.find({ userId }).sort({ createdAt: 1 }).lean();
  const messages = docs.map((d) => ({
    _id: d._id,
    role: d.role,
    text: d.text,
    createdAt: d.createdAt,
  }));
  return res.json({ messages });
};

