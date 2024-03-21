const router = require('express').Router()
const {createComment,getComments, getPostComments, likeComment,editComment, deleteComment} = require('../controllers/comment.controller')
const {verifyToken} = require('../utils/verifyUser')

router.post('/create', verifyToken, createComment)
router.get('/getcomments/:postId', getPostComments)
router.get('/getcomments', verifyToken, getComments)
router.put('/likecomment/:commentId', verifyToken, likeComment)
router.put('/editcomment/:commentId', verifyToken, editComment)
router.delete('/deletecomment/:commentId', verifyToken, deleteComment)

module.exports = router