import mongoose,{Schema} from "mongoose";

const postSchema= new Schema({
    userId:{type:mongoose.Types.ObjectId, ref:"User", required:true},
    book:{type:String, required:true},
    author:{type:String, required:true},
    genre:{type:String, required:true},
    cover:{type:String, required:true},
    review:{type:String, required:true},    
    rating:{type:Number, required:true},
    likes:[{type:mongoose.Types.ObjectId}],
    dislikes:[{type:mongoose.Types.ObjectId}]
})

const Post=mongoose.model('Post',postSchema)

export default Post;