const express = require('express')
const mongoose = require("mongoose")
const userRoutes = require('./routes/user.routes')
const authRoutes = require('./routes/auth.routes')
const postRoutes = require('./routes/post.routes')
const commentRoutes = require('./routes/comment.routes')
const cookieParser = require('cookie-parser')
const path = require('path')
require('dotenv').config()

mongoose.connect(process.env.MONGO)
.then(() => {
    console.log("db connected")
})
.catch(err => {
    console.log(err)
})

const app = express()

//for production -- it will contain the root of folder
const __dirname2 = path.resolve()

console.log(__dirname2)

app.use(express.json())
app.use(cookieParser())


app.listen(5000, () => {
    console.log("server running on port 5000")
})

app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/post', postRoutes)
app.use('/api/comment', commentRoutes)

//for production
app.use(express.static(path.join(__dirname2, '/client/dist')))
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname2, 'client', 'dist', 'index.html'))
}) // other than api routes all routes will serve index.html means frontend


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const msg = err.message || 'Internal server error!'
    res.status(statusCode).json({
        success:false,
        statusCode,
        msg
    })
})