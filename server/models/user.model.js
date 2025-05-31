import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    followers: [
      {
        type: Types.ObjectId,
        ref: "user", 
      },
    ],
  },
  {
    timestamps: true,
  }
);

const userModel = model("user", userSchema);

export default userModel;
