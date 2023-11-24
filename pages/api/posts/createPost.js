import connectDB from "@/config/db";
import errorHandler from "@/middleware/errorHandler";
import { authGuard, writerGuard } from "@/middleware/userMiddlewares";
import Post from "@/models/posts";
import { reqMethodError } from "@/utils/reqErrors";
const { v4: uuidv4 } = require('uuid');


export default async function handler(req, res) {
    try {
        if (req.method !== 'POST') {
            return reqMethodError(res, 'POST');
        }

        await authGuard(req, res);
        await writerGuard(req, res);

        const { title, caption } = req.body;
        if (!title) {
            return errorHandler(res, 400, "Title field must be present.");
        }
        await connectDB();

        const post = new Post({
            title: title || "Sample Title",
            caption: caption || "Sample Caption",
            slug: uuidv4(),
            body: {
                type: 'doc',
                content: []
            },
            photo: "",
            user: req.user._id,
        });
        const createdPost = await post.save();
        return res.json(createdPost);
    } catch (error) {
        errorHandler(res, 400, {
            name: error.name,
            message: error.message,
        });
    }
}
