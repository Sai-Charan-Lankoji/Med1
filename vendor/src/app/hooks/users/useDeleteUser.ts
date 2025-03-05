import { vendor_id } from '@/app/utils/constant'
import { useMutation, useQueryClient } from '@tanstack/react-query'

const baseUrl = "http://localhost:5000"

const deleteUser = async (userId: string) => {

  if (!vendor_id) {
    console.warn('No vendor ID found in sessionStorage')
    throw new Error('Vendor ID not found')
  }

  const url = `${baseUrl}/api/vendor-users/${userId}`

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