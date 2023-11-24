import connectDB from "@/config/db";
import errorHandler from "@/middleware/errorHandler";
import User from "@/models/user";
import { reqMethodError } from "@/utils/reqErrors";

export default async function handler(req, res){
    try {
        if(req.method !== 'POST'){
            return reqMethodError(res, 'POST');
        }

        const { password, email } = req.body;
        if(!email || !password){
            return errorHandler(res, 400, "Please fill all fields.");
        }
        
        await connectDB();
        //Checking whether user exists or not
        let user = await User.findOne({ email })
        
        if (!user) {
            return errorHandler(res, 400, "Email is not registered.");
        } else {
            if (await user.comparePassword(password)) {
                res.status(201).json({
                    success: true,
                    message: "Logged in successfully.",
                    _id: user._id,
                    avatar: user.avatar,
                    name: user.name,
                    email: user.email,
                    verified: user.verified,
                    admin: user.admin,
                    author: user.author,
                    token: await user.generateJWT(),
                });
            } else {
                return errorHandler(res, 400, "Password is incorrect.");
            }
        }
    } catch (error) {
        errorHandler(res, 400, {
            name: error.name,
            message: error.message,
        });
    }
}