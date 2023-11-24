import connectDB from "@/config/db";
import errorHandler from "@/middleware/errorHandler";
import { adminGuard, authGuard, writerGuard } from "@/middleware/userMiddlewares";
import Category from "@/models/category";
import Post from "@/models/posts";
import { reqMethodError } from "@/utils/reqErrors";

export default async function handler(req, res) {
    try {
        if (req.method !== 'PUT') {
            return reqMethodError(res, 'PUT');
        }
        await authGuard(req, res);
        await adminGuard(req, res);

        await connectDB();
        const {_id, name, slug} = req.body;

        let category = await Category.findOne({ name: name })
        if (category){
            return errorHandler(res, 400, "Category already exist.")
        }
        category = await Category.findByIdAndUpdate(
            _id,
            { $set: { name: name, slug: slug } },
            { new: true }
        )

        if (!category) {
            return errorHandler(res, 404, 'Category was not found.');
        }

        const updatedCategory = await category.save();
        return res.json(updatedCategory);

    } catch (error) {
        errorHandler(res, 500, {
            name: error.name,
            message: error.message
        });
    }
}