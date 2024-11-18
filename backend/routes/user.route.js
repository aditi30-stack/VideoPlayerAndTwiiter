import { Router } from "express";
import {changeCurrentPassword, deleteUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/user.controller.js";
import { getCurrentUser } from "../controllers/user.controller.js";
const router = Router()
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }

    ]),
    registerUser
)


router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT,logoutUser)

router.route("/refreshToken").get(verifyJWT, refreshAccessToken)

router.route("/updateUserAvatar").patch(verifyJWT,
    upload.single('avatar'), updateUserAvatar
)

router.route("/updateCoverImage").patch(verifyJWT,
    upload.single("coverImage"), updateUserCoverImage
)

router.route("/getcurrentUser").get(verifyJWT, getCurrentUser)
router.route("/channelProfile/:username").get(verifyJWT, getUserChannelProfile)
router.route("/updateUserDetails").patch(verifyJWT, updateAccountDetails)
router.route("/changePassword").patch(verifyJWT, changeCurrentPassword)
router.delete("/deleteUser").delete(deleteUser)
router.route("/history").get(verifyJWT, getWatchHistory)


export default router