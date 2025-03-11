import { AlertCircle } from 'lucide-react';


interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <div className="flex items-center space-x-2 text-red-500 animate-slideIn">
    <AlertCircle className="h-4 w-4" />
    <div role="alert" className="alert alert-error">
  <span>{message}.</span>
</div>
  </div>
);