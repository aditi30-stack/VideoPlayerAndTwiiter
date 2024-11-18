import { Router } from 'express';
import {
    createTweet,
    deleteTweet,
    getAllTweets,
    getUserTweets,
    updateTweet,
} from "../controllers/Tweet.Controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); 

router.route("/post").post(createTweet);
router.route("/user/t/getUserTweets").get(getUserTweets);
router.route("/t/:tweetId").patch(updateTweet).delete(deleteTweet);
router.route("/getalltweets").get(getAllTweets)

export default router