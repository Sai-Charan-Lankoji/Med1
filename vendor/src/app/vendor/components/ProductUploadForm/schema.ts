import { z } from "zod"

const createDimensionsSchema = z.object({
  length: z.number().min(0),
  width: z.number().min(0),
  height: z.number().min(0),
})

export const productFormSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().min(0),
  category: z.string().min(1),
  sizes: z.array(z.string()),
  colors: z.array(z.object({ name: z.string(), hex: z.string() })),
  stock: z.number().min(0),
  images: z.array(z.string()),
  brand: z.string(),
  sku: z.string(),
  weight: z.number().min(0),
  dimensions: createDimensionsSchema,
  store_id: z.string().min(1),
})

export type ProductFormValues = z.infer<typeof productFormSchema>

