import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { createAdminClient } from "@/utils/supabase/admin";

type MidtransNotification = {
  order_id: string;
  transaction_status: string;
  fraud_status?: string;
  payment_type?: string;
  gross_amount: string;
  status_code: string;
  signature_key: string;
};

function verifySignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string,
  incomingSignature: string
): boolean {
  const payload = orderId + statusCode + grossAmount + serverKey;
  const expected = createHash("sha512").update(payload).digest("hex");
  return expected === incomingSignature;
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export async function POST(req: NextRequest) {
  let body: MidtransNotification;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  const {
    order_id,
    transaction_status,
    fraud_status,
    payment_type,
    gross_amount,
    status_code,
    signature_key,
  } = body;

  const serverKey = process.env.MIDTRANS_SERVER_KEY ?? "";
  if (!verifySignature(order_id, status_code, gross_amount, serverKey, signature_key)) {
    console.warn("[webhook] signature mismatch for order:", order_id);
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  const supabase = createAdminClient();

  const isSuccess =
    (transaction_status === "capture" && fraud_status === "accept") ||
    transaction_status === "settlement";

  if (isSuccess) {
    const now = new Date();
    const expiresAt = addDays(now, 30);

    const { data: payment } = await supabase
      .from("payments")
      .update({
        status: "paid",
        payment_type: payment_type ?? null,
        paid_at: now.toISOString(),
      })
      .eq("order_id", order_id)
      .select("user_id")
      .maybeSingle();

    if (payment?.user_id) {
      await supabase.from("subscriptions").upsert(
        {
          user_id: payment.user_id,
          plan: "pro",
          started_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
        },
        { onConflict: "user_id" }
      );
    }
  } else {
    const statusMap: Record<string, string> = {
      pending: "pending",
      deny: "deny",
      cancel: "cancel",
      expire: "expire",
    };
    const newStatus = statusMap[transaction_status] ?? transaction_status;
    await supabase
      .from("payments")
      .update({ status: newStatus })
      .eq("order_id", order_id);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
