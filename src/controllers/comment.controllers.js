import { Comment } from '../models/Comment.models.js';
import { asynchandler } from "../utils/asynchandler.js";
import { Like } from "../models/likes.models.js";
import { ApiError } from "../utils/apierror.js";
import { Apiresponse } from '../utils/Apiresponse.js';
import { Post } from "../models/posts.models.js";
import { User } from '../models/users.models.js';
import mongoose from 'mongoose';
import axios from 'axios';
import { emailqueue } from '../bullmq/producer.js';
import { htmlTemplateComment } from './template.js';

const createcomment = asynchandler(async (req, res) => {
    const { postId, content } = req.body;
    if (!postId || !content) {
        throw new ApiError(400, "Post ID and content are required");
    }
    const comment = new Comment({
        userId: req.user._id,
        postId,
        content
    });
    await comment.save();

    if (comment) {
        const posttitle = await Post.findById(postId).select('title userId'); 
        const username = req.user.name;
        const useremail = await User.findById(posttitle.userId).select('email');
        const htmlTemplate = htmlTemplateComment(posttitle.title, username, content);
        
        if (!useremail) {
            throw new ApiError(400, "FIELDS MISSING");
        }
        
        await emailqueue.add("email-queue", { 
            email: useremail.email, 
            message: { htmlTemplate: htmlTemplate } 
        }, { priority: 2 });
    }

    return res.status(201).json(new Apiresponse(201, comment, "Comment created successfully"));
});

const deletecomment = asynchandler(async (req, res) => {
    const { commentId } = req.params;
    if (!commentId) {
        throw new ApiError(400, "Comment ID is required");
    }
    const owner = await Comment.findById(commentId);
    if (!owner) {
        throw new ApiError(404, "Comment not found");
    }
    if (owner.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new ApiError(403, "You are not authorized to delete this comment");
    }
    await Comment.deleteOne({ _id: commentId })
    return res.status(200).json(new Apiresponse(200, null, "Comment deleted successfully"));
});

const editcomment = asynchandler(async (req, res) => {
    const { commentId, content } = req.body;
    if (!commentId || !content) {
        throw new ApiError(400, "Comment ID and content are required");
    }
    const owner = await Comment.findById(commentId);
    if (!owner) {
        throw new ApiError(404, "Comment not found");
    }
    if (owner.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        throw new ApiError(403, "You are not authorized to edit this comment");
    }
    const pilo = await Comment.findByIdAndUpdate(commentId,
        { $set: { content } },
        { new: true }
    );
    
    // findByIdAndUpdate doesnt load the whole document and then update it, it directly updates in db
    // where as save() loads the document first and then updates it in db
    
    return res.status(200).json(new Apiresponse(200, pilo, "Comment edited successfully"));
});

const getcommentsbypostid = asynchandler(async (req, res) => {
    const { postId } = req.params;
    if (!postId) {
        throw new ApiError(400, "Post ID is required");
    }
    const comments = await Comment.aggregate([
        { $match: { postId: new mongoose.Types.ObjectId(postId) } },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        { $sort: { createdAt: -1 } },
        {
            $project: {
                _id: 1,
                content: 1,
                createdAt: 1,
                userDetails: {
                    _id: 1,
                    name: 1,
                }
            }
        }
    ])
    return res.status(200).json(new Apiresponse(200, comments, "Comments fetched successfully"));
});

const likecomment = asynchandler(async (req, res) => {
    const { commentId } = req.body;
    const userId = req.user._id;
    if (!commentId) {
        throw new ApiError(400, "Comment ID is required");
    }
    let like = await Like.findOne({ userId: userId, commentId: commentId });
    if (like) {
        await Like.deleteOne({ _id: like._id });
        return res.status(200).json(new Apiresponse(200, null, "Like removed successfully"));
    }
    else {
        like = new Like({ userId: userId, commentId: commentId });
        await like.save();
        return res.status(200).json(new Apiresponse(200, like, "Like added successfully"));
    }
});

const mycomments = asynchandler(async (req, res, next) => {
    const userId = req.user._id;
    const comments = await Comment.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
            $lookup: {
                from: "posts",
                localField: "postId",
                foreignField: "_id",
                as: "postDetails"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        { $sort: { createdAt: -1 } },
        {
            $project: {
                _id: 1,
                content: 1,
                createdAt: 1,
                postDetails: {
                    _id: 1,
                    title: 1
                },
                userDetails: {
                    name: 1,
                }
            }
        }
    ]);
    return res.status(200).json(new Apiresponse(200, comments, "My comments fetched successfully"));
});

export {
    createcomment, deletecomment, getcommentsbypostid, likecomment, mycomments,
    editcomment
}