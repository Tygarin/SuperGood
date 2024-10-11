const { Schema, model } = require("mongoose");

const User = new Schema({
  name: { type: String, required: true },
  userIdentify: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  roles: [{ type: String, ref: "Role" }],
});

module.exports = model("User", User);
