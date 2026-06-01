import type { SupabaseClient } from "@supabase/supabase-js";

const FREE_LIMIT = 5;

export async function getUserPlan(
  supabase: SupabaseClient,
  userId: string
): Promise<"free" | "pro"> {
  const { data } = await supabase
    .from("subscriptions")
    .select("plan, expires_at")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) return "free";
  if (data.plan !== "pro") return "free";
  if (data.expires_at && new Date(data.expires_at) < new Date()) return "free";
  return "pro";
}

export async function getMonthlyInvoiceCount(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();

  const { count } = await supabase
    .from("invoices")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", start)
    .lte("created_at", end);

  return count ?? 0;
}

export async function canCreateInvoice(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const plan = await getUserPlan(supabase, userId);
  if (plan === "pro") return true;

  const count = await getMonthlyInvoiceCount(supabase, userId);
  return count < FREE_LIMIT;
}

export const FREE_INVOICE_LIMIT = FREE_LIMIT;
