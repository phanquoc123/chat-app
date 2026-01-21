import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, lowercase: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true  },
  password: { type: String, required: true },
  displayName: { type: String, required: true, trim: true },
  avatarUrl: { type: String},
  avatarId: { type: String },
  bio: { type: String, maxlenghth: 500 },
  phoneNumber: { type: String, parse : true }, 
}, { timestamps: true });

export default mongoose.model("User", userSchema);