const jwt = require("jsonwebtoken");
const User = require("../models/User");

// asyncHandler
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };
};

// Protect middleware
exports.protect = asyncHandler(async (req, res, next) => {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Access token missing"
    });
  }

  const accessToken = authHeader.split(" ")[1];

  const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id)
    .select("-password -refreshToken");

  if (!user) {
    return res.status(401).json({
      message: "User not found"
    });
  }

  req.user = user;

  next();

});

// Role Based Access Control
exports.authorize = (...roles) => {

  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    next();

  };

};