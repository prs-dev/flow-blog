import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {useDispatch, useSelector} from 'react-redux'
import {signInFailure, signInSuccess, signInStart} from '../redux/user/userSlice'
import OAuth from "../components/oAuth"

const SignIn = () => {
  const [formData, setFormData] = useState({})
  // const [errorMessage, setErrorMessage] = useState(null)
  // const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {loading, error: errorMessage} = useSelector(state => state.user)
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
    // console.log(e)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.email || !formData.password) {
      // return setErrorMessage("Please fill all of the fields!!")
      return dispatch(signInFailure('Please fill all the fields!'))
    }
    try {
      // setLoading(true)
      // setErrorMessage(null)
      dispatch(signInStart())
      const res = await fetch('/api/auth/signin', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      console.log("data", data)
      if (data.success === false) {
        //  setErrorMessage(data.msg)
        //  setLoading(false)
        //  return
        return dispatch(signInFailure(data.msg))
      }
      // setLoading(false)
      if(res.ok) {
        dispatch(signInSuccess(data))
        navigate('/')
      }
    } catch (error) {
      // setErrorMessage(error.message)
      // setLoading(false)
      dispatch(signInFailure(error.message))
    }
  }
  console.log(formData)
  return (
    <div className='min-h-screen mt-20'>
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to='/' className=" font-bold dark:text-white text-4xl">
            <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>Prs's</span>
            Blog
          </Link>
          <p className="text-sm mt-5">This is a demo Blog project. With google Authentication.</p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="">
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="Email"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div className="">
              <Label value="Your password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button gradientDuoTone='purpleToPink' type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size='sm' />
                  <span className="pl-3">Loading...</span>
                </>
              ) : "Sign In"}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 mt-5 text-sm">
            <span>Dont have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  )
}

export default SignIn