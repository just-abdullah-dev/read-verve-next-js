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
        const post = await Post.findOne({slug: req.query.slug}).populate([
            
            {
                path: "user",
                select: ["avatar", "name", "verified"],
            },
            {
                path: "category",
                select: ["name", "slug"],
            },
            {
                path:"comments",
                match:{
                    check: true,
                    parent: null
                },
                populate:[
                    {
                        path: "user",
                        select: ["avatar", "name"]
                    },
                    {
                        path: "replies",
                        match: {
                            check : true
                        },
                        populate: [
                            {
                                path: "user",
                                select: ["avatar", "name"],
                            },
                        ],
                    },
                ],
            },
        ]);

        if(!post){
            return errorHandler(res, 404, 'Post was not found.');
        }

        return res.status(200).json({
            success: true,
            data: post
        });
    } catch (error) {
        errorHandler(res, 500, {
            name: error.name,
            message: error.message
        });
    }
}
