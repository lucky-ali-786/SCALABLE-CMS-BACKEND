import 'dotenv/config'; 
import { Worker } from "bullmq";
import { connection } from "../db/redis.js";
import connectDB from '../db/conect.db.js';
import nodemailer from "nodemailer";
import sanitizeHtml from 'sanitize-html';
import { Post } from "../models/posts.models.js";
import express from 'express';
import path from 'path'; 
const app = express();
const PORT = process.env.PORT || 10000;
app.get('/health', (req, res) => res.status(200).send('Worker is awake!'));
app.listen(PORT, () => console.log(`🚀 Dummy web server running on port ${PORT}`));
connectDB().then(() => {
    console.log("✅ Worker successfully connected to MongoDB");
}).catch((err) => {
    console.log("❌ Worker failed to connect to MongoDB", err);
    process.exit(1); 
});

connection.on("connect", () => {
    console.log("✅ Worker connected to Redis (Listening for jobs...)");
});

const worker = new Worker("email-queue", async (job) => {
  let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // Use SSL/TLS
        auth: {
            user: process.env.ADMIN_EMAIL,
            pass: process.env.PASSWORD
        }
    });
    let mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: `${job.data.email}`,
        subject: `BLOGGER sent you a message`,
        html: job.data.message.htmlTemplate,
        attachments: [{
            filename: 'photo.png',
            path: path.join(process.cwd(), 'src', 'bullmq', 'photo.png'),
            cid: 'logo'
        }]
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("Error sending email: " + error.message);
        throw error; 
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

        await newPost.save(); 
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

postworker.on('failed', (job, err) => { 
    console.log(`❌ Post Job failed:`, err.message);
});

export { worker, postworker };