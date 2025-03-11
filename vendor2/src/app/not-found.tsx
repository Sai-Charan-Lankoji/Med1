import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="max-w-[600px] w-full space-y-6 text-center">
        <span className="text-xl font-semibold uppercase tracking-wide text-gray-600">
          404 Error
        </span>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Page not found
          </h1>
          <p className="text-base text-gray-500">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        <div className="pt-4">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center h-10 px-6 bg-black hover:bg-gray-900 text-white font-medium text-sm transition-colors duration-150 rounded-full"
          >
            Back to login
            <FiArrowRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound