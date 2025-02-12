import * as z from "zod"

export const productFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be 100 characters or less"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be 1000 characters or less"),
  price: z.number().min(0, "Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  sizes: z.array(z.string()).min(1, "At least one size is required"),
  colors: z
    .array(
      z.object({
        name: z.string(),
        hex: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid hex color"),
      }),
    )
    .min(1, "At least one color is required"),
  stock: z.number().int().min(0, "Stock must be a non-negative integer"),
  images: z.array(z.string().url("Invalid image URL")).min(1, "At least one image is required"),
  brand: z.string().min(1, "Brand is required"),
  sku: z.string().min(1, "SKU is required"),
  weight: z.number().positive("Weight must be a positive number"),
  dimensions: z.object({
    length: z.number().positive("Length must be a positive number"),
    width: z.number().positive("Width must be a positive number"),
    height: z.number().positive("Height must be a positive number"),
  }), 
  is_customizable: z.boolean(),
  is_discountable: z.boolean(),
})

export type ProductFormValues = z.infer<typeof productFormSchema>

