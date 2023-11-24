import connectDB from "@/config/db";
import errorHandler from "@/middleware/errorHandler";
import Post from "@/models/posts";
import { reqMethodError } from "@/utils/reqErrors";


export default async function handler(req, res) {
    try {
        if (req.method !== 'GET') {
            return reqMethodError(res, 'GET');
        }
        await connectDB();
        const filter = req.query.searchKeyword;

        let where = {};
        if (filter) {
            where.title = { $regex: filter, $options: 'i' }
        }

        const query = Post.find(where);
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 9;
        const skip = (page - 1) * pageSize;
        const total = await Post.find(where).countDocuments();
        const pages = Math.ceil(total / pageSize);
        if (page > pages) {
            return errorHandler(res, 404, `No post was found containing ${filter}`);
        }

        let result = await query.skip(skip).limit(pageSize).populate([
            {
                path: 'user',
                select: ['name', 'avatar', 'verified'],
            },
            {
                path: "category",
                select: ["name", "slug"],
            },
        ]).sort({ updatedAt: -1 });
        if (!result) {
            return errorHandler(res, 404, `No post was found containing \"${filter}\"`)
        }
        // Setting headers info for pagination 
        res.setHeader('x-filter', filter);
        res.setHeader('x-totalcount', JSON.stringify(total));
        res.setHeader('x-currentpage', JSON.stringify(page));
        res.setHeader('x-pagesize', JSON.stringify(pageSize));
        res.setHeader('x-totalpagecount', JSON.stringify(pages));

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
