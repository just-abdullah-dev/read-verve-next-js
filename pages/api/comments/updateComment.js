import connectDB from "@/config/db";
import errorHandler from "@/middleware/errorHandler";
import { authGuard } from "@/middleware/userMiddlewares";
import Comment from "@/models/comments";
import { reqMethodError } from "@/utils/reqErrors";

export default async function handler(req, res) {
    try {
        if (req.method !== 'PUT') {
            return reqMethodError(res, 'PUT');
        }
        await authGuard(req, res);

        const {desc, _id} = req.body;
        if (!desc) {
            return errorHandler(res, 400, "Description field cannot be empty.");
        }
        await connectDB();
        
        const comment = await Comment.findOne({_id});
        if(!comment){
            return errorHandler(res, 404, "Comment was not found.");
        }
        comment.desc = desc || comment.desc;
        const updatedComment = await comment.save();
        return res.json({success: true, updatedComment});
    } catch (error) {
        errorHandler(res, 400, {
            name: error.name,
            message: error.message,
        });
    }
}

