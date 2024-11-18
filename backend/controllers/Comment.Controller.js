import { Comment } from "../models/Commentmodel.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose"

const getVideoComments = asyncHandler(async (req, res) => {
    
    const {videoId} = req.params
    
    const {page=1, limit=10} = req.query
  
    const ListOfComments =  await Comment.aggregate([
        {
        $match: {
            video: new mongoose.Types.ObjectId(videoId)
    }}, {
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "TotalComments",
                  
        }
    }, {
        $unwind: "$TotalComments"
    }, {
        $project: {
            content: 1,
            _id: 1,
            username: "$TotalComments.username",
            avatar: "$TotalComments.avatar"
            
        }
    }, {
        $skip: (page-1) * limit
    }, {
        $limit: parseInt(limit)
    }])

    return res.status(200).json(new ApiResponse(200, ListOfComments, "Comments fetched"))



})

const addComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    const {content} = req.body;
    const owner = req.user?._id
    

   const addComment =  await Comment.create({
        video: videoId,
        content: content,
        owner: owner
    })

    if(!addComment) {
        throw new ApiError(400, "Error while adding the comment!")
    }

    return res.status(200).json(new ApiResponse(200, addComment, "Comment added!"))

    


   
})

const updateComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    const {Editcontent} = req.body;
    const owner = req.user?._id
    const {commentId} = req.params;

    if(!videoId && !Editcontent && !commentId) {
        throw new ApiError(400, "Fields are missing!")
    }

   const commentFound =  await Comment.findOne({
        owner: owner,
        video: videoId,
        _id: commentId
    })

    if(!commentFound) {
        throw new ApiError(400, "No comment Found!")

    }

    const updatedComment = await Comment.findByIdAndUpdate(commentId, {
        $set: {
            content: Editcontent
        }
    }, {
        new: true
    })

    if(!updatedComment) {
        throw new ApiError(400, "Error while adding the comment!")

    }

    return res.status(200).json(new ApiResponse(200, updatedComment, "Comment updated!"))


    
})

const deleteComment = asyncHandler(async (req, res) => {
    const {videoId} = req.params;
    const owner = req.user._id;

    if(!videoId && !commentId) {
        throw new ApiError(400, "Fields are missing!")
    }

    let findCommentbyOwner = await Comment.findOne({
        video: videoId,
        owner: owner
    })

    if(!findCommentbyOwner) {
        throw new ApiResponse(400, {}, "You are not authorized to delete this comment!")

    }

    const commentDelete = await Comment.findByIdAndDelete(findCommentbyOwner._id)
    if(!commentDelete) {
        throw new ApiError(400, {}, "Comment not deleted!")
    }

    return res.status(200).json(new ApiResponse(200, {}, "Comment deleted successfully!"))
    




    

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }