//dependencies for logging requests made
const { format } = require('date-fns')
const { v4: uuid } = require('uuid')
const fs = require('fs')
const fsPromises = require('fs').promises
const path = require('path')

//helper function for middleware passes message and logFileName
const logEvents = async (message, logFileName) => {
    //two variables; first to set the date time - second to log the item with dateTime, unique id and message
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`

    try {
        //if directory doesnt exist create a path to the logs folder and create a directory with the log in it
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) { 
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }
        //if it does exist then append the file to the log eith the logFileName
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logFileName), logItem)
    } catch (err) {
        console.log(err)
    }
}

//actual middleware
const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log')
    console.log(`${req.method} ${req.path}`)
    next();
}

module.exports = { logEvents, logger }