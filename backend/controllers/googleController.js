const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // Upsert user and get the updated/created doc with _id
    const user = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          email, // ensure email is stored
          name,
          picture,
          provider: "google",
          isVerified: true,
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      {
        upsert: true,
        new: true, // or use returnDocument: 'after'
      }
    );

    // Include Mongo _id in the token payload
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
      message: "Google login successful",
      accessToken,
    });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(401).json({ error: "Invalid Google token" });
  }
};
