import express from "express";
import cors from "cors";
import AuthRouters from "./api/routes/auth.router.js";
import MessageRouters from "./api/routes/message.router.js";

const app = express();

app.use(cors({ origin: process.env.PUBLIC_FRONTEND_URL, credentials: true }))
app.use(express.json());

// Allow client get file from server
app.use("/uploads/files", express.static("uploads/files"));
app.use("/uploads/recordings", express.static("uploads/recordings"));
app.use("/uploads/images", express.static("uploads/images"));
app.use("/uploads/avatars", express.static("uploads/avatars"));

app.use("/api/auth", AuthRouters);
app.use("/api/messages", MessageRouters);

export default app;