import { Sidebar } from 'flowbite-react'
import { HiAnnotation, HiArrowSmRight, HiChartPie, HiDocument, HiDocumentText, HiOutlineUserGroup, HiUser } from 'react-icons/hi'
import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { signoutSuccess } from '../redux/user/userSlice'
import { useDispatch, useSelector } from 'react-redux'

const DashSidebar = () => {
    const location = useLocation()
    const [tab, setTab] = useState('')
    const dispatch = useDispatch()
    const { currentUser } = useSelector(state => state.user)

    const handleSignout = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: "POST"
            })
            const data = await res.json()
            if (!res.ok) {
                console.log(data.msg)
            } else {
                dispatch(signoutSuccess())
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search)
        const term = searchParams.get('tab')
        if (term) setTab(term)
    }, [location.search])
    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-1'>
                    {currentUser && currentUser.isAdmin && (
                        <Link to='/dashboard?tab=summary'>
                            <Sidebar.Item as='div' active={tab === 'summary' || !tab} icon={HiChartPie}>
                                Dashboard
                            </Sidebar.Item>
                        </Link>
                    )}
                    <Link to='/dashboard?tab=profile'>
                        <Sidebar.Item as='div' active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? "Admin" : "User"} labelColor='dark'>Profile</Sidebar.Item>
                    </Link>
                    {currentUser.isAdmin && (
                        <Link to='/dashboard?tab=posts'>
                            <Sidebar.Item as='div' active={tab === 'posts'} icon={HiDocumentText}>
                                Posts
                            </Sidebar.Item>
                        </Link>
                    )}
                    {currentUser.isAdmin && (
                        <Link to='/dashboard?tab=users'>
                            <Sidebar.Item as='div' active={tab === 'users'} icon={HiOutlineUserGroup}>
                                Users
                            </Sidebar.Item>
                        </Link>
                    )}
                    {currentUser.isAdmin && (
                        <Link to='/dashboard?tab=comments'>
                            <Sidebar.Item as='div' active={tab === 'comments'} icon={HiAnnotation}>
                                Comments
                            </Sidebar.Item>
                        </Link>
                    )}
                    <Sidebar.Item onClick={handleSignout} icon={HiArrowSmRight} className='cursor-pointer'>Sign Out</Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    )
}

export default DashSidebar