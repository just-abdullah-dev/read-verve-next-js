import connectDB from "@/config/db";
import errorHandler from "@/middleware/errorHandler";
import Revalidate from "@/models/revalidate";
import { reqMethodError } from "@/utils/reqErrors";

export default async function handler(req, res) {
    try {
        if (req.method !== 'PUT') {
            return reqMethodError(res, 'PUT');
        }
        await connectDB();
        const data = await Revalidate.findOne({name: 'revalidate'});
        if(data.revalidate){
            data.revalidate = false;
        }else{
            data.revalidate = true;
        }
    
        const updated = await data.save();
        return res.json({success: true, data: updated});

    } catch (error) {
        errorHandler(res, 500, {
            name: error.name,
            message: error.message
        });
    }
}