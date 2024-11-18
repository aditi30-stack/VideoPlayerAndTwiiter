
import { Video } from "../models/VideoModel.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFileCloudinary, uploadonCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/UserModel.js";
//upload, editvideoname,title //getallvideos, //searchvideo //deletevideos

export const single = asyncHandler(async(req, res)=>{
    const userId = req.user?._id
    
    const videoFilePath = req.files?.videoFile[0]?.path
    const thumbnailPath = req.files?.thumbnail[0]?.path

  const {title, description } = req.body;

  if([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are compulsory")

  }

  if(!videoFilePath) {
    throw new ApiError(400, "Video File is missing!")
  }

  if(!thumbnailPath) {
    throw new ApiError(400, "Thumbnail is missing!")
  }

  const VideoFile = await uploadonCloudinary(videoFilePath)

  const thumbnail = await uploadonCloudinary(thumbnailPath)

  const response = await Video.create({
    videoFile: VideoFile.url,
    thumbnail: thumbnail.url,
    title: title,
    description: description,
    owner: userId
  })

  if(!response) {
    throw new ApiError(400, response, "Error while uploading the video!")
  }

  return res.status(200).json(
    new ApiResponse(200, response, "Video uploaded successfully!")
  )
    

})

export const EditVideo = asyncHandler(async(req, res)=>{
    const {title, description, isPublished} = req.body
    
    const {videoId} = req.params

    if(!title && !description && isPublished === undefined) {
        throw new ApiError(400, "No field is Found to edit!")
    }

    let AddEditField = {}

    if(title) {
        AddEditField.title = title // {title: "title"}
    }

    if(description) {
        AddEditField.description = description
    }

    if(isPublished !== undefined) {
        AddEditField.isPublished = !!isPublished
    }

   let EditedVideo =  await Video.findByIdAndUpdate(videoId, {
        $set: AddEditField
    }, {
        new: true,
        runValidators: true

    })

    if(!EditedVideo) {
        return new ApiError(400, "Video not Found")
    }

    return res.status(200).json(new ApiResponse(200, EditedVideo, "Video edited successfully" ))

})

export const EditThumbnail = asyncHandler(async(req, res)=>{
    const {videoId} = req.params;
    const thumbnailPath = req.file?.path
    

    if(!thumbnailPath) {
        throw new ApiError(400, "thumbnail is missing!")
    }  

    const video = await Video.findById(videoId)

    if(!video) {
        throw new ApiError(400, "Video not Found!")
    }


    const publicId = video.thumbnail.split("/")[7].replace('.jpg', "")

    await deleteFileCloudinary(publicId, "video")
    const thumbnail =  await uploadonCloudinary(thumbnailPath)
    
    if(!thumbnail.url) {
    throw new ApiError(400, "Error while uploading the video")

   }

   let videoResponse = await Video.findByIdAndUpdate(videoId, {
    $set: {
        thumbnail: thumbnail.url
    }
   }, {
    new: true
   })

   return res.status(200).json(new ApiResponse(200, videoResponse, "thumbnail updated successfully!"))



})

export const searchvideo = asyncHandler(async(req, res)=>{
    
    const {videoId} = req.params;

    let videoFound = await Video.findByIdAndUpdate(videoId, {
        $inc: {
            views: 1
        }
    }, {
        new: true
    }).populate('owner', '_id avatar username')

    if(!videoFound) {
        new ApiError(400, "No video Found!")
    }

    return res.status(200).json(new ApiResponse(200, videoFound, "Video"))


})


export const addtoWatchHistory = asyncHandler(async(req, res)=>{
    const userId = req.user?._id;

    const {videoId} = req.params;

    if(!videoId) {
        return res.status(400).json(new ApiError(400, "videoId is missing!"))
    }

    let user = await User.findById(userId)

    if(!user) {
        return new ApiError(400, "User not found")
    }

   let video = await Video.findById(videoId)

   if(!video) {
    return new ApiError(400, "Video not found")
   }

   let videoAdded = await User.findByIdAndUpdate(userId, {
    $addToSet: {
        watchHistory: video._id
    },
}, {
    new: true
})

if(!videoAdded) {
    return new ApiError(400, "Error while adding video")

}

return res.status(200).json(new ApiResponse(200, videoAdded, "video added to watchhistory successfully!"))

})

export const DeleteVideos = asyncHandler(async(req, res)=>{
    const {videoId} = req.params;
    let VideoDeleted = await Video.findByIdAndDelete(videoId)
    if(!VideoDeleted) {
        return new ApiError(400, "Video not deleted!")
    }

    return res.status(200).json(new ApiResponse(200, VideoDeleted, "Video deleted successfully!"))

})

export const AllVideos = asyncHandler(async(req, res)=>{
    const skip = parseInt(req.query.skip) || 0
    const limit = parseInt(req.query.limit) || 10
    const response = await Video.find().skip(skip).limit(limit)

    if(response.length === 0) {
        throw new ApiError(400, "Cannot find any videos!")
    }
    return res.status(200).json(new ApiResponse(200, response, "Videos fetched successfully!"))

    

})

export const getRemainingVideos = asyncHandler(async(req, res)=>{
    const {excludingVideoId} = req.params;
    const {limit, skip} = req.query || 0

    if(!excludingVideoId) {
        return new ApiError(400, "videoid not given to exclude!")
    }

    const response = await Video.find({
        _id: {$ne: excludingVideoId}
    }).limit(limit).skip(skip)

    if(!response) {
        throw new ApiError(400, "Video not Found")
    }
    return res.status(200).json(new ApiResponse(200, response, "excluding videos fetched!"))
})

export const searchVideoInput = asyncHandler(async(req, res)=>{
    const {search} = req.query
    const {limit} = req.limit || 0;
    const {skip} = req.skip || 0

    const result = await Video.find({
        $or: [{
            title: {
                $regex: search, $options: 'i'
            }
        }, {
            description: {
                $regex: search, $options: 'i'
            }
        }]
    }).limit(limit).skip(skip)

    return res.status(200).json(new ApiResponse(200, result, "result fetched"))
})

export const getUserVideos = asyncHandler(async(req, res)=>{
    const user = req.user._id

    const UserVideos = await Video.find({
        owner: user
    })

    return res.status(200).json(new ApiResponse(200, UserVideos, "Videos fetched successfully"))
})