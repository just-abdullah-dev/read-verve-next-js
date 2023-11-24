import connectDB from "@/config/db";
import errorHandler from "@/middleware/errorHandler";
import { authGuard, writerGuard } from "@/middleware/userMiddlewares";
import Comment from "@/models/comments";
import Post from "@/models/posts";
import { reqMethodError } from "@/utils/reqErrors";


export default async function handler(req, res) {
    try {
        if (req.method !== 'DELETE') {
            return reqMethodError(res, 'DELETE');
        }

        // Middlewares for [ isUserLogged?, isUserWriter ] 
        await authGuard(req, res);
        await writerGuard(req, res);

        await connectDB();
        const {slug} = req.query;
        const post = await Post.findOneAndDelete({ slug: slug });
        if (!post) {
            return errorHandler(res, 404, 'Post was not found.');
        }
        await Comment.deleteMany({ post: post._id });
        return res.json({ 
            success: true, 
            message: "Post has been deleted successfully." });
    } catch (error) {
        errorHandler(res, 400, {
            name: error.name,
            message: error.message,
        });
    }
}
