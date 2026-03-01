import express from "express";
import cors from "cors";
import eventRoutes from "./routes/eventRouts.js";
import attendeeRoutes from "./routes/attendeeRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", eventRoutes);
app.use("/api", attendeeRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is healthy and running!",
    date: new Date().toISOString(),
  });
});

// Start the server
export default app;
