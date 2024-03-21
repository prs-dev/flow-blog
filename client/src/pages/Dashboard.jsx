import { useEffect, useState } from "react"
import {useLocation} from 'react-router-dom'
import DashSidebar from "../components/DashSidebar"
import DashProfile from "../components/DashProfile"
import DashPosts from "../components/DashPosts"
import DashUsers from "../components/DashUsers"
import DashComments from '../components/DashComments'
import DashComp from "../components/DashComp"

const DashBoard = () => {
  const location = useLocation()
  // console.log(location)
  const [tab, setTab] = useState('')
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get('tab')
    if (tabFromUrl) setTab(tabFromUrl)
    // console.log(urlParams, tabFromUrl)
  },[location.search])
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        {/* sidebar */}
        <DashSidebar />
      </div>
      {/* profile... */}
      {tab === 'profile' && <DashProfile />}
      {/* posts */}
      {tab === 'posts' && <DashPosts />}
      {/* users */}
      {tab === 'users' && <DashUsers />}
      {/* comments */}
      {tab === 'comments' && <DashComments />}
      {/* summary */}
      {tab === 'summary' && <DashComp />}
    </div>
  )
}

export default DashBoard