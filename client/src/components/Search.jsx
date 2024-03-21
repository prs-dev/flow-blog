import React, { useEffect, useState } from 'react'
import {Button, Select, TextInput} from 'flowbite-react'
import {useLocation, useNavigate} from 'react-router-dom'
import PostCard from '../components/PostCard'

const Search = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized'
  })
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [showMore, setShowMore] = useState(false)
  console.log(sidebarData)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get('searchTerm')
    const sortFromUrl = urlParams.get('sort')
    const categoryFromUrl = urlParams.get('category')
    if(searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({...sidebarData, searchTerm: searchTermFromUrl, sort: sortFromUrl, category: categoryFromUrl})
    }
    const fetchPosts = async() => {
      setLoading(true)
      const query = urlParams.toString()
      const res = await fetch(`/api/post/getposts?${query}`)
      if(!res.ok) return setLoading(false)
      const data = await res.json()
      setPosts(data.posts)
      setLoading(false)
      if(data.posts.length === 9) {
        setShowMore(true)
      } else {
        setShowMore(false)
      }
    }
    fetchPosts()
  }, [location.search])

  const handleChange = (e) => {
    e.target.id === 'searchTerm' ? setSidebarData({...sidebarData, searchTerm: e.target.value}) : e.target.id === 'sort' ? setSidebarData({...sidebarData, sort: e.target.value || 'desc'}) : setSidebarData({...sidebarData, category: e.target.value || 'uncategorized'})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('searchTerm', sidebarData.searchTerm)
    urlParams.set('sort', sidebarData.sort)
    urlParams.set('category', sidebarData.category)
    const query = urlParams.toString()
    navigate(`/search?${query}`)
  }

  const handleShowMore = async() => {
    const numberOfPosts = posts.length
    const startIndex = numberOfPosts
    const urlParams = new URLSearchParams(location.search)
    urlParams.set('startIndex', startIndex)
    const query = urlParams.toString()
    const res = await fetch(`/api/post/getposts?${query}`)
    if(!res.ok) return
    const data = await res.json()
    setPosts([...posts, ...data.posts])
    setShowMore(data.posts.length === 9) //returns a boolean
  }

  return (
    <div className='flex flex-col md:flex-row'>
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
          <div className=" flex items-center justify-between gap-3">
            <label className='whitespace-nowrap font-semibold'>Search Term</label>
            <TextInput className='w-40' placeholder='Search...' id="searchTerm" type='text' value={sidebarData.searchTerm} onChange={handleChange}/>
          </div>
          <div className="flex items-center justify-between gap-3">
            <label className='font-semibold'>Sort</label>
            <Select className='w-40' onChange={handleChange} value={sidebarData.sort} id='sort'>
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </Select>
          </div>
          <div className="flex items-center justify-between gap-3">
            <label className='font-semibold'>Category</label>
            <Select className='w-40' onChange={handleChange} value={sidebarData.category} id='category'>
              <option value='uncategorized'>Select</option>
              <option value='react'>Reactjs</option>
              <option value='next'>Nextjs</option>
              <option value='javascript'>Js</option>
            </Select>
          </div>
          <Button type='submit' outline gradientDuoTone='purpleToPink'>Apply Filters</Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5'>Posts Results</h1>
        <div className="p-7 flex flex-wrap gap-4">
          {
            !loading && posts.length === 0 && <p className='text-xl text-gray-500'>
              No posts found.
            </p>
          }
          {
            loading && (
              <p className='text-xl text-gray-500'>Loading...</p>
            )
          }
          {!loading && posts && posts.map(post => <PostCard post={post} />)}
          {showMore && <button onClick={handleShowMore} className='text-teal-500 text-lg hover:underline p-7 w-full'>Show More</button>}
        </div>
      </div>
    </div>
  )
}

export default Search