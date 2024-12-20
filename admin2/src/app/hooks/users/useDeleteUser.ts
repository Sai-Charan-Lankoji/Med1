import { useMutation, useQueryClient } from '@tanstack/react-query'
import { NEXT_URL } from '@/constants';

const baseUrl = NEXT_URL

const deleteUser = async (userId: string) => {
  const vendorId = sessionStorage.getItem('vendor_id')

  if (!vendorId) {
    console.warn('No vendor ID found in sessionStorage')
    throw new Error('Vendor ID not found')
  }

  const url = `${baseUrl}/vendor/vendoruser/${userId}`

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error(`HTTP error! Status: ${response.status}, ${errorData.error}`)
      throw new Error(errorData.error || `HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error deleting user:', error.message)
    } else {
      console.error('An unknown error occurred:', error)
    }
    throw error
  }
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation(deleteUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Error occurred while deleting user:', error.message)
      } else {
        console.error('An unknown error occurred:', error)
      }
    },
  })
}