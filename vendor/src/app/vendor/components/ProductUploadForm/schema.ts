import { z } from "zod"

const createDimensionsSchema = z.object({
  length: z.number(),
  width: z.number(),
  height: z.number(),
})

export const productFormSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number(),
  category: z.string().min(1),
  sizes: z.array(z.string()),
  colors: z.array(z.object({ name: z.string(), hex: z.string() })),
  stock: z.number(),
  images: z.array(z.string()),
  brand: z.string(),
  sku: z.string(),
  weight: z.number(),
  dimensions: createDimensionsSchema,
  store_id: z.string(),
})

export type ProductFormValues = z.infer<typeof productFormSchema>

