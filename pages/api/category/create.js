import connectDB from "@/config/db";
import errorHandler from "@/middleware/errorHandler";
import { adminGuard, authGuard } from "@/middleware/userMiddlewares";
import Category from "@/models/category";
import { reqMethodError } from "@/utils/reqErrors";


export default async function handler(req, res) {
    try {
        if (req.method !== 'POST') {
            return reqMethodError(res, 'POST');
        }

        await authGuard(req, res);
        await adminGuard(req, res);

        const { name, slug } = req.body;
        if (!name) {
            return errorHandler(res, 400, "Name field must be present.");
        }
        if (!slug) {
            return errorHandler(res, 400, "Slug field must be present.");
        }
        await connectDB();
        
        let category = await Category.findOne({ name: name })
        if (category){
            return errorHandler(res, 400, "Category already exist.")
        }

        category = new Category({
            name: name,
            slug: slug
        });
        const createdCategory = await category.save();
        return res.json({success: true, message:`${name} category has been created.`});
    } catch (error) {
        errorHandler(res, 400, {
            name: error.name,
            message: error.message,
        });
    }
}
