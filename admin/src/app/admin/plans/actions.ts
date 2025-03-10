"use server";
import { revalidatePath } from "next/cache";

export async function revalidatePlans() {
  revalidatePath("/admin/plans");
}