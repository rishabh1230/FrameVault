import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import "./middlewares/GoogleAuth.middleware.js"; // Ensure Google strategy is configured
import userRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js";
import filmRoutes from "./routes/film.routes.js";
import cartRoutes from "./routes/cart.routes.js";

dotenv.config(); // Load .env variables at start

const app = express();

const allowedOrigins = ['http://localhost:5173'];

// Verify secret loaded (optional, remove in production)
console.log('Session secret loaded:', process.env.SESSION_SECRET);

// CORS middleware - must come first to handle pre-flight requests
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}));

// Body parsers and static files
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Session setup - must be before passport
app.set('trust proxy', 1); // needed if behind proxy like Heroku or Render
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  proxy: true,
  cookie: {
    secure: true,       // false if running on HTTP locally
    sameSite: 'none',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// Passport initialization after session
app.use(passport.initialize());
app.use(passport.session());

// API routes
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/films", filmRoutes);
app.use("/api/cart", cartRoutes);

// 404 handler for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({
    error: "NotFound",
    message: "Route not found",
    code: 404,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.name || "InternalServerError",
    message: err.message || "Something went wrong",
    code: status,
  });
});

export { app };
