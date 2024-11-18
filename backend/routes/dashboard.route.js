import { Router } from 'express';
import {
    getChannelStats,
    getChannelVideos,
} from "../controllers/Dashboard.Controller.js"


const router = Router();

router.route("/stats/:channelId").get(getChannelStats);
router.route("/videos/:channelId").get(getChannelVideos);

export default router