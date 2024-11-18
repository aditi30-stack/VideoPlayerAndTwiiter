import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.route.js"
import videoRouter from "./routes/video.route.js"
import commentRouter from "./routes/comment.routes.js"
import LikeRouter from "./routes/like.route.js"
import PlayListRouter from "./routes/playlist.route.js"
import SubscriptionRouter from "./routes/subscriptions.route.js"
import TweetRouter from "./routes/tweet.route.js"
import DashboardRouter from "./routes/dashboard.route.js"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))

app.use(express.urlencoded({extended: true, limit:"16kb"}))

app.use(cookieParser())

app.use('/api/v1/user', userRouter)
app.use('/api/v1/video', videoRouter)
app.use('/api/v1/comment', commentRouter)
app.use('/api/v1/like', LikeRouter)
app.use('/api/v1/tweet', TweetRouter)
app.use('/api/v1/playlist', PlayListRouter)
app.use('/api/v1/subscription', SubscriptionRouter)
app.use('/api/v1/dashboard', DashboardRouter)






export {app}