import express from "express";
import upload from "../middlewares/multer.js";
import {
    createGroup,
    getGroup,
    getGroupDetails,
    joinGroup,
    uploadImages,
} from "../controllers/group.controller.js";

const router = express.Router();

router.route("/upload-images").post(upload.array("images"), uploadImages);
router.route("/create-group").post(createGroup);
router.route("/:id").get(getGroup);
router.get("/:groupId", getGroupDetails);
router.post("/join-group", joinGroup);

export default router;
