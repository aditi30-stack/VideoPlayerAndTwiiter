import { User } from "../models/UserModel.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
    const user = req.params.channelId;
    

    const UserStat = await User.aggregate([{
        $match: {
            username: user
        }
    }, {
        $lookup: {
            from: "videos",
            localField: "_id",
            foreignField: "owner",
            as: "TotalVideos"

        }
    }, {
        $addFields: {
            TotalVideos: {
                $size: "$TotalVideos"
            }
        }
    }, {
        $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "channel",
            as: "subscribers"
        }
    },
    {
        $addFields: {
            subscribers: {
                $size: "$subscribers"
            }
        }

    }, {
        $project: {
            username: 1,
            avatar:1,
            coverImage:1,
            subscribers:1,
            TotalVideos:1


        }
    }])



    if (UserStat.length === 0) {
        return res.status(200).json(new ApiResponse(200, {}, "No statistics found for this channel."));
    }

    return res.status(200).json(new ApiResponse(200, UserStat[0], "Channel statistics retrieved successfully."));
});

const getChannelVideos = asyncHandler(async (req, res) => {
    const user = req.params.channelId;

    const FetchVideos = await User.aggregate([{
        $match: {
            username: user
        }
    }, {
        $lookup: {
            from: "videos",
            localField: "_id",
            foreignField: "owner",
            as: "TotalVideos"
        }
    }])

    return res.status(200).json(new ApiResponse(200, FetchVideos, "Videos Fetched successfully!"))
    
});

export {
    getChannelStats, 
    getChannelVideos
};
