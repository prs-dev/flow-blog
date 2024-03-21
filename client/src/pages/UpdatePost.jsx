import {Alert, Button, FileInput, Select, TextInput} from 'flowbite-react'
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import {CircularProgressbar} from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import {useNavigate, useParams} from 'react-router-dom'
import { useSelector } from 'react-redux';

const UpdatePost = () => {
    const [image, setImage] = useState(null)
    const [uploadProgress, setUploadProgress] = useState(null)
    const [uploadError, setUploadError] = useState(null)
    const [publishError, setPublishError] = useState(null)
    const [content, setContent] = useState('')
    const [formData, setFormData] = useState({})
    const {currentUser} = useSelector(state => state.user)
    const navigate = useNavigate()
    const {postId} = useParams()

    useEffect(() => {
        const fetchPost = async() => {
        try {
            const res = await fetch(`/api/post/getposts?postId=${postId}`)
            const data = await res.json()
            if(!res.ok) {
                console.log(data.msg)
                setPublishError(data.msg)
                return
            } else {
                setPublishError(null)
                console.log("post", data)
                setFormData(data.posts[0])
                setContent(data.posts[0].content)
            }
            
        } catch (error) {
            console.log(error.message)
        }
    }
    fetchPost()
    }, [postId])

    const uploadImage = async() => {
        try {
            if(!image) {
                setUploadError("Please select an image!")
                return
            }
            setUploadError(null)
            const storage = getStorage(app)
            const filename = new Date().getTime() + '-' + image.name
            const storageRef = ref(storage, filename)
            const uploadTask = uploadBytesResumable(storageRef, image)
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    setUploadProgress(progress.toFixed(0))
                },
                (error) => {
                    setUploadError('Image Upload Failed!')
                    setUploadProgress(null)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(url => {
                        setUploadError(null)
                        setUploadProgress(null)
                        setFormData({...formData, image: url})
                    })
                }
            )
        } catch (error) {
            setUploadError('Image Upload Failed')
            setUploadProgress(null)
            console.log(error)
        }
    }
    const handleSubmit = async(e) => {
        e.preventDefault()
        const newData = {...formData, content: content}
        try {
            const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(newData)
            })
            const data = await res.json()
            console.log(data)
            if(!res.ok) {
                setPublishError(data.msg)
                return
            } else {
                setPublishError(null)
                navigate(`/post/${data.slug}`)
            }
        } catch (error) {
            
        }
    }

    console.log("formData", formData)
  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>Update a post</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
            <div className="flex flex-col gap-4 sm:flex-row justify-between">
                <TextInput onChange={e => setFormData({...formData, title: e.target.value})} value={formData.title} type='text' placeholder='Title' required id='title' className='flex-1' />
                <Select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option value="uncategorized">Select a category</option>
                    <option value="javascript">Javascript</option>
                    <option value="react">React.js</option>
                    <option value="next">Next.js</option>
                </Select>
            </div>
            <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                <FileInput type='file' accept='image/*' onChange={e => setImage(e.target.files[0])}/>
                <Button disabled={uploadProgress} type="button" gradientDuoTone='purpleToBlue' size='sm' outline onClick={uploadImage}>{
                    uploadProgress ? (
                        <div className="w-16 h-16">
                            <CircularProgressbar value={uploadProgress} text={`${uploadProgress || 0}%`}/>
                        </div>
                    ) : 'Upload Image'
                }</Button>
            </div>
            {
                uploadError && (
                    <Alert color='failure'>{uploadError}</Alert>
                )
            }
            {formData.image && (
                <img src={formData.image} alt='image' className='w-full h-72 object-cover' />
            )}
            <ReactQuill value={content} onChange={setContent} theme='snow' placeholder='write something here...' className='h-72 mb-12' required/>
            {/* <textarea value={formData.content} onChange={e => setFormData({...formData, content:e.target.value})} /> */}
            <Button type='submit' gradientDuoTone="purpleToPink">Update Post</Button>
        </form>
            {publishError && <Alert color='failure'>{publishError}</Alert>}
    </div>
  )
}

export default UpdatePost