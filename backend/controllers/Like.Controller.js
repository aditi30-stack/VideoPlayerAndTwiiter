
import mongoose from "mongoose"
import {Like} from "../models/LikeModel.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const userId = req.user?._id

    if(!videoId) {
        throw new ApiError(400, "VideoId not Found!")
    }

    const LikedVideo = await Like.findOne({
        video: videoId,
        LikedBy: userId
    })

    if(!LikedVideo) {
        let response = await Like.create({
            video: videoId,
            LikedBy: userId
        })
        if(!response) {
            throw new ApiError(400, "Error while adding Like!")
        }

        return res.status(200).json(new ApiResponse(200, response, "Video Liked"))
    }

    let VideoLikeDeleted = await Like.findByIdAndDelete(LikedVideo?._id)
    if(!VideoLikeDeleted){
        throw new ApiError(400, "Error while removing Like!")

    }
    return res.status(200).json(new ApiResponse(200, VideoLikeDeleted, "Video Like deleted!"))





})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params

    const userId = req.user?._id

    if(!commentId) {
        throw new ApiError(400, "Comment Id not provided!")
    }

    const commentLiked = await Like.findOne({
        comment: commentId,
        LikedBy: userId
        
    })

    if(!commentLiked) {
        
        let response = await Like.create({
            comment: commentId,
            LikedBy: userId
        })
        if(!response) {
            throw new ApiError(400, "Cannot add Like on comment!")
        }

        return res.status(200).json(new ApiResponse(200, response, "Like added on Comment!"))
    }

    let deletedCommentLike = await Like.findByIdAndDelete(commentLiked._id)
    if(!deletedCommentLike) {
        throw new ApiError(400, "Like not deleted!")
    }


    return res.status(200).json(new ApiResponse(200, deletedCommentLike, "Like deleted from Comment!"))

    

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    
    const userId = req.user?._id
    if(!tweetId) {
        throw new ApiError(400, "Tweet Id not provided!")
    }

    const tweetLiked = await Like.findOne({
        tweet: tweetId,
        LikedBy: userId
    })
    if(!tweetLiked) {
        
        let response = await Like.create({
            tweet: tweetId,
            LikedBy: userId
        })
        if(!response) {
            throw new ApiError(400, "Cannot add Like on tweet!")
        }

        return res.status(200).json(new ApiResponse(200, response, "Like added on Tweet!"))
    }

    let deletedTweetLike = await Like.findByIdAndDelete(tweetLiked?._id)
    if(!deletedTweetLike) {
        throw new ApiError(400, "Like not deleted!")
    }

    return res.status(200).json(new ApiResponse(200, deletedTweetLike, "Like deleted from Tweett!"))

}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    const userId = req.user?._id
    

    let newResponse = await Like.find({
        LikedBy: userId,
        video: {$ne: null}
    }).select("video LikedBy")

    if(!newResponse || newResponse.length === 0) {
        throw new ApiError(400, "No videos Found!")
    }

    return res.status(200).json(new ApiResponse(200, newResponse, " Liked Videos Fetched!"))
})

const getLikedOnvideo = asyncHandler(async(req, res)=>{
    const {videoId}= req.params

    let totalLikes = await Like.countDocuments({
        video: videoId
    })

    return res.status(200).json(new ApiResponse(200, totalLikes, "Total Likes fetched!"))
    



    
})

const getTotalLikesOnComment = asyncHandler(async(req, res)=>{

    const {commentId} = req.params;
    
    

    const result = await Like.find({
        comment: commentId
    })
    

    return res.status(200).json(new ApiResponse(200, result, "Total Likes on Comments fetched!"))



})



export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos,
    getLikedOnvideo,
    getTotalLikesOnComment,
    
}