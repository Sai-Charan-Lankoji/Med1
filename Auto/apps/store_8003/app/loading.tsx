'use client'

import React from 'react'

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-gray-300 opacity-75"></div>
      <div className="relative z-10">
        <div 
          className="h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
          role="status"
          aria-label="Loading"
        ></div>
      </div>
    </div>
  )
}

export default Loading