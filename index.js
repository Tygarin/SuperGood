const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./authRouter");
const cors = require("cors");

const PORT = process.env.PORT || 5000;

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/auth", authRouter);

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://dankryto1821:FcegaNeOr9Fx3moo@cluster0.hj76nqc.mongodb.net/?retryWrites=true&w=majority"
    );
    app.listen(PORT, () => console.log(`server started on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
