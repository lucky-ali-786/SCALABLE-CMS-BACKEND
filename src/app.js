import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { createRequire } from 'module'; 
import {setBullBoard} from './bullmq/bullboard.js'
import http from 'http'

const require = createRequire(import.meta.url); 
const swaggerUi = require('swagger-ui-express'); 
const swaggerDocument = require('./utils/swagger-output.json');

const app = express();
app.set("trust proxy", 1);
app.use(cookieParser())

// --- UPDATED CORS CONFIGURATION ---
app.use(
  cors({
    origin: [
        "http://localhost:5173", 
        "https://scalable-cms-deployed.vercel.app" 
    ],
    credentials: true,
  })
);

const server = http.createServer(app);

app.use(express.json({ limit: '200kb' }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"));
setBullBoard(app);

import userRoutes from './routers/user.routes.js'
import postRoutes from './routers/posts.routes.js'
import likeroutes from './routers/likes.routes.js';
import commentRoutes from './routers/comment.routes.js';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/comments/api/v1',commentRoutes);
app.use('/users/api/v1',userRoutes);
app.use('/posts/api/v1',postRoutes);
app.use('/likes/api/v1',likeroutes);

export {app,server};