const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: 'https://cdn.pixabay.com/photo/2017/06/13/12/54/profile-2398783_1280.png'
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, 
{
    timestamps: true
}
)

module.exports =  new mongoose.model("User", userSchema)