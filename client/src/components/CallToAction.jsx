import { Button } from 'flowbite-react'
import React from 'react'

const CallToAction = () => {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-none text-center'>
      <div className="flex-1 justify-center flex flex-col">
        <h2 className='text-2xl'>Want to learn more about JS</h2>
        <p className='text-gray-500 my-2'>Checkout these resources with js projects</p>
        <Button gradientDuoTone='purpleToPink' className='rounded-tl-xl rounded-bl-none'>
          <a href="http://" target="_blank" rel="noopener noreferrer">Projects</a>
        </Button>
      </div>
      <div className="p-1 flex-1 h-[15rem]">
        <img className='h-full w-full object-cover' src="https://th.bing.com/th/id/R.35fde9e2f21022536029356e95c86faa?rik=tKrXgn2dvVJqAw&riu=http%3a%2f%2fpluspng.com%2fimg-png%2flogo-javascript-png-javascript-ile-twitter-retweet-uygulamas-833.png&ehk=EYrDqaaPfX6%2fHeLEOTnVTnshumwnFWj06e8qHpLVHko%3d&risl=&pid=ImgRaw&r=0" alt="" srcset="" />
      </div>
    </div>
  )
}

export default CallToAction