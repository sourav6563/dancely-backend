import { Router } from "express";
import { validate, ValidationSource } from "../middlewares/validate.middleware";
import { uploadVideoSchema } from "../validators/video.validator";
import { uploadVideo } from "../controllers/video.controller";

const router = Router();

router.route("/upload-video").post(validate(uploadVideoSchema, ValidationSource.BODY), uploadVideo);

export default router;
