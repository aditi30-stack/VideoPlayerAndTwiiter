import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Tweet } from "../models/tweetModel.js"

const createTweet = asyncHandler(async (req, res) => {
    
    const {content} = req.body;
    const userId = req.user?._id;
    
    
        const response = await Tweet.create({
            content: content,
            owner: userId

        })
        if(!response) {
            throw new ApiError(400, "Tweet not added")
        }
        return res.status(200).json(new ApiResponse(200, response, "tweet created!"))
    

    
})

const getUserTweets = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const UserTweets = await Tweet.find({
        owner: userId
    }).populate("owner", "username avatar")

    return res.status(200).json(new ApiResponse(200, UserTweets, "Tweets retrieved!"))
    
    
    
})

const updateTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params;
    const {newContent} = req.body;
    

    if(!newContent) {
        throw new ApiError(400, "Edited Content not found!")
        
    }

    const response = await Tweet.findById(tweetId)
    if(!response) {
        throw new ApiError(400, "No tweet Found!")
    }

    const newResponse = await Tweet.findByIdAndUpdate(tweetId, {
        $set: {
            content: newContent
        }
    })
    if(!newResponse) {
        throw new ApiError(400, "Error while updating the content!")
    }

    return res.status(200).json(new ApiResponse, newResponse, "Tweet updated!")
    
   
})

const deleteTweet = asyncHandler(async (req, res) => {
    const {tweetId} = req.params;

    let tweetFound = await Tweet.findByIdAndDelete(tweetId)

    if(!tweetFound) {
       throw new ApiError(401, "Error deleting Tweet!")
    }
    
    return res.status(200).json(new ApiResponse(200, tweetFound, "tweet Deleted!"))
    
})

const getAllTweets = asyncHandler(async(req, res)=>{
    const result = await Tweet.aggregate([{
        $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "tweet",
            as: "TweetLikes"
        }
    }, {
        $addFields: {
            totalTweetLikes: {
                $size: "$TweetLikes"

            }
        }
    }, {
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "usernamesList"
        }
    }, {
        $unwind: "$usernamesList",
        
    }, {
        $project: {
            content: 1,
            owner: 1,
            totalTweetLikes: 1,
            "usernamesList.username": 1,
            "usernamesList.avatar": 1
        }
    }])

    return res.status(200).json(new ApiResponse(200, result, "Tweets fetched!"))
})



export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet,
    getAllTweets
}