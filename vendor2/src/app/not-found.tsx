import Link from 'next/link'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card bg-base-100 shadow-xl max-w-md w-full">
        <div className="card-body items-center text-center">
          <div className="avatar avatar-placeholder mb-4">
            <div className="bg-primary/10 text-primary rounded-full w-24">
              <span className="text-3xl">404</span>
            </div>
          </div>
          
          <h1 className="card-title text-3xl font-bold">Page not found</h1>
          
          <p className="text-base-content/70 py-4">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>

          <div className="divider"></div>
          
          <div className="card-actions">
            <Link href="/" className="btn btn-primary">
              Back to Home
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          {/* <Link href="/" className="link link-hover link-primary text-sm mt-4">
            Return to homepage
          </Link> */}
        </div>
      </div>
    </div>
  )
}

export default NotFound