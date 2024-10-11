const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./authRouter");
const chatRouter = require("./chatRouter");
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const cors = require("cors");

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

io.on("connection", async (socket) => {
  console.log("a user connected");
  socket.on("join", ({ roomID }) => {
    socket.join(roomID);
    socket.emit("message", {
      data: { user: "xz" },
    });
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.use(cors(corsOptions));
app.use(express.json());
app.use("/auth", authRouter);
app.use("/chat", chatRouter);

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://dankryto1821:FcegaNeOr9Fx3moo@cluster0.hj76nqc.mongodb.net/?retryWrites=true&w=majority"
    );
    server.listen(PORT, () => console.log(`server started on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
