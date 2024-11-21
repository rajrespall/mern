import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  contactNo: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  }
}, { timestamps: true });

export const Profile = mongoose.model("Profile", ProfileSchema);