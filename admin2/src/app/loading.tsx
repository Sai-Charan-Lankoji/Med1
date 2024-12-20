// loading.tsx
import { type FC } from 'react'

interface LoadingScreenProps {
  message?: string
  theme?: 'default' | 'pulse' | 'bounce' | 'minimal'
}

const LoadingScreen: FC<LoadingScreenProps> = ({
  message = "Please wait while we prepare your content",
  theme = "minimal"
}) => {
  // Theme-background 
  const themeClasses = {
    default: "bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-500",
    pulse: "bg-gradient-to-br from-purple-600 via-pink-500 to-red-500",
    bounce: "bg-gradient-to-br from-green-600 via-teal-500 to-blue-500",
    minimal: "bg-gradient-to-br from-gray-800 via-gray-900 to-black"
  }

  return (
    <div className={`min-h-screen overflow-hidden ${themeClasses[theme]}`}>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        {/*  background effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[300, 600, 900].map((size, index) => (
            <div
              key={index}
              className="absolute rounded-full bg-white/10 backdrop-blur-lg animate-pulse"
              style={{
                width: size,
                height: size,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                animation: `pulse ${2 + index * 0.3}s infinite`
              }}
            />
          ))}
        </div>

      
        <div className="relative z-10 flex flex-col items-center space-y-8">
          {/* Spinning loader */}
          {/* <div className="relative w-16 h-16">
            <div className="w-16 h-16 rounded-full border-4 border-white/20 border-t-white animate-spin" />
          </div> */}

          {/* Loading text and dots */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Loading</h2>
            <div className="flex space-x-2 justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>

          {/* Message card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 max-w-md w-full text-center">
            <p className="text-white/80 text-sm">
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen