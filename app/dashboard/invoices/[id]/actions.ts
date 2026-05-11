"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateInvoiceStatus(
  id: string,
  status: "paid" | "unpaid"
): Promise<{ error: string } | void> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from("invoices")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath(`/dashboard/invoices/${id}`);
  revalidatePath("/dashboard");
}

export async function deleteInvoice(
  id: string
): Promise<{ error: string } | void> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.from("invoices").delete().eq("id", id);

  if (error) return { error: error.message };

  redirect("/dashboard");
}
