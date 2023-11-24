import connectDB from "@/config/db";
import errorHandler from "@/middleware/errorHandler";
import { adminGuard, authGuard } from "@/middleware/userMiddlewares";
import Category from "@/models/category";
import { reqMethodError } from "@/utils/reqErrors";
import Post from '@/models/posts';

export default async function handler(req, res) {
    try {
        if (req.method !== 'DELETE') {
            return reqMethodError(res, 'DELETE');
        }

        // Middlewares for [ isUserLogged?, isUserAdmin ] 
        await authGuard(req, res);
        await adminGuard(req, res);

        await connectDB();
        const {_id} = req.query;
        const category = await Category.findOneAndDelete({ _id: _id });
        if (!category) {
            return errorHandler(res, 404, 'Category was not found.');
        }
        await Post.updateMany(
            {category: _id},
            {$set: {category: null}}
        )
        return res.json({ 
            success: true, 
            message: "Category has been deleted successfully." });
    } catch (error) {
        errorHandler(res, 400, {
            name: error.name,
            message: error.message,
        });
    }
}
