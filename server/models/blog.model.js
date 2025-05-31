import mongoose from "mongoose";

const blogSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true
    },
    userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user"
    }
},{
    timestamps:true
})

const blogModel=mongoose.model('blog', blogSchema)

export default blogModel