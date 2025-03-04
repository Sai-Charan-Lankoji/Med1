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
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="flex space-x-2">
          <div className="h-4 w-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-4 w-4 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-4 w-4 bg-blue-500 rounded-full animate-bounce"></div>
        </div>
        <span className="text-xl text-gray-600">{message}</span>
      </div>
    </div>
  );
  
}

export default LoadingScreen