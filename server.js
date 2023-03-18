//initial imports to start server
const express = require('express')
const app = express()
const path = require('path')
const { logger } = require('./middleware/logger')
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const PORT = process.env.PORT || 3500

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

app.use('/', require('./routes/root'))

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
