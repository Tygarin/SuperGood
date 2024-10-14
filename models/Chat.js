const { Schema, model } = require("mongoose");

const Chat = new Schema(
  {
    members: { type: Array },
    name: { type: String, required: true },
    createdByUserIdentify: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = model("Chat", Chat);
