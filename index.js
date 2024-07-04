const express = require('express');
const cors = require('cors')
const PORT  = 3000
const app = express()
const bodyparser = require('body-parser')
require('dotenv').config()
require('./db')

const authroute = require('./route/authroute')
const blogroute = require('./route/blogroute')


app.use(cors())

app.use(bodyparser.json())

app.use('/user', authroute)
app.use('/blog', blogroute)
app.get('/', (req, res) => {
    res.send('API is working ')
})






app.listen(PORT, () => {
    console.log('sever is running on port', PORT)
}) 