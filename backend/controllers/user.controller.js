import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/UserModel.js"
import { deleteFileCloudinary, uploadonCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { Video } from "../models/VideoModel.js"
import mongoose from "mongoose"


const generateAccessTokenAndRefreshToken = async(userId) => {
    try{

        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken;

        await user.save({validateBeforeSave: false})
        return {
            accessToken,
            refreshToken
        }


    }catch(error) {
        throw new ApiError(500, "something went wrong while generating access token and refresh token")

    }
}

export const registerUser = asyncHandler (async (req, res)=>{
    const {username, fullname, email, password} = req.body
    if( [fullname, email, username, password].some((field)=> 
    field?.trim() === "") ) {
        throw new ApiError(400, "All fields are required")

    }

    const ifEmailExists = await User.findOne({
        $or: [{username}, {email}]
    })

    if(ifEmailExists) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    
   
    let coverImageLocalPath;

    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    

   if(!avatarLocalPath){
    throw new ApiError(400, "Avatar file is required!")
   }

   const avatar = await uploadonCloudinary(avatarLocalPath)
   
   const coverImage = await uploadonCloudinary(coverImageLocalPath)

   if(!avatar){
    throw new ApiError(400, "Avatar file is required!")

   }

   const user = await User.create({
    username: username.toLowerCase(),
    fullname: fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email: email,
    password
    




   })

   const userExists = await User.findById(user._id).select(
    "-password -refreshToken"
   )
   if(!userExists) {
    throw new ApiError(500, "Something went wrong while registering the user")
    

   }

   return res.status(201).json(
    new ApiResponse(200, userExists, "user created successfully!")
   )

})


export const loginUser = asyncHandler(async(req, res)=>{
    const {email, password} = req.body;
    
    

    if(!email) {
        throw new ApiError(400, "email is required!")
    }

    const UserExists = await User.findOne({
        email:email})

    if(!UserExists) {
        throw new ApiError(404, "No user found!")
    }

    const isPasswordValid = await UserExists.isPasswordCorrect(password)

    if(!isPasswordValid) {
        throw new ApiError(401, "Password incorrect!")
    }

    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshToken(UserExists._id)

    
    
    UserExists.save({validateBeforeSave: false})

    let newUser = await User.findOne({
        email
    }).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).cookie("accessToken", accessToken, options)
    .cookie("refreshToken",refreshToken, options)
    .json(
        new ApiResponse(200, 
            { user: newUser, accessToken, refreshToken},
            "User logged In Successfully!"
        )
    )
    
})

export const logoutUser = asyncHandler(async(req, res)=>{
    const options = {
        httpOnly: true,
        secure: true
    }

    await User.findByIdAndUpdate(req.user._id, {
        $set: {
            refreshToken: undefined
        },

    }, {
        new: true
    })

    return res.status(200).clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"))


})


export const refreshAccessToken = asyncHandler(async(req, res)=>{

   const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken

   if(!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request")
   }

   let VerifyToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

   const user = await User.findById(VerifyToken?._id)
   
   if(!user) {
    throw new ApiError(401, "Invalid Refresh Token!")
   }

   if(user.refreshToken !== incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is expired or used")
   }

   const options = {
    httpOnly: true,
    secure: true
   }

   const {refreshToken, accessToken} = await generateAccessTokenAndRefreshToken(user._id)

   res.status(200).cookie("accessToken", accessToken, options)
   .cookie("refreshToken", refreshToken, options)
   .json(
    new ApiResponse(200, {accessToken, refreshToken},
        "Access token refreshed"
    )
   )



})

export const changeCurrentPassword = asyncHandler(async(req, res)=>{
    const {oldPassword, newPassword} = req.body;
    const id = req.user._id

    const user = await User.findById(id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old Password")
    }

    user.password = newPassword
   
    await user.save({validateBeforeSave:false})
    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully!"))

    
    
    

    

})
    

export const getCurrentUser = asyncHandler(async(req, res) => {
    
   

    if (!req.user) {
        return res.status(404).json(new ApiResponse(404, null, "User not found"));
    }

    return res.status(200).json(new ApiResponse(200, req.user, "Current user fetched successfully!"));
});



export const updateAccountDetails = asyncHandler(async(req, res)=>{
    const {fullname, username} = req.body;
    
    

    if(!fullname && !username) {
        throw new ApiError(400, "All fields are required!")
    }

    let updatedField = {}

    if (fullname) {
        updatedField.fullname = fullname
    }

   if(username) {
        updatedField.username = username;
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: updatedField
        },
        {new: true}
    ).select("-password")

    if(!user) {
        throw new ApiError(400, "No user Found")
    }

    return res.status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully!"))
 

})

export const updateUserAvatar = asyncHandler(async(req, res)=>{
    const avatarLocalPath = req.file?.path;
   

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is missing")
    }

    const avatar = await uploadonCloudinary(avatarLocalPath);
    if(!avatar.url) {
        throw new ApiError(400, "Error while uploading on avatar")
    }
    

    const user = await User.findById(req.user?._id)
    let publicId = user.avatar.split("/")[7].replace('.jpg', "")
    await deleteFileCloudinary(publicId, "image")
    
    const findUser = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            avatar: avatar.url
        }
    },{
        new: true
    }).select("-password")
         

    return res.status(200)
    .json(new ApiResponse(200, findUser, "Avatar Updated Successfully!"))




})


export const updateUserCoverImage = asyncHandler(async(req, res)=>{
    const coverImageLocalPath = req.file?.path;
    if(!coverImageLocalPath) {
        throw new ApiError(400, "coverImage Path is missing!")

    }

    const coverImage = await uploadonCloudinary(coverImageLocalPath);
    if(!coverImage.url) {
        throw new ApiError(400, "Error while uploading cover Image")
    }

    const user = await User.findById(req.user?._id)
    
    if(!user){
        throw new ApiError(400, "User not found!")
    }

    let publicId = user.avatar.split("/")[7].replace('.jpg', "")
    await deleteFileCloudinary(publicId, "image")
    
    const findUser = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            avatar: avatar.url
        }
    },{
        new: true
    }).select("-password")


   return res.status(200)
   .json(new ApiResponse(200, findUser, "CoverImage Updated Successfully!"))



})

export const getWatchHistory = asyncHandler(async(req, res)=>{
    const userId =  req.user?._id
    const watchHistory =  await User.aggregate([{
         $match: {
             _id: new mongoose.Types.ObjectId(userId)
         }
 
     }, {
         $lookup: {
             from: "videos",
             localField: "watchHistory",
             foreignField: "_id",
             as: "watchHistory",
             pipeline: [
                 {
                     $lookup: {
                         from: "users",
                         localField: "owner",
                         foreignField: "_id",
                         as: "owner",
                         pipeline: [{
                             $project: {
                                 fullname: 1,
                                 username: 1,
                                 avatar: 1
 
                             }
                         }]
                     }
 
                 }, {
                     $addFields: {
                         owner: {
                             $first: "$owner"
                         }
                     }
                 }
             ]
         }
     }])
 
 if(!watchHistory || watchHistory.length === 0) {
     return res.status(400).json(new ApiResponse(404, {}, "No watch history found!"))
 
 }
 
 return res.status(200).json(
     new ApiResponse(200, watchHistory[0].watchHistory, "watch history fetched succesfully!")
 )
 
 })

export const getUserChannelProfile = asyncHandler(async(req, res)=>{
    const {username} = req.params;

    if(!username?.trim()) {
        throw new ApiError(400, "username is missing!")
    }

    const channel = await User.aggregate([{
        $match: {
            username: username?.toLowerCase()
        }
    }, {
        $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "channel",
            as: "subscribers"

        }
    }, {
        $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "subscriber",
            as: "subscribedTo"

        }
    }, {
        $addFields: {
            subsribersCount: {
                $size: "$subscribers"

            },
            channelsSubscribedToCount: {
                $size: "$subscribedTo"
            },
            isSubscribed: {
                $cond: {
                    if: {
                        $in: [req.user?._id, "$subscribers.subscriber"]
                    },
                    then: true,
                    else: false
                }
            }
        }, 
    }, {
        $project: {
            fullname: 1,
            username: 1,
            subsribersCount: 1,
            channelsSubscribedToCount: 1,
            isSubscribed: 1,
            avatar: 1,
            coverImage: 1,
            email: 1
        }
        
    }])

    if(!channel?.length) {
        throw new ApiError(404, "channel does not exist!")
    }
    else {
    return res.status(200)
    .json(new ApiResponse(200, channel[0], "user channel fetched successfully!"))
    
    }
})


export const deleteUser = asyncHandler(async(req, res)=>{
    let result = await User.findByIdAndDelete(req.user?._id)
    if(!result) {
       throw new ApiError(400, "Error while deleting the user!")
    }
    return res.status(200).json(new ApiResponse(200, {},  "User deleted successfully!"))

})


