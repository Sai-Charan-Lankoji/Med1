import { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import VendorService from "../../../services/vendor"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { Vendor } from "../../../models/vendor"
import UserService from "../../../services/user"
import { User } from "../../../models/user"

const getVendorService = (req: MedusaRequest): VendorService | null => {
  try {
    return req.scope.resolve("vendorService") as VendorService
  } catch (error) {
    console.error("Failed to resolve vendorService:", error)
    return null
  }
}

const getUserService = (req: MedusaRequest): UserService | null => {
  try {
    return req.scope.resolve("userService") as UserService
  } catch (error) {
    console.error("Failed to resolve UserService:", error)
    return null
  }
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> => {
  try {
    const vendorService = getVendorService(req)
    const userService = getUserService(req)

    if (!vendorService || !userService) {
      res.status(500).json({
        error: "Service could not be resolved.",
        message: "Vendor or User service could not be resolved.",
      })
      return
    }

    const { email, password } = req.body as { email: string; password: string }
    if (!email || !password) {
      res.status(400).json({
        error: "Email and password are required.",
        message: "Email and Password are required.",
      })
      return
    }

    // First, check for vendor
    const vendor: Vendor | null = await vendorService.findByEmail(email)
    if (vendor) {
      const isPasswordValid = await bcrypt.compare(password, vendor.password)
      if (isPasswordValid) {
        const token = jwt.sign(
          { id: vendor.id, email: vendor.contact_email },
          process.env.JWT_SECRET!,
          { expiresIn: "1h" }
        )
        res.setHeader(
          "Set-Cookie",
          `vendor_id=${vendor.id}; Path=/; HttpOnly; Secure; SameSite=None;`
        )
        res.status(200).json({ token, vendor })
        return
      }
    }

    // If vendor not found or password invalid, check for user
    const user: User | null = await userService.retrieveByEmail(email)
     
    if (user) {
       
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.JWT_SECRET!,
          { expiresIn: "1h" }
        )
        res.setHeader(
          "Set-Cookie",
          `user_id=${user.id}; Path=/; HttpOnly; Secure; SameSite=None;`
        )
        res.status(200).json({ token, user })
        return
      
    }

    // If neither vendor nor user found or password invalid
    res.status(401).json({
      error: "Invalid credentials",
      message: "Invalid email or password.",
    })
  } catch (error) {
    console.log("ERROR: ",error)
    res
      .status(500)
      .json({ error: error.message || "An unknown error occurred." })
  }
}

export const CORS = false