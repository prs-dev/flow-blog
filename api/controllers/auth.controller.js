const User = require('../models/user.model')
const bcrypt = require('bcryptjs')
const { errorHandler } = require('../utils/error')
const jwt = require("jsonwebtoken")

const signup = async(req, res, next) => {
    const {username, email, password} = req.body

    if(!username || !email || !password || username === '' || email === '' || password === '') {
        // return res.status(400).json({msg: "All fields are required!"})
        next(errorHandler(400, "All fields are required!!"))
        return
    }

    console.log('got here')

    const hashedPassword = bcrypt.hashSync(password, 10)

    const newUser = new User({
        username,
        email,
        password: hashedPassword
    })

    try {
        await newUser.save()
        res.json({msg: "Register success"})
    } catch (error) {
        // res.status(500).json({msg: error.message})
        next(error)
    }

    
}

const signin = async(req, res, next) => {
    const {email, password} = req.body

    if(!email || !password || email === '' || password === '') {
        next(errorHandler(400, 'All fields are required!!'))
        return
    }

    try {
        const validUser = await User.findOne({email})
        if(!validUser) return next(errorHandler(404, "User not found!"))
        const validPassword = bcrypt.compareSync(password, validUser.password)
        if(!validPassword) return next(errorHandler(400, "Invalid password!!"))
        const token = jwt.sign({
            id: validUser._id, isAdmin: validUser.isAdmin
        }, process.env.SECRET)
        const {password:pass, ...rest} = validUser._doc
        console.log(rest)
        res.status(200).cookie('access_token', token, {httpOnly: true}).json(rest)
    } catch (error) {
        next(error)
    }
}

const google = async (req, res, next) => {
    const {email, name, googlePhotoUrl} = req.body
    try {
        const user = await User.findOne({email})
        if(user) {
            const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.SECRET)
            const {password, ...rest} = user._doc
            res.status(200).cookie('access_token', token, {
                httpOnly: true
            }).json(rest)
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const hashedPassword = bcrypt.hashSync(generatedPassword, 10)
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-3),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl
            })
            await newUser.save()
            const token = jwt.sign({id: newUser._id, isAdmin: newUser.isAdmin}, process.env.SECRET)
            const {password, ...rest} = newUser._doc
            res.status(200).cookie('access_token', token, {
                httpOnly: true
            }).json(rest)
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    signup, signin, google
}