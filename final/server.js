/* Dependencies */

// 1. Express
const express = require('express')
const app = express()
// 2. Cors
const cors = require('cors')
// 3. Dotenv
const dotenv = require('dotenv')
dotenv.config()
// 5. Mongoose
const mongoose = require('mongoose')
// 6. Routes
const authRoutes = require('../final/routes/auth')
const homeRoutes = require('../final/routes/home')

/* Global Middlewares */

// EJS Application
app.set('view engine', 'ejs')
// Cors
app.use(cors())
// JSON body-parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// Static files (Images, CSS and JavaScript)
app.use(express.static('web'))

/* Routes Middleware */

// AUTH Routes
app.use('/auth', authRoutes)
// HOME Routes
app.use('/', homeRoutes)

/* Database Connection & Server Startup */

mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }
)
// if connection SUCCESS, then START the Server
.then(() => {
    console.log('Successfully connected to database!')
    app.listen(process.env.PORT || 3000, console.log('Server is up and running at PORT 3000!'))
})
// if connection UNSUCCESSFUL, then DON'T START the Server
.catch(err => {
    console.log(err)
})