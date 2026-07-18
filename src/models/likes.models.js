import mongoose from 'mongoose';
const likeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }
}, {timestamps:true});
likeSchema.index({postId:1,userId:1});
export const Like = mongoose.model('Like', likeSchema);
