"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Home() {
  const router = useRouter()
  const [inputValue, setInputValue] = useState('')
  // handle create folder
  const handleCreateFolder = () => {
    router.push(`/notes`)
  }

  // handle enter keypress
  const handleEnter = (e: any) => {
    if (e.key === 'Enter') {
      handleCreateFolder()
    }
  }


  return (
    <main className="relative flex h-screen min-h-screen flex-col items-center justify-between md:p-24 p-4">
      <div className='absolute left-8 top-12 font-bold text-3xl'>
        Notes
      </div>
      <div className='flex flex-col items-center justify-center h-full md:gap-4 gap-2 max-md:mb-24'>
        <div className='flex gap-2 md:text-6xl text-2xl'>
          <p>Welcome to </p>
          <p className='font-bold'>Notes</p>
        </div>
        <div>
          <label className='relative'>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className='absolute scale-125 top-0 md:left-4 left-3 cursor-pointer hover:scale-150 transition-all' onClick={handleCreateFolder}>
              <path d="M9.5 4.45831V15.5416" stroke="#BEBEBE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3.95834 10H15.0417" stroke="#BEBEBE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input className='border-2 border-black rounded-md w-72 md:w-[800px] md:px-12 px-8 md:py-2 py-1' type="text" placeholder='Create your first folder here.'
              onKeyDown={handleEnter}
              onChange={(e) => setInputValue(e.target.value)} />
          </label>
        </div>
      </div>
    </main>
  )
}
