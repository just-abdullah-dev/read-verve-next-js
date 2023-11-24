const { default: mongoose } = require("mongoose");
const User = require("./user");

const commentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    desc: { type: String, required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    check: { type: Boolean, default: true },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    replyOnUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

// Define the virtual property for replies
commentSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parent",
});

let Comment;
try {
  // Try to retrieve the model if it's already registered
  Comment = mongoose.model('Comment');
} catch (e) {
  // If the model is not registered, create it
  Comment = mongoose.model('Comment', commentSchema);
}

module.exports = Comment;
