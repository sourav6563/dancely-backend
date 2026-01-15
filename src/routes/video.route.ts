import { Router } from "express";
import { validate, ValidationSource } from "../middlewares/validate.middleware";
import {
  uploadVideoSchema,
  videoQuerySchema,
  videoUpdateDetailsSchema,
} from "../validators/video.validator";
import {
  deleteVideo,
  getAllVideos,
  getUserVideos,
  getVideoById,
  togglePublishStatus,
  updateVideoDetails,
  uploadVideo,
} from "../controllers/video.controller";
import { upload } from "../middlewares/multer.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";

const router = Router();

router
  .route("/")
  .get(authenticate, validate(videoQuerySchema, ValidationSource.QUERY), getAllVideos);

router.route("/id/:videoId").get(authenticate, getVideoById);

router.route("/upload-video").post(
  authenticate,
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  validate(uploadVideoSchema, ValidationSource.BODY),
  uploadVideo,
);

router
  .route("/update/:videoId")
  .patch(
    authenticate,
    validate(videoUpdateDetailsSchema, ValidationSource.BODY),
    updateVideoDetails,
  );
router.route("/user-videos").get(authenticate, getUserVideos);
router.route("/toggle-status/:videoId").get(authenticate, togglePublishStatus);
router.route("/delete/:videoId").delete(authenticate, deleteVideo);

export default router;
