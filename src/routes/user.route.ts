import { Router } from "express";
import {
  forgotPassword,
  getCurrentUser,
  getUserProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  resetPassword,
  signUpUser,
  updateEmail,
  updateName,
  updatePassword,
  updateProfileImage,
  verifyAccount,
} from "../controllers/user.controller";
import { validate, ValidationSource } from "../middlewares/validate.middleware";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signUpSchema,
  updateEmailSchema,
  updateNameSchema,
  updatePasswordSchema,
  userProfileSchema,
  verifyAccountSchema,
} from "../schemas/user.schema";
import { verifyToken } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
const router = Router();

router.route("/signup").post(validate(signUpSchema, ValidationSource.BODY), signUpUser);
router
  .route("verify-account")
  .post(validate(verifyAccountSchema, ValidationSource.BODY), verifyAccount);
router.route("/login").post(validate(loginSchema, ValidationSource.BODY), loginUser);

router.route("/refresh-token").post(refreshAccessToken);
router.route("/logout").get(verifyToken, logoutUser);
router.route("/current-user").get(verifyToken, getCurrentUser);
router
  .route("/update-name")
  .post(validate(updateNameSchema, ValidationSource.BODY), verifyToken, updateName);

router
  .route("/update-email")
  .post(validate(updateEmailSchema, ValidationSource.BODY), verifyToken, updateEmail);

router
  .route("/update-profileimage")
  .post(upload.single("profileImage"), verifyToken, updateProfileImage);

router
  .route("/update-password")
  .post(validate(updatePasswordSchema, ValidationSource.BODY), verifyToken, updatePassword);

router
  .route("/forgot-password")
  .post(validate(forgotPasswordSchema, ValidationSource.BODY), verifyToken, forgotPassword);

router
  .route("/reset-password")
  .post(validate(resetPasswordSchema, ValidationSource.BODY), verifyToken, resetPassword);

router
  .route("/user-profile")
  .post(validate(userProfileSchema, ValidationSource.PARAM), verifyToken, getUserProfile);

router.route("/watchhistory").post(verifyToken, getWatchHistory);

export default router;
