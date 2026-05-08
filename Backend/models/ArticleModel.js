import { Schema, model, Types } from "mongoose";

const commentSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: "user",
    required: [true, "User ID required"],
  },
  comment: {
    type: String,
    required:[true,"Enter a comment"],
  },
});

const reportSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
      required: [true, "Reporter ID required"],
    },
    reason: {
      type: String,
      required: [true, "Report reason is required"],
      trim: true,
      maxlength: [300, "Report reason cannot exceed 300 characters"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

const articleSchema = new Schema(
  {
    author: {
      type: Types.ObjectId,
      ref: "user",
      required: [true, "Author ID is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    status: {
      type: String,
      enum: ["published", "draft", "scheduled"],
      default: "published",
    },
    publishAt: {
      type: Date,
      default: null,
    },
    views: {
      type: Number,
      default: 0,
    },
    comments: [{ type: commentSchema, default: [] }],
    reports: [{ type: reportSchema, default: [] }],
    reportCount: {
      type: Number,
      default: 0,
    },
    isArticleActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    strict: "throw",
  },
);

//create article model
export const ArticleModel = model("article", articleSchema);

// "mbsdf6sdf6df6sd6fs6dfs6df6sd"
//ObjectId("bf7f7f7f7f7f7f77f7f")

//{ comment:"",user:""}
//find().populate("cart.product","pid productName brand")