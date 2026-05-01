

// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const rateLimit = require("express-rate-limit");

// dotenv.config();

// /* ---------------- ROUTES ---------------- */
// const authRoutes = require("./routes/authRoutes");
// const orderRoutes = require("./routes/orderRoutes");
// const foodRoutes = require("./routes/foodRoutes");

// /* ---------------- MIDDLEWARE ---------------- */
// const errorMiddleware = require("./middleware/errorMiddleware");

// /* ---------------- APP ---------------- */
// const app = express();

// /* ---------------- RATE LIMIT ---------------- */
// const limiter = rateLimit({
//   windowMs: 60 * 60 * 1000,
//   max: 10000,
//   message: "Too many requests, try again later.",
// });

// /* ---------------- GLOBAL MIDDLEWARE ---------------- */
// app.use(helmet());
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan("dev"));
// app.use(limiter);

// /* ---------------- ROUTES ---------------- */
// app.use("/auth", authRoutes);
// app.use("/orders", orderRoutes);
// app.use("/foods", foodRoutes);

// /* ---------------- HEALTH CHECK ---------------- */
// app.get("/health", (req, res) => {
//   res.json({
//     status: "OK",
//     dbState: mongoose.connection.readyState,
//     time: new Date().toISOString(),
//   });
// });

// /* ---------------- ROOT ---------------- */
// app.get("/", (req, res) => {
//   res.json({
//     message: "Restaurant API is running",
//     version: "1.0.0",
//   });
// });

// /* ---------------- 404 ---------------- */
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Route not found: ${req.originalUrl}`,
//   });
// });

// /* ---------------- ERROR HANDLER ---------------- */
// app.use(errorMiddleware);

// /* ---------------- DB CONNECTION ---------------- */
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);

//     console.log("✅ MongoDB connected");
//   } catch (error) {
//     console.error("❌ DB connection failed:", error.message);

//     setTimeout(connectDB, 5000); // retry
//   }
// };

// /* ---------------- SERVER START ---------------- */
// const PORT = process.env.PORT || 5000;

// const startServer = async () => {
//   await connectDB();

//   const server = app.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
//   });

//   /* ---------------- GRACEFUL SHUTDOWN ---------------- */
//   const shutdown = async (signal) => {
//     console.log(`⚠️ ${signal} received`);

//     server.close(async () => {
//       await mongoose.connection.close();
//       console.log("🔌 MongoDB disconnected");
//       process.exit(0);
//     });
//   };

//   process.on("SIGINT", shutdown);
//   process.on("SIGTERM", shutdown);
// };

// startServer();













const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

dotenv.config();

/* ---------------- ROUTES ---------------- */
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const foodRoutes = require("./routes/foodRoutes");

/* ---------------- MIDDLEWARE ---------------- */
const errorMiddleware = require("./middleware/errorMiddleware");

/* ---------------- APP ---------------- */
const app = express();

/* ---------------- GLOBAL MIDDLEWARE ---------------- */
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/* ---------------- ROUTES ---------------- */
app.use("/auth", authRoutes);
app.use("/orders", orderRoutes);
app.use("/foods", foodRoutes);

/* ---------------- HEALTH CHECK ---------------- */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    dbState: mongoose.connection.readyState,
    time: new Date().toISOString(),
  });
});

/* ---------------- ROOT ---------------- */
app.get("/", (req, res) => {
  res.json({
    message: "Restaurant API is running",
    version: "1.0.0",
  });
});

/* ---------------- 404 ---------------- */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
});

/* ---------------- ERROR HANDLER ---------------- */
app.use(errorMiddleware);

/* ---------------- DB CONNECTION ---------------- */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ DB connection failed:", error.message);
    setTimeout(connectDB, 5000); // retry
  }
};

/* ---------------- SERVER START ---------------- */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

  /* ---------------- GRACEFUL SHUTDOWN ---------------- */
  const shutdown = async (signal) => {
    console.log(`⚠️ ${signal} received`);

    server.close(async () => {
      await mongoose.connection.close();
      console.log("🔌 MongoDB disconnected");
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

startServer();