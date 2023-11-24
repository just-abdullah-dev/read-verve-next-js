import connectDB from "@/config/db";
import errorHandler from "@/middleware/errorHandler";
import { adminGuard, authGuard } from "@/middleware/userMiddlewares";
import User from "@/models/user";
import { reqMethodError } from "@/utils/reqErrors";

export default async function handler(req, res) {
    try {
        if (req.method !== 'PUT') {
            return reqMethodError(res, 'PUT');
        }
        await authGuard(req, res);
        await adminGuard(req, res);

        await connectDB();
        const {userID} = req.query;
        const user = await User.findOne({_id: userID});

        if (!user) {
            return errorHandler(res, 404, 'User was not found.');
        }
        const { admin, author, verified } = req.body;

        if(admin === 'yes' && !user.admin){
            user.admin = true;
        }else if(admin === 'no' && user.admin){
            user.admin = false;
        }

        if(author === 'yes' && !user.author){
            user.author = true;
        }else if(author === 'no' && user.author){
            user.author = false;
        }

        if(verified === 'yes' && !user.verified){
            user.verified = true;
        }else if(verified === 'no' && user.verified){
            user.verified = false;
        }

        const updatedUser = await user.save();
        return res.json({
            success: true,
            data: updatedUser
        });

    } catch (error) {
    errorHandler(res, 400, {
        name: error.name,
        message: error.message,
    });
    }
}