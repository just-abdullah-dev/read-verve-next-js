import connectDB from "@/config/db";
import errorHandler from "@/middleware/errorHandler";
import { adminGuard, authGuard } from "@/middleware/userMiddlewares";
import Blacklist from "@/models/blacklist";
import Comment from "@/models/comments";
import Post from "@/models/posts";
import User from "@/models/user";
import { reqMethodError } from "@/utils/reqErrors";


export default async function handler(req, res) {
    try {
        if (req.method !== 'DELETE') {
            return reqMethodError(res, 'DELETE');
        }

        await connectDB();
        
        // Middlewares for [ isUserLogged?, isUserWriter ] 
        await authGuard(req, res);
        await adminGuard(req, res);

        const {userID} = req.query;
        const user = await User.findByIdAndDelete(userID);
        if (!user) {
            return errorHandler(res, 404, 'User was not found.');
        }
        await Post.deleteMany({ user: user._id });

        // finding all main comments of users and deleting all those other comments which are replied comment of this user comments.
        const userMainComments = await Comment.find({user: user._id, parent: null});
        userMainComments.map(async(comment)=>{
            await Comment.deleteMany({parent: comment._id});
        })

        // and then deleting all comments of users whether it is main or replied comment
        await Comment.deleteMany({user: user._id});

        // Adding in blacklist
        const blacklist = await Blacklist.create({
            name: user.name,
            email: user.email,
            token: req.headers.authorization.split(" ")[1],
        });

        return res.json({ 
            success: true, 
            message: `${user.name} has been blacklisted, and all associated data has been deleted.`,
            data: blacklist
        });
    } catch (error) {
        errorHandler(res, 400, {
            name: error.name,
            message: error.message,
        });
    }
}
