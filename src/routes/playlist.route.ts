import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { validate, ValidationSource } from "../middlewares/validate.middleware";
import { PlaylistSchema } from "../validators/playlist.validator";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getMyPlaylists,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller";

const router = Router();

router.use(authenticate);

router.route("/").post(validate(PlaylistSchema, ValidationSource.BODY), createPlaylist);

router.route("/me").get(getMyPlaylists);

router.route("/user/:userId").get(getUserPlaylists);

router
  .route("/:playlistId")
  .get(getPlaylistById)
  .patch(validate(PlaylistSchema, ValidationSource.BODY), updatePlaylist)
  .delete(deletePlaylist);

router
  .route("/:playlistId/videos/:videoId")
  .post(addVideoToPlaylist)
  .delete(removeVideoFromPlaylist);

export default router;
