const { default: errorHandler } = require("@/middleware/errorHandler")

const reqMethodError = (res, name) => {
    return errorHandler(res, 400, `Only ${name} request is allowed.`);
}

module.exports = {
    reqMethodError,
};