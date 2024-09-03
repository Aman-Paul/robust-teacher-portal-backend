const responseHandler = (message, data = {}, status = 200) => {
    return {
        message,
        status,
        data
    }
} 

module.exports = { 
    responseHandler
}