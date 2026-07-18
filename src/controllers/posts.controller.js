import { asynchandler } from "../utils/asynchandler.js";
import { User } from "../models/users.models.js";
import { ApiError } from "../utils/apierror.js";
import { Apiresponse } from '../utils/Apiresponse.js';
import jwt from "jsonwebtoken";
import { Post } from '../models/posts.models.js'
import { uploadFileOnCloudinary } from '../utils/cloudinary.js'
import { emailqueue, postqueue } from "../bullmq/producer.js";
import sanitizeHtml from 'sanitize-html';
import { delay } from "bullmq";
import { htmlTemplate, scheduleHtml } from "./template.js";
import { GoogleGenAI } from "@google/genai"; // Added Google Gen AI import

// Initialize the SDK using the secure backend environment variable
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const createpost = asynchandler(async (req, res) => {
    const { title, content, status } = req.body;
    if (!title?.trim() || !content?.trim() || !status?.trim()) {
        throw new ApiError(400, "All fields are required");
    }
    const featuredImagepath = req?.file?.path;
    if (!featuredImagepath) {
        throw new ApiError(400, "Featured image path not found");
    }
    if (!req.user?._id) {
        throw new ApiError(401, "Unauthorized: user info missing");
    }
    const featuredImage = await uploadFileOnCloudinary(featuredImagepath);
    if (!featuredImage?.url) {
        throw new ApiError(400, "Image upload failed");
    }
    const cleanContent = sanitizeHtml(content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            'img': ['src', 'alt', 'width', 'height', 'style']
        },
        allowedSchemes: ['http', 'https', 'data']
    });
    const cleanTitle = sanitizeHtml(title, {
        allowedTags: [], // No HTML allowed in title
        allowedAttributes: {}
    });
    const newPost = new Post({
        title: cleanTitle,
        featuredImage: featuredImage.url,
        content: cleanContent,
        status,
        userId: req.user._id
    });
    await newPost.save();
    return res
        .status(200)
        .json(new Apiresponse(200, newPost, "POST CREATED SUCCESSFULLY"));
});

const updatepost = asynchandler(async (req, res) => {
    const { postId } = req.params;
    const { title, content, status } = req.body;
    if (!postId?.trim()) {
        throw new ApiError(400, "Post ID is required");
    }
    const featuredImagepath = req?.file?.path;

    let featuredImage;
    if (featuredImagepath) {
        featuredImage = await uploadFileOnCloudinary(featuredImagepath);
    }
    const postfind = await Post.findById(postId);
    if (postfind != null && req.user?._id.toString() !== postfind.userId.toString() && req.user.role !== 'admin') {
        throw new ApiError(403, "Forbidden: You are not allowed to update this post");
    }
    const updatefield = {};
    if (title) {
        const cleanTitle = sanitizeHtml(title, {
            allowedTags: [], // No HTML allowed in title
            allowedAttributes: {}
        });
        updatefield.title = cleanTitle;
    }
    if (content) {
        const cleanContent = sanitizeHtml(content, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                'img': ['src', 'alt', 'width', 'height', 'style']
            },
            allowedSchemes: ['http', 'https', 'data']
        });
        updatefield.content = cleanContent;
    }
    if (status) updatefield.status = status;
    if (featuredImage?.url) {
        updatefield.featuredImage = featuredImage.url;
    }


    if (Object.keys(updatefield).length === 0) {
        throw new ApiError(400, "Nothing to update");
    }


    const updatedpost = await Post.findByIdAndUpdate(
        postId,
        { $set: updatefield },
        { new: true }
    );

    if (!updatedpost) {
        throw new ApiError(404, "Post update unsuccessful");
    }

    return res
        .status(200)
        .json(new Apiresponse(200, updatedpost, "Post updated successfully"));
});

const deletepost = asynchandler(async (req, res) => {
    const { postId } = req.params
    if (!postId) {
        throw new ApiError(400, "post not found")
    }
    const postfind = await Post.findById(postId);
    if (postfind != null && req.user?._id.toString() !== postfind.userId.toString() && req.user.role !== 'admin') {
        throw new ApiError(403, "Forbidden: You are not allowed to update this post");
    }
    const del = await Post.findById(postId)
    const cd = await Post.findByIdAndDelete(postId);
    if (!cd) {
        throw new ApiError(400, "unsuccessful deletion")
    }
    return res
        .status(200)
        .json(new Apiresponse(200, del, "Post deleted successfully"));
})

const getpost = asynchandler(async (req, res) => {
    const { postId } = req.params;

    if (!postId?.trim()) {
        throw new ApiError(400, "Post ID is required");
    }

    const post = await Post.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found");
    }

    return res
        .status(200)
        .json(new Apiresponse(200, post, "Post fetched successfully"));
});

const getallposts = asynchandler(async (req, res) => {
    const postsall = await Post.find();
    return res
        .status(200)
        .json(new Apiresponse(200, postsall, "Posts fetched successfully"));
});

const getmyposts = asynchandler(async (req, res) => {
    if (!req.user?._id) {
        throw new ApiError(401, "Unauthorized: user info missing");
    }
    const myposts = await Post.find({ userId: req.user._id });
    return res
        .status(200)
        .json(new Apiresponse(200, myposts, "My Posts fetched successfully"));
});

const schduledpost = asynchandler(async (req, res) => {
    const { title, content, status, time } = req.body;
    if (!title?.trim() || !content?.trim() || !status?.trim() || !time?.trim()) {
        throw new ApiError(400, "All fields are required");
    }
    const featuredImagepath = req?.file?.path;
    if (!featuredImagepath) {
        throw new ApiError(400, "Featured image path not found");
    }
    if (!req.user?._id) {
        throw new ApiError(401, "Unauthorized: user info missing");
    }

    // Calculate delay in milliseconds
    const scheduledDateTime = new Date(time);
    const currentDateTime = new Date();
    const delayMs = scheduledDateTime.getTime() - currentDateTime.getTime();

    if (delayMs <= 0) {
        throw new ApiError(400, "Scheduled time must be in the future");
    }

    const featuredImage = await uploadFileOnCloudinary(featuredImagepath);
    if (!featuredImage?.url) {
        throw new ApiError(400, "Image upload failed");
    }

    await postqueue.add('post-queue', {
        title: title, 
        content: content, 
        status: status,
        featuredImage: featuredImage,
        userId: req.user._id,
    }, { delay: delayMs })

    await emailqueue.add('email-queue', {
        email: req.user.email,
        message: { htmlTemplate: scheduleHtml(title, req.user.name, time) },
    },{ 
      priority: 2
    })

    res.status(200).json(new Apiresponse(200, {}, "post scheduled sucessfully"))
});

// Added the AI blog generation controller
const generateBlog = asynchandler(async (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        throw new ApiError(400, "Topic is required to generate a blog post");
    }

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Write a blog post of about 400 words on the topic: ${topic}.Requirements:- Do not include greetings, introductions of yourself, or meta commentary.- Output only the blog content.- Organize into introduction, body, and conclusion.- Keep the word count close to 400 words.`
        });

        // Extract the text from the result structure
        const blogContent = result.text || result.candidates?.[0]?.content?.parts?.[0]?.text;

        return res
            .status(200)
            .json(new Apiresponse(200, { content: blogContent }, "Blog generated successfully"));

    } catch (error) {
        console.error("Gemini Backend Error:", error);
        throw new ApiError(500, "Failed to generate blog content via AI");
    }
});
export {
    createpost,
    updatepost,
    deletepost,
    getpost,
    getallposts,
    getmyposts,
    schduledpost,
    generateBlog // Added to exports
}