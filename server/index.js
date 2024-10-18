const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./authRouter");
const chatRouter = require("./chatRouter");
const messageRouter = require("./routers/messageRouter");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

const PORT = process.env.PORT || 5000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

let onlineUsers = [];

io.on("connection", async (socket) => {
  console.log("a user connected");

  socket.on("addNewUser", (userID) => {
    if (!onlineUsers.some((user) => user.userID === userID)) {
      onlineUsers.push({ userID, socketID: socket.id });
    }
    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("sendMessage", (message, members) => {
    const onlineUsersMap = new Map(
      onlineUsers.map((user) => [user.userID, user])
    );
    for (const member of members) {
      const onlineUserSocket = onlineUsersMap.get(member)?.socketID;
      if (onlineUserSocket) io.to(onlineUserSocket).emit("getMessage", message);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    onlineUsers = onlineUsers.filter((user) => user.socketID !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

app.use(cors(corsOptions));
app.use(express.json());
app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/messages", messageRouter);

const start = async () => {
  try {
    await mongoose.connect(process.env.db);
    server.listen(PORT, () => console.log(`server started on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
module.exports = { io };
