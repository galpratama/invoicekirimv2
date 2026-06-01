import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const midtransClient = require("midtrans-client");

const AMOUNT = 49000;

export async function POST() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orderId = `PRO-${crypto.randomUUID()}`;
  const email = user.email ?? "";
  const firstName = email.split("@")[0];

  const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
  });

  let transaction: { token: string; redirect_url: string };

  try {
    transaction = await snap.createTransaction({
      transaction_details: { order_id: orderId, gross_amount: AMOUNT },
      customer_details: { email, first_name: firstName },
      item_details: [
        {
          id: "pro-plan",
          price: AMOUNT,
          quantity: 1,
          name: "InvoiceKirim Pro (1 Bulan)",
        },
      ],
    });
  } catch (err) {
    console.error("[midtrans] createTransaction failed:", err);
    return NextResponse.json(
      { error: "Gagal membuat transaksi. Coba lagi." },
      { status: 502 }
    );
  }

  const { error: dbError } = await supabase.from("payments").insert({
    user_id: user.id,
    order_id: orderId,
    amount: AMOUNT,
    status: "pending",
  });

  if (dbError) {
    console.error("[supabase] insert payment failed:", dbError);
    return NextResponse.json(
      { error: "Transaksi dibuat tapi gagal disimpan." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    token: transaction.token,
    redirect_url: transaction.redirect_url,
  });
}
