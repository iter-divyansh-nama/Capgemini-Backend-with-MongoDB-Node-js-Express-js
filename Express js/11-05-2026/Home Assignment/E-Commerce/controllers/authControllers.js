


//Register -- bcryptjs

//Verify OTP

//Login -- JWT


const User = require("../models/User");
const Otp = require("../models/Otp");
const PendingUser = require("../models/PendingUser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// Async Handler
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };
};

// Helper: generate both tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  return { accessToken, refreshToken };
};



exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, adminSecret } = req.body;
  const existingUser = await PendingUser.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      message: "User already exists, An OTP has already been sent to this email. Please verify."
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const role = adminSecret === "admin123"
    ? "admin"
    : "user";
  await PendingUser.create({
    name,
    email,
    password: hashedPassword,
    role
  });
  const otp = Math.floor(100000 + Math.random() * 900000);
  await Otp.create({ email, otp });

  try {

    await sendEmail(email, otp);

    return res.status(201).json({
      message: "OTP sent successfully to your email"
    });

  } catch (emailError) {

    return res.status(422).json({
      message: "Failed to send OTP. Please check the email address and try again."
    });

  }

});



exports.verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const otpRecord = await Otp.findOne({ email, otp });

  if (!otpRecord) {
    return res.status(400).json({
      message: "Invalid or expired OTP"
    });
  }
  const pendingUser = await PendingUser.findOne({ email });

  if (!pendingUser) {
    return res.status(410).json({
      message: "Registration session expired. Please register again."
    });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      message: "User already exists. Please login."
    });
  }
  const user = await User.create({
    name: pendingUser.name,
    email: pendingUser.email,
    password: pendingUser.password,
    role: pendingUser.role,
    isVerified: true
  });
  await PendingUser.deleteOne({ email });
  await Otp.deleteOne({ email });
  return res.status(200).json({
    message: "Email verified successfully",
    user
  });

});



// Login
exports.login = asyncHandler(async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({
      message: "User not found, Invalid email or password"
    });
  }

  if (!user.isVerified) {
    return res.status(403).json({
      message: "Email not verified. Please verify before logging in."
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({
      message: "Invalid email or password"
    });
  }

  const { accessToken, refreshToken } = generateTokens(user);

  user.refreshToken = refreshToken;

  await user.save();

  return res.status(200).json({
    message: "Login successful",
    accessToken,
    refreshToken
  });

});




// Refresh Token
exports.refreshToken = asyncHandler(async (req, res) => {

  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Refresh token missing"
    });
  }

  let decoded;

  try {

    decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

  } catch (err) {

    return res.status(403).json({
      message: "Invalid or expired refresh token"
    });

  }

  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== refreshToken) {
    return res.status(403).json({
      message: "Refresh token mismatch or user not found"
    });
  }

  const {
    accessToken,
    refreshToken: newRefreshToken
  } = generateTokens(user);

  user.refreshToken = newRefreshToken;

  await user.save();

  return res.status(200).json({
    message: "Token refreshed",
    accessToken,
    refreshToken: newRefreshToken
  });

});