import { AlertCircle } from 'lucide-react';
import { Text } from '@medusajs/ui';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage = ({ message }: ErrorMessageProps) => (
  <div className="flex items-center space-x-2 text-red-500 animate-slideIn">
    <AlertCircle className="h-4 w-4" />
    <Text className="text-sm">{message}</Text>
  </div>
);