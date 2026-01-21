import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import {
  getLikedVideos,
  toggleCommentLike,
  toggleCommunityPostLike,
  toggleVideoLike,
} from "../controllers/like.controller";

const router = Router();

router.route("/toggle-video-like/:videoId").post(authenticate, toggleVideoLike);
router.route("/toggle-comment-like/:commentId").post(authenticate, toggleCommentLike);
router.route("/toggle-community-post-like/:postId").post(authenticate, toggleCommunityPostLike);
router.route("/liked-videos").get(authenticate, getLikedVideos);

export default router;
