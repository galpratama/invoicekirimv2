import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { generateInvoiceNumber } from "@/lib/invoice";
import { InvoiceForm } from "@/components/InvoiceForm";
import { saveInvoice } from "./actions";

export const metadata = {
  title: "Invoice Baru — InvoiceKirim",
};

export default async function NewInvoicePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const invoiceNumber = await generateInvoiceNumber(supabase);

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-line bg-surface">
        <nav className="mx-auto flex h-16 max-w-6xl items-center px-6">
          <span className="font-display text-xl font-medium tracking-tight text-ink">
            Invoice<span className="text-brand">Kirim</span>
          </span>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-semibold text-ink">
            Invoice <em className="font-light italic">Baru</em>
          </h1>
          <p className="mt-2 text-sm text-muted">
            Isi detail di bawah, lalu klik Simpan.
          </p>
        </div>
        <InvoiceForm invoiceNumber={invoiceNumber} action={saveInvoice} />
      </main>
    </div>
  );
}
