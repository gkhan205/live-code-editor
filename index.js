import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);

  // Join a specific room
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("editorChange", ({ roomId, content }) => {
    // Broadcast changes to everyone else in the room
    console.log(`User ${socket.id} updated the editor in room ${roomId}`);
    socket.to(roomId).emit("updateEditor", content);
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

server.listen(4200, () => console.log("Server Started"));
