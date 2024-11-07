const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: [true, "username k được để trống"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      require: [true, "email k được để trống"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      require: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default:"user"
    },
  },
  {timestamps: true}

);

module.exports = mongoose.model("User", UserSchema)
