import mongoose, {Schema} from "mongoose";
const PostSchema=new Schema({
title:{
    type:String,
    required:true,
},
content:{
    type:String,
    required:true,
},
featuredImage:{
    type:String,
    required:true
},
status:{
    type:String
},
userId:{
    type:Schema.Types.ObjectId,
    ref:"User"
},
likes:{
    type:Number,
    default:0
}
},{timestamps:true})
export const Post=mongoose.model("Post",PostSchema);