import { z } from "zod"

export const productFormSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    price: z.number().min(0, "Price must be a positive number"),
    category: z.string().min(1, "Category is required"),
    sizes: z.array(z.string()).optional(),
    colors: z
      .array(
        z.object({
          value: z.string().min(1),
          label: z.string().min(1),
        }),
      )
      .optional(),
    stockId: z.string().optional(), // Replace stock with stockId
    brand: z.string().min(1, "Brand is required"),
    sku: z.string().min(1, "SKU is required"),
    discount: z.number().nullable().optional(),
    sale: z.boolean().default(false),
    store_id: z.string().min(1, "Store ID is required"),
    front_image: z.string().nullable().optional(),
    back_image: z.string().nullable().optional(),
    left_image: z.string().nullable().optional(),
    right_image: z.string().nullable().optional(),
    product_type: z.enum(["standard", "customizable"]),
  })
  .refine(
    (data) => {
      if (data.sale && data.discount === null) return false
      return true
    },
    {
      message: "Discount is required when item is on sale",
      path: ["discount"],
    },
  )
  .refine(
    (data) => {
      if (data.product_type === "standard" && !data.stockId) return false
      return true
    },
    {
      message: "Stock selection is required for standard products",
      path: ["stockId"],
    },
  )

export type ProductFormValues = z.infer<typeof productFormSchema>

