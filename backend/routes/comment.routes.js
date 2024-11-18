import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/Comment.Controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();

router.use(verifyJWT); 

router.route("/:videoId").get(getVideoComments).post(addComment);
router.route("/:videoId/:commentId").patch(updateComment);
router.route("/delete/:videoId").delete(deleteComment)

export default router