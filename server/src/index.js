require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error.middleware");
const { startCronJobs } = require("./utils/cronJobs");

// Route imports
const authRoutes = require("./routes/auth.routes");
const itemRoutes = require("./routes/item.routes");
const categoryRoutes = require("./routes/category.routes");
const familyRoutes = require("./routes/family.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const uploadRoutes = require("./routes/upload.routes");
const notificationRoutes = require("./routes/notification.routes");
const emergencyRoutes = require("./routes/emergency.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/family", familyRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/emergency-card", emergencyRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Start server
const start = async () => {
  await connectDB();
  startCronJobs();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start();
