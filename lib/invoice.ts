import type { SupabaseClient } from "@supabase/supabase-js";

export async function generateInvoiceNumber(
  supabase: SupabaseClient
): Promise<string> {
  const { data } = await supabase
    .from("invoices")
    .select("invoice_number")
    // TODO: pilih salah satu ordering:
    // .order("invoice_number", { ascending: false })   // tertinggi secara leksikografis — aman dari gap/delete
    // .order("created_at", { ascending: false })       // paling baru dibuat — simpel, tapi bisa duplikat kalau ada delete
    .order("invoice_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return "INV-001";

  const match = data.invoice_number.match(/^INV-(\d+)$/);
  if (!match) return "INV-001";

  const next = parseInt(match[1], 10) + 1;
  return `INV-${String(next).padStart(3, "0")}`;
}
