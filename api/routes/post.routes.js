const router = require('express').Router()
const {verifyToken} = require('../utils/verifyUser')
const {createPost, getPosts, deletePost, updatePost} = require('../controllers/post.controller')

router.post('/create', verifyToken, createPost)
router.get('/getposts', getPosts)
router.delete('/deletepost/:postId/:userId', verifyToken, deletePost)
router.put('/updatepost/:postId/:userId', verifyToken, updatePost)

module.exports = router