import dotenv from "dotenv";
import express, { json, urlencoded } from "express";
import mongoose from "mongoose";
import { limiter } from "./config/rate-limiter.js";
import { redisA, redisB } from "./config/redis.js";
import { compressionMiddleware } from "./middleware/compressionMiddleware.js";
import { corsMiddleware } from "./middleware/corsMiddleware.js";
import {
  bodySizeLimit,
  timeoutMiddleware,
} from "./middleware/requestMiddleware.js";
import {
  sanitizeNoSQL,
  sanitizeXSS,
} from "./middleware/sanitizationMiddleware.js";
import { securityMiddleware } from "./middleware/securityMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import { globalErrorHandler } from "./utils/errorHandler.js";
import { morganMiddleware } from "./utils/logger.js";
dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

// Security middleware (should be first)
app.use(securityMiddleware);
app.use(timeoutMiddleware(30000)); // 30 second timeout
app.use(compressionMiddleware);

// Body parsing with size limits
app.use(json(bodySizeLimit.json));
app.use(urlencoded(bodySizeLimit.urlencoded));

// Sanitization middleware
app.use(sanitizeNoSQL);
app.use(sanitizeXSS);

// CORS and rate limiting
app.use(corsMiddleware);
app.use(morganMiddleware);
app.use(limiter);

// Health check endpoint (should be before other routes)
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// 404 handler for unmatched routes
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(globalErrorHandler);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  mongoose
    .connect(process.env.MONGO_URI, {
      maxPoolSize: 10000,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB", err);
    });
  await Promise.all([redisA.connect(), redisB.connect()]);
});
