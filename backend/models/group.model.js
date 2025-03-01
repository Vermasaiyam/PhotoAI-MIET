import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    groupName: { type: String, required: true, unique: true },
    groupUrl: { type: String, required: true, unique: true },
    photos: [{ type: String, required: true }],
}, { timestamps: true });

export const Group = mongoose.model('Group', groupSchema);