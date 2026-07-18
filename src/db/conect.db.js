import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';
const connectDB=async ()=>{
    try {
        const connectionINS=await mongoose.connect(`${process.env.MONGO_URL}${DB_NAME}`)
    } catch (error) {
        console.log(`MONGO ERROR ${error}`);
        process.exit(1);
    }
}
export default connectDB 