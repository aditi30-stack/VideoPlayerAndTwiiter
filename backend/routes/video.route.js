import { Router } from "express";
import { EditThumbnail, EditVideo, single, addtoWatchHistory, searchvideo, AllVideos,getRemainingVideos, searchVideoInput, DeleteVideos, getUserVideos } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
//upload, //allvideos, editvideos, delete videos, search video
const router = Router()

router.route('/upload').post(verifyJWT,
    upload.fields([
        { name: "videoFile",
        maxCount: 1

    }, {
        name: "thumbnail",
        maxCount: 1
    }])
    ,
    single)

router.route("/EditVideo/:videoId").patch(verifyJWT, EditVideo)
router.route("/EditThumbnail/:videoId").patch(verifyJWT,
    upload.single("thumbnail"), EditThumbnail)
router.route("/watchHistory/:videoId").get(verifyJWT, addtoWatchHistory)
router.route("/searchVideo/:videoId").get(verifyJWT, searchvideo)
router.route("/getAllVideos").get(AllVideos)
router.route("/getRemainingVideos/:excludingVideoId").get(getRemainingVideos)
router.route("/searchitems").get(searchVideoInput)
router.route("/delete/:videoId").delete(verifyJWT, DeleteVideos)
router.route("/v/user/getUserVideos").get(verifyJWT, getUserVideos)




export default router;