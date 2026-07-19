import 'dotenv/config'; 
import { Worker } from "bullmq";
import { connection } from "../db/redis.js";
import connectDB from '../db/conect.db.js';
import fs from 'fs'; // Added for reading the attachment file
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

// --- EMAIL WORKER (Updated with Brevo API) ---
const worker = new Worker("email-queue", async (job) => {
    console.log(`Processing email job for: ${job.data.email}`);
    
    // Read the photo.png file and convert it to Base64 for Brevo
    const photoPath = path.join(process.cwd(), 'src', 'bullmq', 'photo.png');
    let attachmentContent = "";
    
    try {
        if (fs.existsSync(photoPath)) {
            attachmentContent = fs.readFileSync(photoPath, { encoding: 'base64' });
        } else {
            console.log("⚠️ Warning: photo.png not found at", photoPath);
        }
    } catch (err) {
        console.log("⚠️ Could not read photo.png attachment:", err.message);
    }

    // Prepare Brevo payload
    const payload = {
        sender: { 
            name: "NEXUS CMS", 
            email: process.env.ADMIN_EMAIL 
        },
        to: [
            { email: job.data.email }
        ],
        subject: "BLOGGER sent you a message", // Kept your original subject
        htmlContent: job.data.message.htmlTemplate,
    };

    // Add attachment only if the file was successfully read
    if (attachmentContent) {
        payload.attachment = [
            {
                name: 'photo.png',
                content: attachmentContent
            }
        ];
    }

    // Send using native Node fetch
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "accept": "application/json",
            "api-key": process.env.BREVO_API_KEY,
            "content-type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Brevo API Error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    return data;
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

// --- POST WORKER (Untouched) ---
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
