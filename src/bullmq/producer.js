import { Queue } from "bullmq";
import { connection } from "../db/redis.js";
export const emailqueue=new Queue("email-queue",{connection,
    defaultJobOptions:{
        removeOnComplete:true,
        attempts:3,
        backoff:{type:"exponential",delay:2000
       }
       
    }
});
export const postqueue=new Queue('post-queue',{
    connection,
    defaultJobOptions:{
         removeOnComplete:true,
        attempts:3,
        backoff:{type:"exponential",delay:2000
       }
       
    }
})


