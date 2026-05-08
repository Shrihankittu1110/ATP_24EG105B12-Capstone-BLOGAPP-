import exp from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import { userApp } from "./APIs/UserApi.js";
import { authorApp } from "./APIs/AuthorApi.js";
import { adminApp } from "./APIs/AdminApi.js";
import { commonApp } from "./APIs/CommonApi.js";
import cookieParser from "cookie-parser";
import cors from "cors";

config();

const app = exp();
const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];
const envAllowedOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envAllowedOrigins].filter(Boolean))];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(exp.json());

app.use("/user-api", userApp);
app.use("/author-api", authorApp);
app.use("/admin-api", adminApp);
app.use("/auth", commonApp);

let connectionPromise;

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.DB_URL)
      .then((mongooseConnection) => {
        console.log("DB server connected");
        return mongooseConnection;
      })
      .catch((error) => {
        connectionPromise = undefined;
        throw error;
      });
  }

  return connectionPromise;
};

app.use((req, res, next) => {
  res.status(404).json({ message: `path ${req.url} is invalid` });
});

app.use((err, req, res, next) => {
  console.log("error is ", err);
  console.log("Full error:", JSON.stringify(err, null, 2));

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "error occurred", error: err.message });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ message: "error occurred", error: err.message });
  }

  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`,
    });
  }

  res.status(500).json({ message: "error occurred", error: "Server side error" });
});

const startServer = async () => {
  try {
    await connectDB();
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`server listening on ${port}..`));
  } catch (err) {
    console.log("err in db connect", err);
  }
};

startServer();

export { app };