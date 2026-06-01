import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { generateInvoiceNumber } from "@/lib/invoice";
import { canCreateInvoice } from "@/lib/subscription";
import { InvoiceForm } from "@/components/InvoiceForm";
import { saveInvoice } from "./actions";
import Link from "next/link";

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

  const allowed = await canCreateInvoice(supabase, user.id);
  const invoiceNumber = allowed ? await generateInvoiceNumber(supabase) : null;

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

        {!allowed ? (
          <div className="rounded-[--radius-card] border border-line bg-surface p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <svg className="h-7 w-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <h2 className="font-display text-xl font-semibold text-ink">
              Limit invoice <em className="font-light italic">tercapai</em>
            </h2>
            <p className="mt-2 text-sm text-muted">
              Kamu sudah mencapai limit 5 invoice bulan ini. Upgrade ke Pro untuk invoice tak terbatas.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/upgrade"
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
              >
                Upgrade ke Pro
              </Link>
              <Link
                href="/dashboard"
                className="text-sm text-muted hover:text-ink-soft"
              >
                Kembali ke dashboard
              </Link>
            </div>
          </div>
        ) : (
          <InvoiceForm invoiceNumber={invoiceNumber!} action={saveInvoice} />
        )}
      </main>
    </div>
  );
}
