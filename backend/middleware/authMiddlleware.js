// middleware/auth.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const auth = req.headers.authorization || "";
  const [scheme, token] = auth.split(" ");

  if (!token || !/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
     console.log("[DEBUG] Token received:", token);
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Extract user details from decoded payload
    // Ensure these fields exist in the token payload at login time
    req.user = {
      _id: decoded._id,
      email: decoded.email,
      name: decoded.name,
      roles: decoded.roles || [],
      // add any other claims you sign, e.g., plan, orgId, etc.
    };


    return next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
