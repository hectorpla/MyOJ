const express = require('express')
const path = require('path')
const http = require('http')

const restRouter = require('./routes/rest')

const app = express()

// web socket initialization
const server = http.Server(app) // add a wraper to our app to listen through socket
const io = require('socket.io')(server)
var editorSocketService = require('./services/editorSocketService')(io)

// DB
const mongoose = require('mongoose')
mongoose.connect('mongodb://user:password@ds123698.mlab.com:23698/oj-problems', 
    { connectTimeoutMS: 30000 })
    .then(res => console.log('connected to MongoDB successfully'))
    .catch(err => {
        console.log('connection to mlab failed', JSON.stringify(err))
    })

// RESTful API
app.use('/app/v1', restRouter)

// default GET
const static_path = path.join(__dirname, '../public')

app.use(express.static(static_path))

app.use((req, res) => {
    res.sendFile('index.html', {root: static_path})
})

// app.listen(3000, () => console.log('OJ-server listening on port 3000!'))
server.listen(3000, () => console.log('OJ-server listening on port 3000!'))

