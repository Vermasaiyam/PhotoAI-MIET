import express from "express";
import { changePassword, deleteAccount, editProfile, getProfile, login, logout, register, userData } from "../controllers/user.controller.js";
import Authenticated from "../midllewares/Authenticated.js";
import upload from "../midllewares/multer.js";

const router = express.Router();

router.route('/register').post(register, upload.single("photo"));
router.route('/login').post(login);
router.route('/:id/profile').get(Authenticated, getProfile);
router.route('/profile/edit').post(Authenticated, upload.single('profilePicture'), editProfile);
router.route('/change-password').post(Authenticated, changePassword);
router.route('/logout').get(logout);
router.route('/userData/:id').get(userData);
router.route('/delete/:userId').delete(deleteAccount);

export default router;