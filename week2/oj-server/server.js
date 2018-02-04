const express = require('express')
const app = express()
const restRouter = require('./routes/rest')

// app.get('/', (req, res) => res.send('Hello World! heyhey'))
app.use('/app/v1', restRouter)

app.listen(3000, () => console.log('Example app listening on port 3000!'))