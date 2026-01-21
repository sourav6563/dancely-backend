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
  getMyVideos,
  getVideoById,
  togglePublishStatus,
  updateVideoDetails,
  updateVideoThumbnail,
  uploadVideo,
} from "../controllers/video.controller";
import { upload } from "../middlewares/multer.middleware";
import { authenticate } from "../middlewares/authenticate.middleware";

const router = Router();
router.use(authenticate);
router.route("/me").get(getMyVideos);
router
  .route("/")
  .get(validate(videoQuerySchema, ValidationSource.QUERY), getAllVideos)
  .post(
    upload.fields([
      { name: "video", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
    ]),
    validate(uploadVideoSchema, ValidationSource.BODY),
    uploadVideo,
  );
//fetch video/update/delete by Id
router
  .route("/:videoId")
  .get(getVideoById)
  .patch(validate(videoUpdateDetailsSchema, ValidationSource.BODY), updateVideoDetails)
  .delete(deleteVideo);

router.route("/thumbnail/:videoId").patch(upload.single("thumbnail"), updateVideoThumbnail);

//toggle video status
router.route("/publish-status/:videoId").patch(togglePublishStatus);

export default router;
