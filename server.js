//initial imports to start server
require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const { logger, logEvents } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500

console.log(process.env.NODE_ENV)

//function to connect to MongoDB
connectDB()

//custom middleware operations to log requests into the log folder
app.use(logger)

//allow other public domains to request API data from our database
app.use(cors(corsOptions))

//allows app to recieve and parse json data built in middleware
app.use(express.json())

//third party middleware allows our mern app to parse cookie data
app.use(cookieParser())

//use path to listen for the root route telling express where to find static files for this app
app.use('/', express.static(path.join(__dirname, 'public')))

//route for the techNotes homepage rendering initial html template
app.use('/', require('./routes/root'))
//rendering routes for the User data model
app.use('/users', require('./routes/userRoutes'))

//catch all at the end redirecting user to the 404 page if route is not found
app.all('*', (req, res) => {
    res.status(404)
    //examine the headers to choose what type of code res to send
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: "404 Not found"})
    } else {
        res.type('txt').send('404 Not found')
    }
})

//Custom middleware for error handling / logging
app.use(errorHandler)

//listen for connection to both server and database
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

//log any errors that may occur in mongo connection into mongoErrLog
mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})
