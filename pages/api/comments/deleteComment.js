import connectDB from "@/config/db";
import errorHandler from "@/middleware/errorHandler";
import { authGuard } from "@/middleware/userMiddlewares";
import Comment from "@/models/comments";
import { reqMethodError } from "@/utils/reqErrors";


export default async function handler(req, res) {
    try {
        if (req.method !== 'DELETE') {
            return reqMethodError(res, 'DELETE');
        }
        await authGuard(req, res);
        await connectDB();        
        const _id = req.body._id;
        const comment = await Comment.findByIdAndDelete(_id);
        await Comment.deleteMany({parent: comment._id})
        return res.json({message:"Comment has been deleted successfully."});
    } catch (error) {
        errorHandler(res, 400, {
            name: error.name,
            message: error.message,
        });
    }
}

