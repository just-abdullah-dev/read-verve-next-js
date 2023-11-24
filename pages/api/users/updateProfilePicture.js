import connectDB from "@/config/db";
import errorHandler from "@/middleware/errorHandler";
import { authGuard } from "@/middleware/userMiddlewares";
import User from "@/models/user";
import { reqMethodError } from "@/utils/reqErrors";
const uploadPictureMiddleware = require("@/middleware/uploadPictureMiddleware");
const fileRemover = require("@/utils/fileRemover");

export default async function handler(req, res){
    try {
        if(req.method !== 'PUT'){
            return reqMethodError(res, 'PUT');
        }
        // return res.status(200).json({
        //     message: "kia kiya jy...?"
        // })

        await authGuard(req, res);
        await connectDB();
        uploadPictureMiddleware.single("profilePicture")(req, res, async function (err) {
            if (err) {
                return errorHandler(res, err.statusCode, err.message);
            } else {
                //Everything went well
                if (req.file) {
                    let prevFilename;
                    let updatedUser = await User.findById(req.user?._id);
                    prevFilename = updatedUser.avatar;
                    if (prevFilename) {
                        //Removing previuos file
                        fileRemover(prevFilename);
                    }
                    updatedUser.avatar = req.file.filename;
                    await updatedUser.save();
                    res.json({
                        _id: updatedUser._id,
                        avatar: updatedUser.avatar,
                        name: updatedUser.name,
                        email: updatedUser.email,
                        verified: updatedUser.verified,
                        admin: updatedUser.admin,
                        author: updatedUser.author,
                        token: await updatedUser.generateJWT(),
                    })
                } else {
                    let filename;
                    let updatedUser = await User.findById(req.user._id);
                    filename = updatedUser.avatar;
                    updatedUser.avatar = "";
                    await updatedUser.save();
                    fileRemover(filename);
                    res.json({
                        _id: updatedUser._id,
                        avatar: updatedUser.avatar,
                        name: updatedUser.name,
                        email: updatedUser.email,
                        verified: updatedUser.verified,
                        admin: updatedUser.admin,
                        author: updatedUser.author,
                        token: await updatedUser.generateJWT(),
                    });
                }
            }
        });
    } catch (error) {
        errorHandler(res, 400, {
            name: error.name,
            message: error.message,
        });
    }
}
/*

import errorHandler from "@/middleware/errorHandler";
import { authGuard } from "@/middleware/userMiddlewares";
import User from "@/models/user";
import { reqMethodError } from "@/utils/reqErrors";
const uploadPictureMiddleware = require("@/middleware/uploadPictureMiddleware");
const fileRemover = require("@/utils/fileRemover");

export default async function handler(req, res) {
    try {
        if (req.method !== 'PUT') {
            return reqMethodError(res, 'PUT');
        }

        await authGuard(req, res);

        // Upload the profile picture
        uploadPictureMiddleware.single("profilePicture")(req, res, async function (err) {
            if (err) {
                return errorHandler(res, err.statusCode, err.message);
            }

            // Everything went well
            if (req.file) {
                let prevFilename;
                let updatedUser = await User.findById(req.user?._id);
                
                if (!updatedUser) {
                    return errorHandler(res, 404, "User not found");
                }

                prevFilename = updatedUser.avatar;
                
                if (prevFilename) {
                    // Removing previous file
                    fileRemover(prevFilename);
                }

                updatedUser.avatar = req.file.filename;
                await updatedUser.save();
                res.json({
                    _id: updatedUser._id,
                    avatar: updatedUser.avatar,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    verified: updatedUser.verified,
                    admin: updatedUser.admin,
                    author: updatedUser.author,
                    token: await updatedUser.generateJWT(),
                });
            } else {
                let filename;
                let updatedUser = await User.findById(req.user?._id);
                
                if (!updatedUser) {
                    return errorHandler(res, 404, "User not found");
                }

                filename = updatedUser.avatar;
                updatedUser.avatar = "";
                await updatedUser.save();
                fileRemover(filename);
                res.json({
                    _id: updatedUser._id,
                    avatar: updatedUser.avatar,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    verified: updatedUser.verified,
                    admin: updatedUser.admin,
                    author: updatedUser.author,
                    token: await updatedUser.generateJWT(),
                });
            }
        });
    } catch (error) {
        errorHandler(res, 400, {
            name: error.name,
            message: error.message,
        });
    }
}
*/
