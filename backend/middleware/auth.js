const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;

    // Check if header exists
    if (!authHeader) {
      return res.status(401).json({
        error: "No token provided"
      });
    }

    // Format must be: Bearer TOKEN
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Invalid token format"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // IMPORTANT: attach userId
    req.userId = decoded.userId;

    console.log("Auth successful, userId:", req.userId);

    next();

  } catch (error) {

    console.error("Auth error:", error.message);

    return res.status(401).json({
      error: "Invalid token"
    });

  }

};

module.exports = authMiddleware;
