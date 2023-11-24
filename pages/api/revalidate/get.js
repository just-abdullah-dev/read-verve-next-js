import connectDB from "@/config/db";
import errorHandler from "@/middleware/errorHandler";
import Revalidate from "@/models/revalidate";
import { reqMethodError } from "@/utils/reqErrors";


export default async function handler(req, res) {
    try {
        if (req.method !== 'GET') {
            return reqMethodError(res, 'GET');
        }
        await connectDB();

        const data = await Revalidate.find();
        return res.json({
            success: true,
            data: data[0]
        });
    } catch (error) {
        errorHandler(res, 500, {
            name: error.name,
            message: error.message,
        });
    }
}
