import { useEffect, useState } from 'react'
import moment from 'moment'
import { FaThumbsUp } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { Button, Textarea } from 'flowbite-react'

const Comment = ({ comment, onLike, onEdit, onDelete }) => {
    const [user, setUser] = useState({})
    const [isEditing, setIsEditing] = useState(false)
    const [editedContent, setEditedContent] = useState(comment.content)
    const { currentUser } = useSelector(state => state.user)
    useEffect(() => {
        const getUser = async () => {
            const res = await fetch(`/api/user/${comment.userId}`)
            const data = await res.json()
            setUser(data)
        }
        getUser()
    }, [comment])
    // console.log("user", user)
    const handleEdit = () => {
        setIsEditing(true)
    }
    const handleSave = async () => {
        try {
            const res = await fetch(`/api/comment/editcomment/${comment._id}`, {
                method: "PUT",
                headers: {
                    'content-type': "application/json"
                },
                body: JSON.stringify({
                    content: editedContent
                })
            })
            if (res.ok) {
                setIsEditing(false)
                onEdit(comment, editedContent)
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    return (
        <div className='flex p-4 border-b dark:border-gray-500 text-sm'>
            <div className="flex-shrink-0 mr-3">
                <img className='w-10 h-10 rounded-full bg-gray-200' src={user.profilePicture} alt="profile" />
            </div>
            <div className="flex-1">
                <div className="flex items-center mb-1">
                    <span className='font-bold mr-1 text-xs truncate'>{user ? `@${user.username}` : "anonymous user"}</span>
                    <span className='text-gray-500 text-xs'>{moment(comment.createdAt).fromNow()}</span>
                </div>
                {isEditing ? (
                    <>
                        <Textarea value={editedContent} onChange={e => setEditedContent(e.target.value)} rows='3' />
                        <div className="flex justify-end text-sm gap-2 mt-2">
                            <Button onClick={handleSave} size='sm' gradientDuoTone='purpleToBlue'>Save</Button>
                            <Button outline size='sm' gradientDuoTone='purpleToBlue' onClick={() => setIsEditing(false)}>Cancel</Button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className='text-gray-500 mb-2'>{comment.content}</p>
                        <div className=" flex items-center pt-2 text-xs border-t dakr:border-gray-700 max-w-fit gap-2">
                            <button onClick={() => onLike(comment._id)} className={`hover:text-blue-500 ${currentUser && comment.likes.includes(currentUser._id) ? 'text-blue-500' : 'text-gray-500'}`}>
                                <FaThumbsUp />
                            </button>
                            <p className='text-gray-400'>
                                {
                                    comment.numberOfLikes > 0 && comment.numberOfLikes + " " + (
                                        comment.numberOfLikes === 1 ? 'like' : 'likes'
                                    )
                                }
                            </p>
                            {
                                currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                                    <>
                                        <button onClick={handleEdit} className='text-gray-500 hover:text-blue-500'>
                                            Edit
                                        </button>
                                        <button onClick={() => onDelete(comment._id)} className='text-gray-500 hover:text-blue-500'>
                                            Delete
                                        </button>
                                    </>
                                )
                            }
                        </div>
                    </>
                )}

            </div>
        </div>
    )
}

export default Comment