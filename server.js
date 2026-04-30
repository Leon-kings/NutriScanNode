// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const rateLimit = require("express-rate-limit");

// // Load environment variables
// dotenv.config();

// // Import routes
// const authRoutes = require("./routes/authRoutes");
// const errorMiddleware = require("./middleware/errorMiddleware");
// const orderRoutes = require('./routes/orderRoutes');
// const foodRoutes = require("./routes/foodRoutes");
// const cleanOrderIndexes = require("./utils/cleanIndexes");


// // Initialize express app
// const app = express();

// // Connect to MongoDB
// // mongoose
// //   .connect(process.env.MONGODB_URI)
// //   .then(() => console.log("✅ MongoDB connected successfully"))
// //   .catch((err) => {
// //     console.error("❌ MongoDB connection error:", err);
// //     process.exit(1);
// //   });

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       autoIndex: false, // 🔥 prevent unwanted indexes
//       serverSelectionTimeoutMS: 5000, // fail fast if DB unreachable
//       socketTimeoutMS: 45000,
//     });

//     console.log("✅ MongoDB connected successfully");

//     /* ---------------- CLEAN BAD INDEXES ---------------- */
//     await cleanOrderIndexes();

//     console.log("🧹 Index check complete");

//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err.message);

//     // 🔁 retry instead of exit (more resilient)
//     setTimeout(connectDB, 5000);
//   }
// };

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 75 * 60 * 1000, // 75 minutes
//   max: 100, // limit each IP to 100 requests per windowMs
//   message: "Too many requests from this IP, please try again later.",
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// // Middleware
// app.use(helmet()); // Security headers
// app.use(cors()); // Enable CORS
// app.use(express.json()); // Parse JSON bodies
// app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
// app.use(morgan("dev")); // Logging
// app.use("/api", limiter); // Apply rate limiting to API routes

// // Routes
// app.use("/auth", authRoutes);
// app.use('/orders', orderRoutes);
// app.use("/foods", foodRoutes);

// // Health check endpoint
// app.get("/health", (req, res) => {
//   res.status(200).json({
//     status: "OK",
//     message: "Server is running",
//     timestamp: new Date().toISOString(),
//   });
// });

// // Root endpoint
// app.get("/", (req, res) => {
//   res.json({
//     message: "Restaurant Authentication API",
//     version: "1.0.0",
//     endpoints: {
//       register: "POST /api/auth/register",
//       login: "POST /api/auth/login",
//       logout: "POST /api/auth/logout",
//       me: "GET /api/auth/me",
//     },
//   });
// });

// // Error handling middleware (should be last)
// app.use(errorMiddleware);

// // Handle 404 errors
// // ✅ Better 404 handler
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Cannot find ${req.originalUrl} on this server`,
//   });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`📍 Environment: ${process.env.NODE_ENV}`);
//   console.log(`🔗 API URL: http://localhost:${PORT}`);
// });












// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const helmet = require("helmet");
// const morgan = require("morgan");
// const rateLimit = require("express-rate-limit");

// dotenv.config();

// /* ---------------- IMPORTS ---------------- */
// const authRoutes = require("./routes/authRoutes");
// const orderRoutes = require("./routes/orderRoutes");
// const foodRoutes = require("./routes/foodRoutes");
// const errorMiddleware = require("./middleware/errorMiddleware");
// const cleanOrderIndexes = require("./utils/cleanIndexes");

// /* ---------------- APP ---------------- */
// const app = express();

// /* ---------------- DB ---------------- */
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI, {
//       autoIndex: false,
//       serverSelectionTimeoutMS: 5000,
//       socketTimeoutMS: 45000,
//     });

//     console.log("✅ MongoDB connected");

//     await cleanOrderIndexes();
//     console.log("🧹 Index cleanup complete");

//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err.message);
//     setTimeout(connectDB, 5000);
//   }
// };

// /* ---------------- DB EVENTS ---------------- */
// mongoose.connection.on("connected", () => {
//   console.log("🟢 Mongoose connected");
// });

// mongoose.connection.on("error", (err) => {
//   console.error("🔴 Mongoose error:", err.message);
// });

// mongoose.connection.on("disconnected", () => {
//   console.warn("🟡 Mongoose disconnected");
// });

// /* ---------------- SECURITY ---------------- */
// const limiter = rateLimit({
//   windowMs: 75 * 60 * 1000,
//   max: 100,
//   message: "Too many requests, try again later.",
// });

// /* ---------------- MIDDLEWARE ---------------- */
// app.use(helmet());
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan("dev"));
// app.use(limiter);

// /* ---------------- ROUTES (NO /api PREFIX) ---------------- */
// app.use("/auth", authRoutes);
// app.use("/new/order", orderRoutes);
// app.use("/foods", foodRoutes);

// /* ---------------- HEALTH ---------------- */
// app.get("/health", (req, res) => {
//   res.status(200).json({
//     status: "OK",
//     dbState: mongoose.connection.readyState,
//     timestamp: new Date().toISOString(),
//   });
// });

// /* ---------------- ROOT ---------------- */
// app.get("/", (req, res) => {
//   res.json({
//     message: "Restaurant API",
//     version: "1.0.0",
//     endpoints: {
//       auth: "/auth",
//       orders: "/new/order",
//       foods: "/foods",
//     },
//   });
// });

// /* ---------------- 404 ---------------- */
// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Cannot find ${req.originalUrl}`,
//   });
// });

// /* ---------------- ERROR ---------------- */
// app.use(errorMiddleware);

// /* ---------------- START SERVER ---------------- */
// const PORT = process.env.PORT || 5000;

// const startServer = async () => {
//   await connectDB();

//   const server = app.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
//   });

//   /* ---------------- GRACEFUL SHUTDOWN ---------------- */
//   const shutdown = async (signal) => {
//     console.log(`\n⚠️ ${signal} received`);

//     server.close(async () => {
//       await mongoose.connection.close();
//       console.log("🔌 DB closed");
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
const rateLimit = require("express-rate-limit");

dotenv.config();

/* ---------------- ROUTES ---------------- */
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const foodRoutes = require("./routes/foodRoutes");

/* ---------------- MIDDLEWARE ---------------- */
const errorMiddleware = require("./middleware/errorMiddleware");

/* ---------------- APP ---------------- */
const app = express();

/* ---------------- RATE LIMIT ---------------- */
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message: "Too many requests, try again later.",
});

/* ---------------- GLOBAL MIDDLEWARE ---------------- */
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(limiter);

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