const User = require('@/models/user');
const { verify } = require('jsonwebtoken');
const { default: errorHandler } = require('./errorHandler');

const authGuard = async (req, res) => {
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            const token = req.headers.authorization.split(" ")[1];
            const { id } = verify(token, process.env.JWT_SECRET);
            const data = await User.findById(id).select("-password");
            if(!data){
                return errorHandler(res, 400, "This account has been identified in the blacklist.");
            }
            req.user = data;
        } catch(error) {
            return errorHandler(res, 400, "Invalid Token");
        }
    }else{
        return errorHandler(res, 400, "Invalid Token");
    }
}

const adminGuard = async (req, res) => {
    if(req.user && req.user.admin){
    }else{
        return errorHandler(res, 400, "You are not an admin.");
    }
}

const writerGuard = async (req, res) => {
    if(req.user && req.user.author){
    }else{
        return errorHandler(res, 400, "Your account is not authorized as a author.");
    }
}

module.exports = {
    authGuard,
    adminGuard,
    writerGuard,
}