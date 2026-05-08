import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["comment", "moderation", "recommendation", "system"],
      required: true,
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
    },
    entityType: {
      type: String,
      trim: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email required"],
      unique: [true, "Email already existed"],
    },
    password: {
      type: String,
      required: [true, "Password required"],
    },
    role: {
      type: String,
      enum: ["USER", "AUTHOR", "ADMIN"],
      required: [true, "Invalid role"],
    },
    profileImageUrl: {
      type: String,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: [240, "Bio cannot exceed 240 characters"],
    },
    website: {
      type: String,
      trim: true,
    },
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "article",
      },
    ],
    notifications: [notificationSchema],
    isUserActive:{
        type:Boolean,
        default:true
    }
  },
  {
    timestamps: true,
    versionKey: false,
    strict: "throw",
  },
);

//create model
export const UserModel = model("user", userSchema);