// backend/controllers/profile.controller.js
import { Profile } from "../models/profile.model.js";
import cloudinary from '../utils/cloudinary.js';

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

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, contactNo, address } = req.body;
    
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Handle profile image upload
    if (req.file) {
      // Delete old image if exists
      if (profile.profileImage?.cloudinary_id) {
        await cloudinary.uploader.destroy(profile.profileImage.cloudinary_id);
      }

      // Upload new image
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });

      profile.profileImage = {
        url: result.secure_url,
        cloudinary_id: result.public_id
      };
    }

    // Update other fields
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

export const createProfile = async (req, res) => {
  try {
    const { firstName, lastName, contactNo, address } = req.body;
    
    let profileImage = null;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });

      profileImage = {
        url: result.secure_url,
        cloudinary_id: result.public_id
      };
    }

    const profile = new Profile({
      user: req.user._id,
      firstName,
      lastName,
      contactNo,
      address,
      profileImage
    });

    await profile.save();
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};