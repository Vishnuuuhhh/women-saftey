require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const os = require("os");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const sosRoutes = require("./routes/sosRoutes");

const app = express();

// ✅ Use environment port (important for deployment)
const PORT = process.env.PORT || 5000;


// ================= GET LOCAL NETWORK IP =================

function getLocalIP() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === "IPv4" && !net.internal) {
        return net.address;
      }
    }
  }

  return "localhost";
}

const LOCAL_IP = getLocalIP();


// ================= SECURITY =================

// ✅ Basic rate limiter (prevents spam & SMS abuse)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per window
});

app.use(limiter);

// ✅ Restrict CORS (change FRONTEND_URL in .env)
app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());


// ================= DATABASE =================

// ✅ Use Mongo URI from .env (safe method)
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("MongoDB connected successfully");
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});


// ================= TEST ROUTE =================

app.get("/", (req, res) => {
  res.send("Backend server running");
});


// ================= ROUTES =================

app.use("/api", authRoutes);
app.use("/api", contactRoutes);
app.use("/api", sosRoutes);


// ================= START SERVER =================

app.listen(PORT, "0.0.0.0", () => {
  console.log("\nServer running:");
  console.log(`Local:   http://localhost:${PORT}`);
  console.log(`Network: http://${LOCAL_IP}:${PORT}\n`);
});