import connectDB from "@/config/db";
import errorHandler from "@/middleware/errorHandler";
import { adminGuard, authGuard } from "@/middleware/userMiddlewares";
import User from "@/models/user";
import { reqMethodError } from "@/utils/reqErrors";


export default async function handler(req, res) {
    try {
        if (req.method !== 'GET') {
            return reqMethodError(res, 'GET');
        }
        await authGuard(req, res);
        await adminGuard(req, res);
        
        await connectDB();
        const allUsers = await User.find({author: true}).select("-password");

        return res.status(200).json({
            success: true,
            data: allUsers
        });
    } catch (error) {
        errorHandler(res, 400, {
            name: error.name,
            message: error.message,
        });
    }
}
