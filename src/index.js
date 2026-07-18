import 'dotenv/config';
import connectDB from "./db/conect.db.js"
import { verifyTurnstileToken } from './utils/turnstile.js';
import {connection} from "./db/redis.js"
import { worker,postworker } from "./bullmq/worker.js"
import { emailqueue } from "./bullmq/producer.js"
import {app,server} from './app.js'
import { uploadFileOnCloudinary } from './utils/cloudinary.js';
import { OAuth2Client } from './utils/googleauth.js';
connectDB().then(()=>{
    server.listen(process.env.PORT,()=>{
        console.log('MONGO DB IS LISTENING ON PORT 8000!')
    })
}).catch((error)=>{
    console.log('MONGO CONNECTION FAILED',error)
})
connection.on("connect", () => {
  console.log("✅ Redis connected");
});
connection.on("error", (err) => {
  console.error("❌ Redis error:", err);
});
export {app};
// jisme bhi use hai .env ka usko import krdo in index.js

