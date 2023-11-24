import connectDB from "@/config/db";
import errorHandler from "@/middleware/errorHandler";
import { reqMethodError } from "@/utils/reqErrors";
const User = require("@/models/user");

export default async function handler(req, res){
    try {
        if(req.method !== 'POST'){
            return reqMethodError(res, 'POST');
        }

        const { name, password, email } = req.body;
        if(!name || !email || !password){
            return errorHandler(res, 400, "Please fill all fields.");
        }
        
        await connectDB();
        //Checking whether user exists or not
        let user = await User.findOne({ email })
        if (user) {
            return errorHandler(res, 400, "User is already registered.")
        }

        // Creating a new user
        user = await User.create({
            name,
            email,
            password,
        });

        return res.status(201).json({
            _id: user._id,
            avatar: user.avatar,
            name: user.name,
            email: user.email,
            verified: user.verified,
            admin: user.admin,
            author: user.author,
            token: await user.generateJWT(),
        });
    } catch (error) {
        errorHandler(res, 400, {
            name: error.name,
            message: error.message,
        });
    }
}





