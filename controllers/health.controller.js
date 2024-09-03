const healthCheck = (req, res, next) => {
    res.send({ message: "Server is running fine."})
}

module.exports = { healthCheck }