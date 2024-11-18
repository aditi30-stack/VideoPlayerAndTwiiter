import { ApiError } from "../utils/ApiError.js"
import { PlayList } from "../models/playListModel.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    const userId = req.user._id;

    if(!name && !description) {
        throw new ApiError(400, "name and description is mandatory!")
    }

    let PlayListCreated = await PlayList.create({
        name: name,
        description: description,
        owner: userId

    })
    if(!PlayListCreated) {
        throw new ApiError(400, "Error creating Playlist")
    }
    return res.status(200).json(new ApiResponse(200, PlayListCreated, "Playlist Created!"))

   


    
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    
    const userId = req.user._id;
    

    let UserPlaylist = await PlayList.find({
        owner: userId
    }).populate("videos", "thumbnail")

    
    return res.status(200).json(new ApiResponse(200, UserPlaylist, "Playlist!"))


    
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    if(!playlistId) {
        throw new ApiError(400, "No Id Found!")
    }
    let PlayListFound = await PlayList.findById(playlistId).populate("videos", 
        "videoFile title description views thumbnail")

    if(!PlayListFound){
        throw new ApiError(400, "Playlist not Found!")
    }

    return res.status(200).json(new ApiResponse(200, PlayListFound, "Playlist Found!"))

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {videos} = req.body
    

    if(!playlistId && !videos) {
        throw new ApiError(400, "Playlist Id and Video to add not Found!")
    }

    const playlist = await PlayList.findById(playlistId) 

    if(!playlist) {
        throw new ApiError(400, "playlist not Found!")
    }

    const newVideos = videos.filter((videoId) => !playlist.videos.includes(videoId))


    let VideoAdded = await PlayList.findByIdAndUpdate(playlistId, {
        $push: {
            videos: {
                $each: newVideos
            }
        }
    }, {
        new: true
    })

    if(!VideoAdded) {
        throw new ApiError(400, "Video added")
    }

    return res.status(200).json(new ApiResponse(200, VideoAdded, "New video added in the playlist!"))
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params;
    const {videoId} = req.body;

    if(!playlistId && !videoId) {
        throw new ApiError(400, "PlaylistId and videoid not Found!")
    }

   const pullQuery = Array.isArray(videoId) 
                    ? {$in: videoId}
                    : videoId



    let VideoRemoved = await PlayList.findByIdAndUpdate(playlistId, {
        $pull: {
            videos: pullQuery
        }


    }, {
        new: true
    })

    if(!VideoRemoved) {
        throw new ApiError(400, "Can't remove video")
    }

    return res.status(200).json(new ApiResponse(200, VideoRemoved, "Video removed!"))

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    if(!playlistId) {
        throw new ApiError(400, "Playlist id missing!")
    }

    let response = await PlayList.findByIdAndDelete(playlistId)
    if(!response) {
        throw new ApiError(400, "Error deleting playlist!")
    }
    res.status(200).json(new ApiResponse(200, response, "Playlist deleted!"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    let updatedData = {}
    
    if(!playlistId && !name && !description) {
        throw new ApiError(200, "playlistId, name and description missing!")

    }

    if(name) {
        updatedData.name = name

    }

    if(description) {
        updatedData.description = description
    }

    let UpdatedData = await PlayList.findByIdAndUpdate(playlistId, {
        $set: updatedData
    }, {
        new: true
    })

    if(!UpdatedData) {
        throw new ApiError(200, "Error updating data!")
    }

    return res.status(200).json(new ApiResponse(200, UpdatedData, "playlist updated!"))

    
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}