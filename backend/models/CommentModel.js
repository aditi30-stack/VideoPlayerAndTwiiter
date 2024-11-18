import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";



const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },

    owner: {
       type:  mongoose.Schema.Types.ObjectId,
       required: true,
       ref: 'User'
    },

    video: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Video"
    }



}, {
    timestamps: true
})

CommentSchema.plugin(mongooseAggregatePaginate)

export const Comment = mongoose.model("Comment", CommentSchema)