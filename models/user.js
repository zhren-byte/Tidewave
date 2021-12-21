const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  userID: String,
  userName: String,
  warns: { type: Number, default: 0, min: 0 },
});

module.exports = mongoose.model("User", userSchema, "user");
