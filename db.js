require('dotenv').config()
const mongoose = require('mongoose')

const MONGO_URL = process.env.MONGO_URL

mongoose.connect(MONGO_URL, {
    dbName: process.env.DB_NAME
}).then(() => {
    console.log('connected to database sucesfully')
}) .catch(err => console.log(err.message))