import connectDB from "@/config/db";
import errorHandler from "@/middleware/errorHandler";
import Category from "@/models/category";
import { reqMethodError } from "@/utils/reqErrors";


export default async function handler(req, res) {
    try {
        if (req.method !== 'GET') {
            return reqMethodError(res, 'GET');
        }
        await connectDB();
        const filter = req.query.keyword;
        let where = {};
        if (filter) {
            where.name = { $regex: filter, $options: 'i' }
        }
        const query = Category.find(where);
        let result = await query.sort({ updatedAt: 1 });
        if (!result[0]) {
            return errorHandler(res, 404, `No category was found having name \"${filter}\"`)
        }
        return res.json({
            success: true,
            data: result
        });
    } catch (error) {
        errorHandler(res, 500, {
            name: error.name,
            message: error.message,
        });
    }
}
