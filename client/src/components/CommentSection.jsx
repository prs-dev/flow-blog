import { Alert, Button, Modal, TextInput, Textarea } from "flowbite-react"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import Comment from './Comment'
import { HiOutlineExclamationCircle } from "react-icons/hi"

const CommentSection = ({postId}) => {
    const {currentUser} = useSelector(state => state.user)
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState([])
    const [commentErr, setCommentErr] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [commentId, setCommentId] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchComments = async() => {
            try {
                const res = await fetch(`/api/comment/getcomments/${postId}`)
                if(res.ok) {
                    const data = await res.json()
                    console.log(data)
                    setComments(data)
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        fetchComments()
    }, [postId])

    const handleSubmit = async(e) => {
        e.preventDefault()
        if(comment.length > 200){
            return
        }
        try {
            const res = await fetch('/api/comment/create', {
                method: "POST",
                headers: {
                    'content-type': "application/json"
                },
                body: JSON.stringify({content: comment, postId, userId: currentUser._id})
            })
            const data = await res.json()
            if(res.ok) {
                setComment('')
                setCommentErr(null)
                setComments([data, ...comments])
            }
        } catch (error) {
            setCommentErr(error.message)
        }
        
    }

    const handleLike = async(commentId) => {
        try {
            if (!currentUser) {
                navigate('/sign-in')
                return
            }
            const res = await fetch(`/api/comment/likecomment/${commentId}`, {
                method: "PUT"
            })
            if(res.ok) {
                const data = await res.json()
                // console.log("one", comments)
                setComments(comments.map(cmt => 
                    cmt._id === commentId ? {
                        ...cmt,
                        likes: data.likes,
                        numberOfLikes: data.likes.length
                    } : cmt ))
                // setComments(comments.map((comment) => 
                //     comment._id === commentId ? {
                //         ...comment,
                //         likes: data.likes,
                //         numberOfLikes: data.likes.length
                //     } : comment
                // ))
                // console.log("test", data, comments)
            }
            // console.log("test", comments)
        } catch (error) {
            console.log(error.message)
        }
        // console.log('commentid', commentId)
    } 
    // console.log("comments", comments)

    const handleEdit = (comment, editedContent) => {
        setComments(comments.map(c => c._id === comment._id ? {...c, content: editedContent} : c))
    }

    const handleDelete = async() => {
        try {
            if(!currentUser) return navigate('/sign-in')
            const res = await fetch(`/api/comment/deletecomment/${commentId}`, {
                method: "DELETE"
            })
            if(res.ok) {
                const data = await res.json()
                setComments(comments.filter(c => c._id !== commentId))
                setShowModal(false)
            }
        } catch (error) {
            console.log(error.message)
        }
    }

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
        {currentUser ? (
            <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
                <p>Signed in as:</p>
                <img className="w-5 h-5 object-cover rounded-full" src={currentUser.profilePicture} alt="profile" />
                <Link to={'/dashboard?tab=profile'} className="text-xs text-cyan-600 hover:underline">
                    @{currentUser.username}
                </Link>
            </div>
        ) : (
            <div className="text-sm my-2">
                You must be signed in to comment!
                <Link className="text-teal-500 hover:underline ml-1" to='/sign-in'>Sign In</Link>
            </div>
        )}
        {currentUser && (
            <form onSubmit={handleSubmit} className="border border-teal-500 rounded-md p-3">
                <Textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Add a Comment" rows='3' maxLength='200' />
                <div className="flex items-center justify-between mt-3">
                    <p className="text-gray-500 text-xs">{200- comment.length} characters left</p>
                    <Button type="submit" gradientDuoTone='purpleToBlue' outline>Submit</Button>
                </div>
            </form>
        )}
        {
            commentErr && (
                <Alert color='failure'>{commentErr}</Alert>
            )
        }
        {comments?.length === 0 ? (
            <p>No Comments yet!</p>
        ) : (
            <>
            <div className="text-sm my-5 flex items-center gap-1">
                <p>Comments</p>
                <div className="border border-gray-500 py-1 px-2 rounded-sm">
                    <p>{comments?.length}</p>
                </div>
            </div>
            {comments?.map(cmt => (
                <Comment comment={cmt} onLike={handleLike} onEdit={handleEdit} onDelete={(id) => {
                    setShowModal(true)
                    setCommentId(id)
                }}/>
            ))}
            </>
        )}
        <Modal popup size='md' show={showModal} onClose={() => setShowModal(false)}>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure to delete the comment ?</h3>
                        <div className="flex justify-center gap-4">
                            <Button color='failure' onClick={handleDelete}>Yes</Button>
                            <Button color='gray' onClick={() => setShowModal(false)}>No</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
    </div>
  )
}

export default CommentSection