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
        
        const filter = req.query.keyword;

        let where = {};
        if (filter) {
            where.name = { $regex: filter, $options: 'i' }
        }

        const query = User.find(where);

        let result = await query.sort({ createdAt: 1 });
        if (!result[0]) {
            return errorHandler(res, 404, `No user was found having name \"${filter}\"`)
        }

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
    errorHandler(res, 400, {
        name: error.name,
        message: error.message,
    });
    }
}
