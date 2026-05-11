"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type LineItem = {
  name: string;
  qty: number;
  price: number;
};

export type InvoicePayload = {
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  items: LineItem[];
  notes: string;
  dueDate: string;
};

export async function saveInvoice(
  payload: InvoicePayload
): Promise<{ error: string } | void> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const total = payload.items.reduce(
    (sum, item) => sum + item.qty * item.price,
    0
  );

  const { error } = await supabase.from("invoices").insert({
    user_id: user.id,
    invoice_number: payload.invoiceNumber,
    client_name: payload.clientName,
    client_email: payload.clientEmail || null,
    items: payload.items,
    total,
    notes: payload.notes || null,
    due_date: payload.dueDate || null,
    status: "unpaid",
  });

  if (error) return { error: error.message };

  redirect("/dashboard");
}
