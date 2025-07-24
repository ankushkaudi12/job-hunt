import mongoose from "mongoose";

export const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
  profilePicture: {
    data: String, // base64 string
    contentType: String,
  },
});

export const Admin = mongoose.model("Admin", adminSchema);
