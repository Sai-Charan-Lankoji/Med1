import { z } from "zod";

const createDimensionsSchema = z.object({
  length: z.number().min(0, "Length must be a positive number"),
  width: z.number().min(0, "Width must be a positive number"),
  height: z.number().min(0, "Height must be a positive number"),
});

export const productFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be a positive number"),
  category: z.string().min(1, "Category is required"),
  sizes: z.array(z.string()).nonempty("At least one size must be selected"),
  colors: z
    .array(z.object({ name: z.string().min(1), hex: z.string().min(1) }))
    .nonempty("At least one color must be selected"),
  stock: z.number().min(0, "Stock must be a positive number"),
  images: z.array(z.string()).optional(), // Optional in case no extra images
  brand: z.string().min(1, "Brand is required"),
  sku: z.string().min(1, "SKU is required"),
  weight: z.number().min(0, "Weight must be a positive number"),
  dimensions: createDimensionsSchema,
  store_id: z.string().min(1, "Store ID is required"),
  
  // New fields for side-wise images
  front_image: z.string().optional(), 
  back_image: z.string().optional(),
  left_image: z.string().optional(),
  right_image: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
