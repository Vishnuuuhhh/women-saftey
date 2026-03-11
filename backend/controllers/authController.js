const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;


// ================= REGISTER =================
exports.registerUser = async (req, res) => {

  try {

    let { name, email, password } = req.body;

    // normalize input
    name = name.trim();
    email = email.toLowerCase().trim();
    password = password.trim();

    if (!name || !email || !password) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    // check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists"
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.json({
      message: "User registered successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Registration failed"
    });

  }

};


// ================= LOGIN =================
exports.loginUser = async (req, res) => {

  try {

    let { email, password } = req.body;

    // normalize input
    email = email.toLowerCase().trim();
    password = password.trim();

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password required"
      });
    }

    // find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        error: "Invalid credentials"
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid credentials"
      });
    }

    // create token
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      userId: user._id,
      name: user.name
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Login failed"
    });

  }

};