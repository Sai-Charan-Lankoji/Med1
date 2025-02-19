"use server"

import { revalidatePath } from "next/cache"
const id = sessionStorage.getItem("customerId")
export async function updateProfile(formData: FormData) {

  try {
    const response = await fetch(`http://localhost:5000/api/customer/${id}`, {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("auth_token")}`,
      },
    })

    if (!response.ok) {
      throw new Error("Failed to update profile")
    }
    console.log(response)
    revalidatePath("/profile")
    return { success: true }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { success: false, error: "Failed to update profile" }
  }
}

