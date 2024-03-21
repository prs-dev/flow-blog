const jwt = require('jsonwebtoken')
const {errorHandler} = require('./error')

const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token
    console.log(token)
    if(!token) {
        return next(errorHandler(401, 'Unauthorized'))
    }
    jwt.verify(token, process.env.SECRET, (err, user) => {
        if(err) {
            console.log(err, 'reached')
            return next(errorHandler(401, 'Unauthorized'))
        }
        req.user = user
        next()
    })
}


module.exports = {
    verifyToken
}