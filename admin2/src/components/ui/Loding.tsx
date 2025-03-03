'use client';
import { FC } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({ message = "Loading..." }) => {
  return (
    <div className="w-full h-64 flex flex-col items-center justify-center gap-3">
      <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      <div className="text-lg text-gray-600">{message}</div>
    </div>
  );
};

interface LoadingDotsProps {
  message?: string;
}

export const LoadingDots: FC<LoadingDotsProps> = ({ message = "Loading..." }) => {
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
};

interface ErrorMessageProps {
  error: { message?: string };
  className?: string;
}

export const ErrorMessage: FC<ErrorMessageProps> = ({ error, className = "" }) => {
  return (
    <div className={`w-full p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 ${className}`}>
      <AlertCircle className="h-5 w-5 text-red-500" />
      <div className="flex-1 text-red-700">
        {error.message || "An error occurred. Please try again later."}
      </div>
    </div>
  );
};