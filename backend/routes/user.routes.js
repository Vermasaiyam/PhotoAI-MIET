import express from "express";
import {
    changePassword,
    deleteAccount,
    editProfile,
    getFullUser,
    getProfile,
    getUserGroups,
    login,
    logout,
    register,
    storeFaceEncoding,
    userData,
} from "../controllers/user.controller.js";
import Authenticated from "../middlewares/Authenticated.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(upload.single("photo"), register);
router.route("/store-face-encoding").post(storeFaceEncoding);
router.route("/login").post(login);
router.route("/:id/profile").get(Authenticated, getProfile);
router
    .route("/profile/edit")
    .post(Authenticated, upload.single("profilePicture"), editProfile);
router.route("/change-password").post(Authenticated, changePassword);
router.route("/logout").get(logout);
router.route("/userData/:id").get(userData);
router.route("/groups").get(getUserGroups);
router.route("/delete/:userId").delete(deleteAccount);
router.route("/:userId").get(getFullUser);

export default router;