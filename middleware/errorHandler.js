export default function errorHandler (res, statusCode, message){
    return res.status(statusCode).json({
        success: false,
        message
    })
}