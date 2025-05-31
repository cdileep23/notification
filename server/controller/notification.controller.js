import notificationModel from "../models/notification.model.js";

export const getNotifications=async(req,res)=>{
    try {
        const{userId}=req.params
        const notifications=await notificationModel.find({toUserId:userId}).sort({createdAt:-1})

        return res.status(200).json({
            message:"Here is Your Notification",
            success:true,
            notifications
        })
        
    } catch (error) {
        console.error("Create blog error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}