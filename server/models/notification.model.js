import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  fromUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  toUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },message:{
    type:String,
    required:true
  }
},{
    timestamps:true
});

const notificationModel=mongoose.model('notification', notificationSchema)
export default notificationModel