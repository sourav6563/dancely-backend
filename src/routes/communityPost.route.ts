import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { validate, ValidationSource } from "../middlewares/validate.middleware";
import { communityPostSchema } from "../validators/userCommunitypost.validator";
import {
  createCommunityPost,
  deleteCommunityPost,
  getUserCommunityPosts,
  updateCommunityPost,
} from "../controllers/communityPost.controller";
const router = Router();

router.use(authenticate);

router.route("/").post(validate(communityPostSchema, ValidationSource.BODY), createCommunityPost);

router.route("/user/:userId").get(getUserCommunityPosts);

router
  .route("/:postId")
  .patch(validate(communityPostSchema, ValidationSource.BODY), updateCommunityPost)
  .delete(deleteCommunityPost);

export default router;
