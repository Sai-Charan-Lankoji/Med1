import { useMutation, useQueryClient } from '@tanstack/react-query'
import { NEXT_URL } from '@/constants';

const baseUrl = NEXT_URL

const updateUser = async (userData: { id: string; [key: string]: any }) => {
  const vendorId = sessionStorage.getItem('vendor_id')

  if (!vendorId) {
    console.warn('No vendor ID found in sessionStorage')
    throw new Error('Vendor ID not found')
  }

  const { id, ...updateData } = userData
  const url = `${baseUrl}/vendor/vendoruser/${id}`

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ ...updateData, vendor_id: vendorId }),
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
      console.error('Error updating user:', error.message)
    } else {
      console.error('An unknown error occurred:', error)
    }
    throw error
  }
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation(updateUser, {
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Error occurred while updating user:', error.message)
      } else {
        console.error('An unknown error occurred:', error)
      }
    },
  })
}