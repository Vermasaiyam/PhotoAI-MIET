import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
// import faceapi from "face-api.js";
// import path from "path";
// import { Canvas, Image } from "canvas";
// import upload from "../middlewares/multer.js";

// const MODEL_PATH = path.resolve("face_models"); // Ensure this path exists

// ✅ Load Face Detection Models
// await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_PATH);
// await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_PATH);
// await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_PATH);

// export const register = async (req, res) => {
//     try {
//         upload.single("photo")(req, res, async (err) => {
//             if (err) {
//                 return res.status(500).json({ message: "File upload error", success: false });
//             }

//             const { username, email, password } = req.body;
//             if (!username || !email || !password || !req.file) {
//                 return res.status(400).json({
//                     message: "All fields and a live photo are required!",
//                     success: false,
//                 });
//             }

//             // Check if user already exists
//             const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//             if (existingUser) {
//                 return res.status(400).json({
//                     message: "Email or username already in use.",
//                     success: false,
//                 });
//             }

//             // Hash password
//             const hashedPassword = await bcrypt.hash(password, 10);

//             // Convert file to Data URI and upload to Cloudinary
//             const fileUri = getDataUri(req.file);
//             const cloudUpload = await cloudinary.uploader.upload(fileUri, {
//                 folder: "profile_pictures",
//             });

//             const imageUrl = cloudUpload.secure_url; // Get uploaded image URL

//             // Load image and extract face encoding
//             const image = new Image();
//             image.src = req.file.buffer;
//             const canvas = new Canvas(image.width, image.height);
//             const ctx = canvas.getContext("2d");
//             ctx.drawImage(image, 0, 0);

//             const detections = await faceapi.detectSingleFace(canvas)
//                 .withFaceLandmarks()
//                 .withFaceDescriptor();

//             if (!detections) {
//                 return res.status(400).json({
//                     message: "No face detected in the image. Please try again.",
//                     success: false,
//                 });
//             }

//             const faceEncoding = Array.from(detections.descriptor); // Convert descriptor to array

//             // Store user in MongoDB
//             const newUser = await User.create({
//                 username,
//                 email,
//                 password: hashedPassword,
//                 profilePicture: imageUrl,
//                 faceEncoding, // Store extracted face encoding
//             });

//             return res.status(201).json({
//                 message: "Account created successfully.",
//                 success: true,
//                 user: newUser,
//             });
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message: "An error occurred while creating the account.",
//             success: false,
//         });
//     }
// };


export const register = async (req, res) => {
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

        const token = await jwt.sign(
            { userId: user._id },
            process.env.SECRET_KEY,
            { expiresIn: '1d' }
        );

        const populatedVideos = await Promise.all(
            user.videos.map(async (videoId) => {
                const video = await Video.findById(videoId);

                if (video && video.author && video.author.equals(user._id)) {
                    return video;
                }

                return null;
            })
        );

        const validVideos = populatedVideos.filter(video => video !== null);

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            videos: validVideos,
        };

        return res
            .cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 })
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
            sameSite: 'Strict',
            expires: new Date(0)
        });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Logout failed",
            error: error.message
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).populate({ path: 'videos', createdAt: -1 });
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
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

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        };

        if (username) user.username = username;
        if (cloudResponse) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'Profile updated successfully.',
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

export const userData = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId)
            .populate({
                path: 'videos',
                options: { sort: { createdAt: -1 } },
                populate: {
                    path: 'questions',
                    select: 'question options correctAns',
                }
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            user,
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const changePassword = async (req, res) => {
    try {
        const userId = req.id;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Current password is incorrect." });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        return res.status(200).json({ success: true, message: "Password changed successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
}

export const deleteAccount = async (req, res) => {
    const { userId } = req.params;
    // const userId = req.id;
    console.log("Received userId:", userId);

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const videos = await Video.find({ user: userId });
        if (videos.length > 0) {
            await Question.deleteMany({ videoId: { $in: videos.map(video => video._id) } });

            await Video.deleteMany({ user: userId });
        }

        await User.findByIdAndDelete(userId);

        res.cookie("token", "", {
            httpOnly: true,
            sameSite: 'Strict',
            expires: new Date(0)
        });

        return res.status(200).json({ message: 'Account and associated data deleted successfully.' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error. Please try again.' });
    }
}