import connectDB from "@/config/db";
import errorHandler from "@/middleware/errorHandler";
import { authGuard } from "@/middleware/userMiddlewares";
import User from "@/models/user";
import { reqMethodError } from "@/utils/reqErrors";

export default async function handler(req, res) {
    try {
        if(req.method !== 'GET'){
            return reqMethodError(res, 'GET');
        }
        await authGuard(req, res);
        await connectDB();
        const user = await User.findById(req.user._id);
        if (user) {
            res.status(201).json({
                success: true,
                _id: user._id,
                avatar: user.avatar,
                name: user.name,
                email: user.email,
                verified: user.verified,
                author: user.author,
                admin: user.admin,
            })
        } else {
            return errorHandler(res, 404, "User not found.");
        }
    } catch (error) {
        errorHandler(res, 400, {
            name: error.name,
            message: error.message,
        });
    }
}