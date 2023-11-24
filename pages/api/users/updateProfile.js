import connectDB from "@/config/db";
import errorHandler from "@/middleware/errorHandler";
import { authGuard } from "@/middleware/userMiddlewares";
import User from "@/models/user";
import { reqMethodError } from "@/utils/reqErrors";

export default async function handler(req, res) {
    try {
        if (req.method !== 'PUT') {
            return reqMethodError(res, 'PUT');
        }
        await connectDB();
        await authGuard(req, res);
        let user = await User.findById(req.user._id);
        if (!user) {
            return errorHandler(res, 404, "User not found.");
        }
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.avatar = req.body.avatar || user.avatar;
        if (req.body.password && req.body.password.length < 6) {
            return errorHandler(res, 400, "Password length must be 6 or more characters.");
        } else if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();
        res.json({
            success: true,
            _id: updatedUser._id,
            avatar: updatedUser.avatar,
            name: updatedUser.name,
            email: updatedUser.email,
            verified: updatedUser.verified,
            admin: updatedUser.admin,
            author: updatedUser.author,
            token: await updatedUser.generateJWT(),
        });
    } catch (error) {
        errorHandler(res, 400, {
            name: error.name,
            message: error.message,
        });
    }
}