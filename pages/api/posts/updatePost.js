import connectDB from "@/config/db";
import errorHandler from "@/middleware/errorHandler";
import { authGuard, writerGuard } from "@/middleware/userMiddlewares";
import Post from "@/models/posts";
import { reqMethodError } from "@/utils/reqErrors";

export default async function handler(req, res) {
    try {
        if (req.method !== 'PUT') {
            return reqMethodError(res, 'PUT');
        }
        await authGuard(req, res);
        await writerGuard(req, res);
        await connectDB();
        const post = await Post.findOne({ slug: req.query.slug });

        if (!post) {
            return errorHandler(res, 404, 'Post was not found.');
        }
        const { title, caption, slug, body, tags, category, photo, publish } = req.body;

        if (slug && slug !== post.slug) {
            const checkPost = await Post.findOne({ slug: slug });
            if (checkPost) {
                return errorHandler(res, 400, 'Slug already exist. Slug should be unique.');
            }
        }

        post.title = title || post.title;
        post.caption = caption || post.caption;
        post.slug = slug || post.slug;
        post.body = body || post.body;
        post.photo = photo;
        post.tags = tags || post.tags;
        post.category = category || post.category;
        if(publish === 'yes' && !post.publish){
            post.publish = true;
        }else if(publish === 'no' && post.publish){
            post.publish = false;
        }


        const updatedPost = await post.save();
        return res.json(updatedPost);

    } catch (error) {
        errorHandler(res, 500, {
            name: error.name,
            message: error.message
        });
    }
}