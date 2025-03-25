import { type FC } from 'react'

interface LoadingScreenProps {
  message?: string
  theme?: 'default' | 'pulse' | 'bounce' | 'minimal'
  loadingType?: 'spinner' | 'dots' | 'ring' | 'ball' | 'bars' | 'infinity'
}

const LoadingScreen: FC<LoadingScreenProps> = ({
  message = "Please wait while we prepare your content",
  theme = "default",
  loadingType = "dots"
}) => {
  // Theme mapping to DaisyUI color classes
  const themeClasses = {
    default: "bg-gradient-to-br from-primary/80 to-secondary/80",
    pulse: "bg-gradient-to-br from-secondary/80 to-accent/80",
    bounce: "bg-gradient-to-br from-accent/80 to-primary/80",
    minimal: "bg-base-200"
  }

  // Loading type mapping to DaisyUI loading classes
  const loadingClasses = {
    spinner: "loading loading-spinner",
    dots: "loading loading-dots", 
    ring: "loading loading-ring",
    ball: "loading loading-ball",
    bars: "loading loading-bars",
    infinity: "loading loading-infinity"
  }

  return (
    <div className={`fixed inset-0 ${themeClasses[theme]} flex items-center justify-center`}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full bg-primary/10 blur-xl -top-20 -left-20"></div>
        <div className="absolute w-96 h-96 rounded-full bg-secondary/10 blur-xl -bottom-20 -right-20"></div>
      </div>
      
      <div className="relative z-10">
        {/* Main card container */}
        <div className="card bg-base-100/20 backdrop-blur-lg shadow-xl max-w-md w-full">
          <div className="card-body items-center text-center gap-8 p-8">
            {/* Logo or brand element */}
            <div className="text-primary text-3xl font-bold">
              Your Brand
            </div>
            
            {/* Loading animation */}
            <div className="flex flex-col items-center gap-4">
              <div className={`${loadingClasses[loadingType]} loading-lg text-primary`}></div>
              <span className="text-base-content/70">Loading</span>
            </div>
            
            {/* Message */}
            <p className="text-base-content/90">
              {message}
            </p>
            
            {/* Progress bar */}
            <div className="w-full">
              <progress className="progress progress-primary w-full"></progress>
            </div>
          </div>
        </div>
        
        {/* Secondary elements */}
        <div className="text-center mt-4 text-base-100/70 text-sm">
          &copy; {new Date().getFullYear()} Your Company
        </div>
      </div>
      
      {/* Animated accent circles */}
      <div className="fixed w-20 h-20 rounded-full bg-accent/30 blur-md animate-pulse"
           style={{ top: '30%', left: '20%' }}></div>
      <div className="fixed w-10 h-10 rounded-full bg-secondary/30 blur-md animate-bounce"
           style={{ bottom: '25%', right: '15%' }}></div>
    </div>
  )
}

export default LoadingScreen