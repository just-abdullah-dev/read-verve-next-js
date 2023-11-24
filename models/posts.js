const { default: mongoose } = require("mongoose");
import User from "./user";
import Category from "./category";
import Comment from "./comments";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    caption: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    body: { type: Object, required: true },
    publish: { type: Boolean, default: false },
    photo: { type: String, required: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tags: { type: [String], required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

postSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
});

let Post;
try {
  // Try to retrieve the model if it's already registered
  Post = mongoose.model('Post');
} catch (e) {
  // If the model is not registered, create it
  Post = mongoose.model('Post', postSchema);
}

module.exports = Post;
