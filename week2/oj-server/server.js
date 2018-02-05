const express = require('express')
const app = express()
const restRouter = require('./routes/rest')

// DB
const mongoose = require('mongoose')
mongoose.connect('mongodb://user:password@ds123698.mlab.com:23698/oj-problems')  

// app.get('/', (req, res) => res.send('Hello World! heyhey'))
app.use('/app/v1', restRouter)

app.listen(3000, () => console.log('OJ-server listening on port 3000!'))