//required helper function from logger
const { logEvents } = require('./logger')

//overwrite default express error handling
const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
    console.log(err.stack)

    //if the status has a code return the code if not return 500 service error
    const status = res.statusCode ? res.statusCode : 500 //Server error

    res.status(status)

    res.json({ message: err.message })
}

module.exports = errorHandler