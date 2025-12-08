// import express from "express";
// import { createServer } from "node:http";

// import { Server } from "socket.io";

// import mongoose from "mongoose";
// import { connectToSocket } from "./controllers/socketManager.js";

// import cors from "cors";
// import userRoutes from "./routes/users.routes.js";

// const app = express();
// const server = createServer(app);
// const io = connectToSocket(server);


// app.set("port", (process.env.PORT || 8000))
// app.use(cors());
// app.use(express.json({ limit: "40kb" }));
// app.use(express.urlencoded({ limit: "40kb", extended: true }));

// app.use("/api/v1/users", userRoutes);

// const start = async () => {
//     app.set("mongo_user")
//     const connectionDb = await mongoose.connect("mongodb+srv://imdigitalashish:imdigitalashish@cluster0.cujabk4.mongodb.net/")

//     console.log(`MONGO Connected DB HOst: ${connectionDb.connection.host}`)
//     server.listen(app.get("port"), () => {
//         console.log("LISTENIN ON PORT 8000")
//     });



// }



// start();

// app.js
import "dotenv/config";                  // loads .env into process.env
import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

// your project route + socket manager imports
import userRoutes from "./routes/users.routes.js";
import { connectToSocket } from "./controllers/socketManager.js";

const app = express();
const server = createServer(app);

// --- CONFIG (from environment with safe defaults) ---
const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/mydb";
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "https://zoom-main-zeta.vercel.app"; // change to your frontend origin
const NODE_ENV = process.env.NODE_ENV || "development";

// --- middlewares ---
app.use(helmet());               // security headers
if (NODE_ENV === "development") {
  app.use(morgan("dev"));        // request logging in dev
} else {
  app.use(morgan("combined"));
}

// Rate limiter (basic)
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120,            // limit each IP to 120 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS configuration - allow only specific origin (recommended)
const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    // allow exact match to CLIENT_ORIGIN
    if (origin === CLIENT_ORIGIN) return callback(null, true);
    // deny others
    return callback(new Error("CORS policy: This origin is not allowed"), false);
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true, // if you need cookies/auth
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
// explicitly respond to preflight for all routes
app.options("*", cors(corsOptions));

// Body parsers (set size limits as needed)
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// --- mount routes (BEFORE other middleware that might intercept) ---
app.use("/api/v1/users", userRoutes);

// Example health-check route
app.get("/health", (req, res) => res.status(200).json({ ok: true, ts: Date.now() }));

// --- 404 handler ---
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

// --- central error handler ---
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err?.message ?? err);
  const status = err.status || 500;
  // If CORS error thrown by our origin-checker, send 403
  if (err.message && err.message.startsWith("CORS policy")) {
    return res.status(403).json({ error: "CORS error: origin not allowed" });
  }
  res.status(status).json({ error: err.message || "Internal Server Error" });
});

// --- Socket setup (calls your connectToSocket and returns a configured io) ---
const io = connectToSocket(server); // ensure connectToSocket returns Server instance or wraps it

// --- MongoDB connection and server start ---
const start = async () => {
  try {
    // IMPORTANT: keep credentials out of source; use env vars
    console.log("Connecting to MongoDB...");
    const connection = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB connected: ${connection.connection.host}`);

    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT} (env: ${NODE_ENV})`);
    });
  } catch (err) {
    console.error("Failed starting server:", err);
    process.exit(1);
  }
};

start();

// --- graceful shutdown ---
const shutdown = async (signal) => {
  try {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log("HTTP server closed.");
    });
    await mongoose.disconnect();
    console.log("MongoDB disconnected.");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// export for testing if needed
export { app, server, io };
