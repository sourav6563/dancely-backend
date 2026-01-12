import { Router } from "express";
import { validate, ValidationSource } from "../middlewares/validate.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";
import { upload } from "../middlewares/multer.middleware";
import {
  getUserProfile,
  getWatchHistory,
  updateEmail,
  updateName,
  updateProfileImage,
} from "../controllers/user.controller";
import {
  updateEmailSchema,
  updateNameSchema,
  userProfileSchema,
} from "../validators/user.validator";

const router = Router();

router
  .route("/update-name")
  .patch(validate(updateNameSchema, ValidationSource.BODY), authenticate, updateName);

router
  .route("/update-email")
  .patch(validate(updateEmailSchema, ValidationSource.BODY), authenticate, updateEmail);

router
  .route("/update-profile-image")
  .patch(upload.single("profileImage"), authenticate, updateProfileImage);

router
  .route("/user-profile/:username")
  .get(validate(userProfileSchema, ValidationSource.PARAM), authenticate, getUserProfile);

router.route("/watch-history").get(authenticate, getWatchHistory);

export default router;
