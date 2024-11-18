import mongoose from "mongoose";
import mongooseAggregratePaginate from "mongoose-aggregate-paginate-v2";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";

const VideoSchema = new mongoose.Schema({
    

    videoFile: {
        type: String,
        required: true

    },
    thumbnail: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

}, {timestamps: true})

VideoSchema.plugin(mongooseAggregratePaginate)

export const Video = mongoose.model("Video", VideoSchema)