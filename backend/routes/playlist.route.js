import { Router } from 'express';
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
} from "../controllers/PlayList.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT); 

router.route("/").post(createPlaylist)
router.route("/user").get(getUserPlaylists);
router
    .route("/getPlaylist/:playlistId")
    .get(getPlaylistById)
    .patch(updatePlaylist)
    .delete(deletePlaylist);

router.route("/add/:playlistId/videos").post(addVideoToPlaylist);
router.route("/remove/:playlistId/videos").patch(removeVideoFromPlaylist);



export default router