module.exports.newError = function (message, status) {
    let error = new Error(message);
    error.status = status;
    return error;
}