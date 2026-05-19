
import React from 'react'

const Loading = ({ size = 'md', color = 'text-blue-600' }) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4'
  }
  return (
    <div className='flex items-center justify-center p-4'>
      <div
        className={`${sizes[size]} ${color} animate-spin rounded-full border-t-transparent border-current`}
      ></div>
    </div>
  )
}

export default Loading
