import 'dotenv/config'; // Crucial: Workers need env variables too!
import { Worker } from "bullmq";
import { connection } from "../db/redis.js";
import connectDB from '../db/conect.db.js';
import nodemailer from "nodemailer";
import sanitizeHtml from 'sanitize-html';
import { Post } from "../models/posts.models.js";
import path from 'path'; // Added for safer file paths
connectDB().then(() => {
    console.log("✅ Worker successfully connected to MongoDB");
}).catch((err) => {
    console.log("❌ Worker failed to connect to MongoDB", err);
    process.exit(1); // Kill worker if DB fails
});
connection.on("connect", () => {
    console.log("✅ Worker connected to Redis (Listening for jobs...)");
});
const worker = new Worker("email-queue", async (job) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'luckyali7666@gmail.com',
            pass: process.env.PASSWORD
        }
    });

    let mailOptions = {
        from: 'luckyali7666@gmail.com',
        to: `${job.data.email}`,
        subject: `BLOGGER sent you a message`,
        html: job.data.message.htmlTemplate,
        attachments: [{
            filename: 'photo.png',
            // Note: If you deploy this, C:\REACT\... will break on the cloud server. 
            // It is safer to use relative paths with path.join or __dirname.
            path: 'C:\\REACT\\backend\\src\\bullmq\\photo.png',
            cid: 'logo'
        }]
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("Error sending email: " + error.message);
        throw error; // Throw error so BullMQ marks the job as failed
    }
}, {
    connection,
    concurrency: 5
});

worker.on("completed", (job) => {
    console.log(`✅ Email Job ${job.id} completed successfully`);
});

worker.on("failed", (job, err) => {
    console.log(`❌ Email Job ${job.id} failed with error: ${err.message}`);
});

// --- POST WORKER ---
const postworker = new Worker('post-queue', async (job) => {
    try {
        const cleanContent = sanitizeHtml(job.data.content, {
            allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
            allowedAttributes: {
                ...sanitizeHtml.defaults.allowedAttributes,
                'img': ['src', 'alt', 'width', 'height', 'style']
            },
            allowedSchemes: ['http', 'https', 'data']
        });

        const cleanTitle = sanitizeHtml(job.data.title, {
            allowedTags: [],
            allowedAttributes: {}
        });

        const newPost = new Post({
            title: cleanTitle,
            featuredImage: job.data.featuredImage.url,
            content: cleanContent,
            status: job.data.status,
            userId: job.data.userId
        });

        await newPost.save(); // This works now because we connected to MongoDB above!
    } catch (err) {
        throw new Error(err.message);
    }
}, {
    connection,
    concurrency: 5
});

postworker.on('completed', (job) => {
    console.log(`✅ Post Job ${job.id} is completed`);
});

postworker.on('failed', (job, err) => { // Fixed argument order (job, err)
    console.log(`❌ Post Job failed:`, err.message);
});

export { worker, postworker };