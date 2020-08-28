require("dotenv").config(); // Setup Environment Variables in ".env" file
import express, { Express, Request, Response } from "express";
import mongoSanitize from "express-mongo-sanitize";
import { errorHandler } from "./middleware/error";
import { connectDB } from "./api/utils/db";
import rateLimit from "express-rate-limit";
import submissions from "./routes/submissions";
import { Server } from "http";
import morgan from "morgan";
import helmet from "helmet";
import xss from "xss-clean";
import cors from "cors";
import path from "path";
import hpp from "hpp";

// MongoDB
connectDB(process.env.MONGO_URI || "");

// Setup Express
const app: Express = express();
const port: String | Number = process.env.PORT || 4000;
const server: Server = app.listen(port, () => {
  console.log(`Express is listening on port ${port}`);
});

// Body Parser
app.use(express.json());

// Query Sanitizer
app.use(mongoSanitize());

// Set Security Headers
app.use(helmet());

// Mitigate cross-site scripting attacks
app.use(xss());

// Mitigate HTTP Parameter pollution
app.use(hpp());

// Enable CORS ( Cross-Origin Resource Sharing )
app.use(cors());

// Logging Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate limiting
const submissionLimiter = rateLimit({
  windowMs: 1000 * 60 * 1, // 1 minute
  max: 2,
  handler: function (req, res) {
    res.status(429).json({
      success: false,
      error: "Too many submissions, try again later."
    });
  }
});

// Routes
app.use("/api/v1/submissions", submissionLimiter, submissions);
app.use(errorHandler);

// "Home" request
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to the sjoseph7.dev submission service.");
});

// Page-view
app.post("/api/v1/page-views", (req: Request, res: Response) => {
  console.info(`PAGE VIEWED!! ${req.ip}`);
  res.status(200).json({ success: true });
});

// All other requests
app.all("*", (req: Request, res: Response) => {
  console.debug(req.url);
  res.status(404).send({ success: false });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: any, promise) => {
  console.error(`Error: ${err && err.message}`);
  server.close(() => process.exit(1));
});
