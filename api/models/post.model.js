const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    userId: {
        type: String, 
        required: true
    },
    content: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        default: 'https://images.pexels.com/photos/1591056/pexels-photo-1591056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    category: {
        type: String,
        default: 'uncategorized'
    },
    slug: {
        type:String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Post', postSchema)