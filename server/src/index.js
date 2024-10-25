import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import SocketServices from "./api/services/socket.service.js";

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {});

const io = new Server(server, {
    cors: {
        origin: process.env.PUBLIC_FRONTEND_URL,
    },
});

global.onlineUsers = new Map();
global._io = io;
global.__dirname= process.cwd();

global._io.on("connection", SocketServices.connection);