const responseHandler = (message, data = {}, status = 200, success = true) => {
    return {
        message,
        success,
        data
    }
} 

module.exports = { 
    responseHandler
}