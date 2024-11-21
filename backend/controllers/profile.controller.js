// backend/controllers/profile.controller.js
import { Profile } from "../models/profile.model.js";

export const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createProfile = async (req, res) => {
  try {
    const { firstName, lastName, contactNo, address } = req.body;
    
    const existingProfile = await Profile.findOne({ user: req.user._id });
    if (existingProfile) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const profile = new Profile({
      user: req.user._id,
      firstName,
      lastName, 
      contactNo,
      address
    });

    await profile.save();
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, contactNo, address } = req.body;
    
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    profile.firstName = firstName || profile.firstName;
    profile.lastName = lastName || profile.lastName;
    profile.contactNo = contactNo || profile.contactNo;
    profile.address = address || profile.address;

    await profile.save();
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};