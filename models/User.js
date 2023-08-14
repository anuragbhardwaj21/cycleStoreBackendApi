const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  wishlist: [{ type: Number, ref: "Product" }],
  cart: [{ type: Number, ref: "Product" }],
  addline1: { type: String },
  addline2: { type: String },
  city: { type: String },
  pinCode: { type: String },
  state: { type: String },
  dob: { type: Date },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  phoneNumber: { type: String },
});

module.exports = mongoose.model("User", userSchema);
