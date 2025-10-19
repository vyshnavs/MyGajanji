const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/mailer");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email Already exists",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const verificationToken = jwt.sign(
      { name, email, password: hashed },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const link = `http://localhost:5000/api/auth/verify/${verificationToken}`;

    await sendEmail(email, "Account Verification", {
      text: `Welcome to MyGajanji! Click the link to verify your account: ${link}`, // fallback plain text
      html: `
  <html>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin:0; padding:20px;">
      <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 0 10px rgba(0,0,0,0.1);">
        <div style="background-color:#007BFF; color:#fff; padding:20px; text-align:center;">
          <h1 style="margin:0; font-size:24px;">Verify Your Account</h1>
        </div>
        <div style="padding:30px; color:#555; font-size:16px; line-height:1.5;">
          <p>Welcome to <strong>MyGajanji</strong> – your online money management platform 💰. To complete your account setup, please verify your email by clicking the button below.</p>
          <div style="text-align:center; margin:30px 0;">
            <a href="${link}" 
               style="background-color:#007BFF; color:#fff; text-decoration:none; padding:12px 24px; border-radius:6px; font-weight:bold; display:inline-block;">
               Verify Account
            </a>
          </div>
          <p style="color:#777; font-size:13px; text-align:center;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="word-break:break-word; color:#555; font-size:14px; text-align:center;">
            ${link}
          </p>
        </div>
        <div style="background:#f4f4f4; text-align:center; padding:15px; font-size:12px; color:#aaa;">
          © ${new Date().getFullYear()} MyGajanji. All rights reserved.
        </div>
      </div>
    </body>
  </html>
  `,
    });
    res.json({
      success: true,
      message: "Verification email sent. Please check your inbox.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error during registration.",
    });
  }
};

exports.verify = async (req, res) => {
  try {
    const { name, email, password } = jwt.verify(
      req.params.token,
      process.env.JWT_SECRET
    );

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).send("User already verified or exists");

    const user = await User.create({
      name,
      email,
      password,
      isVerified: true, // Directly verified
    });

    res.send("Email verified and account created successfully!");
  } catch (err) {
    console.error("Verification failed:", err.message);
    res.status(400).send("Invalid or expired verification link.");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(404).send("User not found");
  if (!user.isVerified) return res.status(403).send("Email not verified");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).send("Incorrect password");

  const accessToken = jwt.sign(
    {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      picture: user.picture,
      roles: user.roles || [],
      provider: user.provider,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res.status(200).json({
    message: " login successful",
    accessToken,
  });
};

exports.logout = (req, res) => {
  res.clearCookie("token"); // Clear the JWT cookie
  res.send("Logout successful");
};
