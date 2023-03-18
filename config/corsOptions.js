//import allowed origins array from file
const allowedOrigins = require('./allowedOrigins')

//syntax for third party middleware
const corsOptions = {
    //allow only cors listed in the array or no origins like (insomnia, postman) to test
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions