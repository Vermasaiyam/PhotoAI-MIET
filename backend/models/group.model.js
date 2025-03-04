import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
    {
        groupName: { type: String, required: true, unique: true },
        groupUrl: { type: String, unique: true },
        photos: [
            {
                url: { type: String, required: true },
                encoding: { type: [Number], required: true },
            },
        ],
    },
    { timestamps: true }
);

export const Group = mongoose.model("Group", groupSchema);