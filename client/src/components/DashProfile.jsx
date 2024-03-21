import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {updateFailure, updateStart, updateSuccess} from '../redux/user/userSlice'
import {deleteFailure, deleteStart, deleteSuccess, signoutSuccess} from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import {HiOutlineExclamationCircle} from 'react-icons/hi'
import {Link} from 'react-router-dom'

const DashProfile = () => {
    const { currentUser, error, loading } = useSelector(state => state.user)
    const [image, setImage] = useState(null)
    const [imageUrl, setImageUrl] = useState(null)
    const [fileUploadProgress, setFileUploadProgress] = useState(null)
    const [fileUploadError, setFileUploadError] = useState(null)
    const [userUpdateSuccess, setUserUpdateSuccess] = useState(null)
    const [userUpdateError, setUserUpdateError] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [fileUploaded, setFileUploaded] = useState(true)
    const [formData, setFormData] = useState({})
    const filePickerRef = useRef()
    const dispatch = useDispatch()
    
    const handleChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value})
    }

    console.log("test", formData)

    const handleSubmit = async(e) => {
        e.preventDefault()
        setUserUpdateError(null)
        setUserUpdateSuccess(null)
        if(Object.keys(formData).length === 0) {
            setUserUpdateError('No changes made!')
            return
        }
        if(!fileUploaded) {
            setUserUpdateError('Image is being uploaded!')
            return
        }
        try {
            dispatch(updateStart())
            const res = await fetch(`api/user/update/${currentUser._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if(!res.ok) {
                dispatch(updateFailure(data.message))
                setUserUpdateError(data.message) 
            } else {
                dispatch(updateSuccess(data))
                setUserUpdateSuccess('User Updated')
            }
        } catch (error) {
            dispatch(updateFailure(error.message))
            setUserUpdateError(error.message)            
        }
    }

    const handleImage = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            setImageUrl(URL.createObjectURL(file))
        }
        // setImage(e.target.files[0])
        // console.log(e.target.files, image)
        console.log(image, imageUrl)
    }
    useEffect(() => {
        if (image) uploadImage()
    }, [image])



    const uploadImage = async () => {
        console.log('uploading...')
        setFileUploaded(false)
        // firebase rules
        /*
         allow read;
          allow write: if
          request.resource.size < 2 * 1024 * 1024 &&
          request.resource.contentType.matches('image/.*')  
        */
       setFileUploadError(null)
        const storage = getStorage(app)
        const fileName = new Date().getTime() + image.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, image)
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setFileUploadProgress(progress.toFixed(0))
            },
            (error) => {
                setFileUploadError('File must be an image with size less than 2MB')
                setFileUploadProgress(null)
                setImage(null)
                setImageUrl(null)
                setFileUploaded(true)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then(url => {
                        setImageUrl(url)
                        setFormData({...formData, profilePicture: url})
                        setFileUploaded(true)
                    })
            }
        )
    }

    const handleDelete = async() => {
        setShowModal(false)
        try {
            dispatch(deleteStart)
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE"
            })
            const data = await res.json()
            if (!res.ok) {
                dispatch(deleteFailure(data.msg))
            } else {
                dispatch(deleteSuccess(data))
            }
        } catch (error) {
            dispatch(deleteFailure(error.message))
        }
    }

    const handleSignout = async() => {
        try {
            const res = await fetch('/api/user/signout', {
                method: "POST"
            })
            const data = await res.json()
            if(!res.ok) {
                console.log(data.msg)
            } else {
                dispatch(signoutSuccess())
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    console.log(fileUploadError, fileUploadProgress)
    // console.log("test",filePickerRef.current.click)
    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input hidden ref={filePickerRef} type="file" accept='image/*' onChange={handleImage} />
                <div onClick={() => filePickerRef.current.click()} className="w-32 h-32 self-center cursor-pointer relative shadow-md rounded-full overflow-hidden">
                    {fileUploadProgress && (
                        <CircularProgressbar value={fileUploadProgress || 0} text={`${fileUploadProgress}%`} strokeWidth={5} styles={{
                            root: {
                                width: "100%",
                                height: "100%",
                                position: "absolute",
                                top: '0',
                                left: '0'
                            },
                            path: {
                                stroke: `rgba(62,152,199,${fileUploadProgress / 100})`
                            }
                        }}/>
                    )}
                    <img src={imageUrl || currentUser.profilePicture} alt="profile" className={`${fileUploadProgress && fileUploadProgress < 100 && 'opacity-60'} rounded-full w-full h-full border-8 object-cover border-[lightgray]`} />
                </div>
                {fileUploadError && (
                    <Alert color="failure">{fileUploadError}</Alert>
                )}
                <TextInput onChange={handleChange} type='text' id='username' placeholder='username' defaultValue={currentUser.username} />
                <TextInput onChange={handleChange} type='email' id='email' placeholder='email' defaultValue={currentUser.email} />
                <TextInput onChange={handleChange} type='password' id='password' placeholder='password' />
                <Button type="submit" gradientDuoTone="purpleToBlue" outline disabled={loading || !fileUploaded}>{loading ? 'loading...' : "Update"}</Button>
                {currentUser.isAdmin && (
                    <Link to='/create-post'>
                    <Button
                        gradientDuoTone='purpleToPink'
                        className="w-full"
                    >
                        Create a Post
                    </Button>
                    </Link>
                )}
            </form>
            <div className='text-red-500 flex justify-between mt-5'>
                <span onClick={() => setShowModal(true)} className='cursor-pointer'>Delete Account</span>
                <span onClick={handleSignout} className='cursor-pointer'>Sign Out</span>
            </div>
            {
                userUpdateSuccess && (
                    <Alert color="success" className='mt-5'>{userUpdateSuccess}</Alert>
                )
            }
            {
                userUpdateError && (
                    <Alert color="failure" className='mt-5'>{userUpdateError}</Alert>
                )
            }
            {
                error && (
                    <Alert color="failure" className='mt-5'>{error}</Alert>
                )
            }
            <Modal popup size='md' show={showModal} onClose={() => setShowModal(false)}>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure to delete the account ?</h3>
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

export default DashProfile