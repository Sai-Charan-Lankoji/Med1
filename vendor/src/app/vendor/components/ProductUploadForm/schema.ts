import { disconnect } from "process";
import { z } from "zod";

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
  brand: z.string().min(1, "Brand is required"),
  sku: z.string().min(1, "SKU is required"),
  discount: z.number().min(0, "Discount must be a positive number").default(0),
  sale: z.boolean().default(false),
  store_id: z.string().min(1, "Store ID is required"),
  front_image: z.string().nullable(),
  back_image: z.string().nullable(),
  left_image: z.string().nullable(),
  right_image: z.string().nullable(),
});


export type ProductFormValues = z.infer<typeof productFormSchema>;
