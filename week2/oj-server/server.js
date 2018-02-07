const express = require('express')
const app = express()
const restRouter = require('./routes/rest')
const path = require('path')

const static_path = path.join(__dirname, '../public')

// DB
const mongoose = require('mongoose')
mongoose.connect('mongodb://user:password@ds123698.mlab.com:23698/oj-problems')  

// app.get('/', (req, res) => res.send('Hello World! heyhey'))
app.use('/app/v1', restRouter)

app.use(express.static(static_path))

app.use((req, res) => {
    res.sendFile('index.html', {root: static_path})
})

app.listen(3000, () => console.log('OJ-server listening on port 3000!'))

