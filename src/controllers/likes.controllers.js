import { asynchandler } from "../utils/asynchandler.js";
import { Like } from "../models/likes.models.js";
import { ApiError } from "../utils/apierror.js";
import { Apiresponse } from '../utils/Apiresponse.js';
import mongoose from "mongoose";
import { Post } from "../models/posts.models.js";
const toggleLike = asynchandler(async (req, res) => {
    const { postId } = req.body;
    const userId = req.user._id;
    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }
    let like = await Like.findOne({ postId: postId,userId:userId });
    if (like) {
        await Like.deleteOne({ _id: like._id });
        const t=await Post.findByIdAndUpdate(postId,
               { $inc: { likes: -1 } },
               { new: true }
        )
        return res.status(200).json(new Apiresponse(200, t, "Like removed successfully"));
    } else {
        like = new Like({ userId: userId, postId: postId });
        await like.save();
         const b= await Post.findByIdAndUpdate(postId,
               { $inc: { likes: 1 } },
               { new: true }
        )
        return res.status(200).json(new Apiresponse(200, b, "Like added successfully"));
    }
});
const trendingposts = asynchandler(async (req, res) => {
    const topPosts = await Post.find({})
  .sort({ likes: -1 })
  .limit(10)
    if (!topPosts) {
        throw new ApiError(404, "No trending posts found");
    }
    return res.status(200).json(new Apiresponse(200, topPosts, "Trending posts fetched successfully"));
})
const getLikesByPostId = asynchandler(async (req, res, next) => {
    const { postId } = req.params;
    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }
    const postowner = await Post.findById(postId);
    if (postowner.userId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to view likes for this post");
    }
    const response = await Like.aggregate([
        { $match: { postId: new mongoose.Types.ObjectId(postId) } },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        {
            $project: {
                _id: 1,
                userId: 1,
                postId: 1,
                userDetails: { _id: 1, name: 1 }
            }
        }])
    return res.status(200).json(new Apiresponse(200, response, "Likes made by user for my post fetched successfully"));
})
const getlikes = asynchandler(async (req, res) => {
    const { postId } = req.params;
    if (!postId) {
        throw new ApiError(400, "bad request")
    }
    const likescount = await Post.findById(postId);
    return res.status(200).json(new Apiresponse(200, likescount.likes, "successfully fetched the likes"))
})  
const mylikes= asynchandler(async(req,res)=>{
    const userId=req.user._id;
    const likes=await Like.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    ]);
    return res.status(200).json(new Apiresponse(200,likes,"fetched my likes successfully"))
}); 
export {
    toggleLike, trendingposts,
    getLikesByPostId,
    getlikes,
    mylikes
};
