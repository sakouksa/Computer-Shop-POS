import React from 'react'

const PageLoader = () => {
  return (
    <div className='fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm'>
      <div className='flex gap-2'>
        <span className='h-3 w-3 bg-indigo-600 rounded-full animate-bounce'></span>
        <span className='h-3 w-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:150ms]'></span>
        <span className='h-3 w-3 bg-indigo-400 rounded-full animate-bounce [animation-delay:300ms]'></span>
      </div>
      <p className='mt-4 text-sm font-medium text-gray-700'>
        Loading data...
      </p>

    </div>
  )
}

export default PageLoader