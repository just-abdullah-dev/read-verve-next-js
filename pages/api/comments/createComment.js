import connectDB from "@/config/db";
import errorHandler from "@/middleware/errorHandler";
import { authGuard } from "@/middleware/userMiddlewares";
import Comment from "@/models/comments";
import Post from "@/models/posts";
import { reqMethodError } from "@/utils/reqErrors";


export default async function handler(req, res) {
    try {
        if (req.method !== 'POST') {
            return reqMethodError(res, 'POST');
        }

        await authGuard(req, res);
        const { desc, slug, parent, replyOnUser } = req.body;
        if (!desc) {
            return errorHandler(res, 400, "Description field cannot be empty.");
        }
        await connectDB();
        const post = await Post.findOne({ slug: slug });
        if (!post) {
            return errorHandler(res, 404, "Post was not found.");
        }
        const comment = new Comment({
            user: req.user._id,
            desc,
            post: post._id,
            parent,
            replyOnUser,
        });
        const data = await comment.save();
        return res.json({success:true, data});
    } catch (error) {
        errorHandler(res, 400, {
            name: error.name,
            message: error.message,
        });
    }
}

