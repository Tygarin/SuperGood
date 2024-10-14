const { Schema, model } = require("mongoose");

const Message = new Schema(
  {
    chatID: { type: String, required: true },
    senderID: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = model("Message", Message);
