import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
import { Group } from "../models/group.model.js";
import asyncHandler from "express-async-handler";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const profilePicture = req.file;

    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Password is required" });
    }

    let imageUrl = null;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      const cloudResponse = await cloudinary.uploader.upload(fileUri);
      imageUrl = cloudResponse.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with the uploaded image URL
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      profilePicture: imageUrl, // Now correctly assigning the uploaded image URL
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      imageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error registering user" });
  }
};

export const storeFaceEncoding = async (req, res) => {
  try {
    const { email, faceEncoding } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!Array.isArray(faceEncoding)) {
      return res.status(400).json({ error: "faceEncoding must be an array" });
    }

    user.faceEncoding = faceEncoding;
    await user.save();

    res.json({ success: true, message: "Face encoding stored successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error storing face encoding" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        message: "Empty fields!!!",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "User not exists.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const populatedGroups = await Promise.all(
      user.groups.map(async (groupId) => {
        const group = await Group.findById(groupId);

        if (group && group.author && group.author.equals(user._id)) {
          return group;
        }

        return null;
      })
    );

    const validGroups = populatedGroups.filter((group) => group !== null);

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      group: validGroups,
    };

    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      sameSite: "Strict",
      expires: new Date(0),
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Fetch related groups manually
    const groups = await Group.find({ _id: { $in: user.groups } }).sort({
      createdAt: -1,
    });
    const createdGroups = await Group.find({
      _id: { $in: user.createdGroups },
    }).sort({ createdAt: -1 });

    console.log("User Data:", user);
    console.log("Groups:", groups);
    console.log("Created Groups:", createdGroups);

    return res.status(200).json({
      success: true,
      user: { ...user.toObject(), groups, createdGroups },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const userData = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Fetch related groups manually
    const groups = await Group.find({ _id: { $in: user.groups } }).sort({
      createdAt: -1,
    });
    const createdGroups = await Group.find({
      _id: { $in: user.createdGroups },
    }).sort({ createdAt: -1 });

    console.log("User Data:", user);
    console.log("Groups:", groups);
    console.log("Created Groups:", createdGroups);

    return res.status(200).json({
      success: true,
      user: { ...user.toObject(), groups, createdGroups },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { username } = req.body;
    const profilePicture = req.file;

    let cloudResponse;
    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    if (username) user.username = username;
    if (cloudResponse) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully.",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password changed successfully." });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error." });
  }
};

export const deleteAccount = async (req, res) => {
  const { userId } = req.params;
  // const userId = req.id;
  console.log("Received userId:", userId);

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const groups = await Group.find({ user: userId });
    if (groups.length > 0) {
      await Group.deleteMany({ user: userId });
    }

    await User.findByIdAndDelete(userId);

    res.cookie("token", "", {
      httpOnly: true,
      sameSite: "Strict",
      expires: new Date(0),
    });

    return res
      .status(200)
      .json({ message: "Account and associated data deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

export const getUserGroups = asyncHandler(async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user ID provided" });
    }

    // ✅ Populate createdGroups with actual group details
    const user = await User.findById(userId)
      .populate("createdGroups") // Populate with group details
      .select("createdGroups");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ createdGroups: user.createdGroups });
  } catch (error) {
    console.error("Error fetching user groups:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export const getFullUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("groups"); // Populates groups field
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error", error });
  }
};