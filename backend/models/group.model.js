import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    groupName: { type: String, required: true, unique: true },
    groupUrl: { type: String, required: true, unique: true },
    photos: [{ type: String, required: true }],
}, { timestamps: true });

export const Video = mongoose.model('Video', videoSchema);