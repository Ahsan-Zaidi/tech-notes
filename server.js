//initial imports to start server
const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3500

//use path to listen for the root route telling express where to find static files for this app
app.use('/', express.static(path.join(__dirname, '/public')))

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

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
