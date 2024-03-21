import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Table } from 'flowbite-react'
import { Link } from 'react-router-dom'
import { Button, Modal } from 'flowbite-react'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { FaTimes, FaCheck } from 'react-icons/fa'


const DashComments = () => {
    const { currentUser } = useSelector(state => state.user)
    const [showMore, setShowMore] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [commentId, setCommentId] = useState(null)
    const [comments, setComments] = useState([])
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`/api/comment/getcomments`)
                const data = await res.json()
                if (res.ok) {
                    setComments(data.comments)
                    if (data.comments.length < 9) {
                        setShowMore(false)
                    }
                }
            } catch (error) {
                console.log(error.message)
            }
        }
        if (currentUser.isAdmin) {
            fetchComments()
        }
    }, [currentUser._id])

    const handleShowMore = async () => {
        const startIndex = comments.length
        try {
            const res = await fetch(`api/comment/getcomments&startIndex=${startIndex}`)
            const data = await res.json()
            if (res.ok) {
                setUsers(prev => [...prev, ...data.comments])
                if (data.comments.length < 9) {
                    setShowMore(false)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleDelete = async () => {
        setShowModal(false)
        try {
            const res = await fetch(`/api/comment/deletecomment/${commentId}`, {
                method: "DELETE"
            })
            const data = await res.json()
            if (!res.ok) {
                console.log(data.msg)
            } else {
                setComments(prev => prev.filter(c => c._id !== commentId))
                setShowModal(false)
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    return (
        <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-800'>
            {
                currentUser.isAdmin && comments.length > 0 ? (
                    <>
                        <Table hoverable className='shadow-md'>
                            <Table.Head>
                                <Table.HeadCell>Date Updated</Table.HeadCell>
                                <Table.HeadCell>Content</Table.HeadCell>
                                <Table.HeadCell>Number of likes</Table.HeadCell>
                                <Table.HeadCell>PostId</Table.HeadCell>
                                <Table.HeadCell>UserId</Table.HeadCell>
                                <Table.HeadCell>Delete</Table.HeadCell>
                            </Table.Head>
                            {comments.map(comment => (
                                <Table.Body className='divide-y'>
                                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                        <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                                        <Table.Cell>

                                            {comment.content}

                                        </Table.Cell>
                                        <Table.Cell>
                                            {comment.numberOfLikes}
                                            {/* <Link className='font-medium text-gray-900 dark:text-white' to={`/post/${post.slug}`}>{post.title}</Link> */}
                                        </Table.Cell>
                                        {/* <Table.Cell>{post.category}</Table.Cell> */}
                                        <Table.Cell>{comment.postId}</Table.Cell>
                                        <Table.Cell>{comment.userId}</Table.Cell>
                                        <Table.Cell>
                                            <span onClick={() => {
                                                setShowModal(true)
                                                setCommentId(comment._id)
                                            }} className='font-medium text-red-500 hover:underline cursor-pointer'>
                                                Delete
                                            </span>
                                        </Table.Cell>
                                        {/* <Table.Cell> */}
                                        {/* <Link className='text-teal-500 hover:underline' to={`/update-post/${post._id}`}>
                        <span>Edit</span>
                      </Link> */}
                                        {/* </Table.Cell> */}
                                    </Table.Row>
                                </Table.Body>
                            ))}
                        </Table>
                        {
                            showMore && (
                                <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'>Show More</button>
                            )
                        }
                    </>
                ) : (
                    <p>You have no comments yet!</p>
                )
            }
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

export default DashComments