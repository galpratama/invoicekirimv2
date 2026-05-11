import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { InvoiceActions } from "@/components/InvoiceActions";
import { updateInvoiceStatus, deleteInvoice } from "./actions";

type LineItem = {
  name: string;
  qty: number;
  price: number;
};

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata = {
  title: "Detail Invoice — InvoiceKirim",
};

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function InvoiceDetailPage({ params }: Props) {
  const { id } = await params;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!invoice) notFound();

  const items = invoice.items as LineItem[];

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
        {/* Back */}
        <Link
          href="/dashboard"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Kembali ke Dashboard
        </Link>

        {/* Invoice header */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink">
              {invoice.invoice_number}
            </h1>
            <p className="mt-1 text-sm text-muted">
              Dibuat {formatDate(invoice.created_at)}
            </p>
            {invoice.due_date && (
              <p className="mt-0.5 text-sm text-muted">
                Jatuh tempo{" "}
                <span className="font-medium text-ink-soft">
                  {formatDate(invoice.due_date)}
                </span>
              </p>
            )}
          </div>
          <StatusBadge status={invoice.status} />
        </div>

        <div className="space-y-5">
          {/* Client */}
          <section className="rounded-[--radius-card] border border-line bg-surface p-6">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
              Info Client
            </h2>
            <p className="font-medium text-ink">{invoice.client_name}</p>
            {invoice.client_email && (
              <p className="mt-0.5 text-sm text-muted">{invoice.client_email}</p>
            )}
          </section>

          {/* Items */}
          <section className="overflow-hidden rounded-[--radius-card] border border-line bg-surface">
            <div className="border-b border-line px-6 py-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
                Item
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line bg-bg">
                    <th className="px-6 py-3 text-left font-medium text-muted">
                      Nama
                    </th>
                    <th className="px-6 py-3 text-right font-medium text-muted">
                      Qty
                    </th>
                    <th className="px-6 py-3 text-right font-medium text-muted">
                      Harga
                    </th>
                    <th className="px-6 py-3 text-right font-medium text-muted">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {items.map((item, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 text-ink">{item.name}</td>
                      <td className="px-6 py-4 text-right text-ink-soft">
                        {item.qty}
                      </td>
                      <td className="px-6 py-4 text-right text-ink-soft">
                        {formatRupiah(item.price)}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-ink">
                        {formatRupiah(item.qty * item.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-line-strong bg-bg px-6 py-5">
              <span className="text-sm font-medium text-muted">Total</span>
              <span className="font-display text-3xl font-semibold text-ink">
                {formatRupiah(invoice.total)}
              </span>
            </div>
          </section>

          {/* Notes */}
          {invoice.notes && (
            <section className="rounded-[--radius-card] border border-line bg-surface p-6">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                Catatan
              </h2>
              <p className="whitespace-pre-wrap text-sm text-ink-soft">
                {invoice.notes}
              </p>
            </section>
          )}

          {/* Actions */}
          <section className="rounded-[--radius-card] border border-line bg-surface p-6">
            <InvoiceActions
              id={invoice.id}
              status={invoice.status}
              onUpdateStatus={updateInvoiceStatus}
              onDelete={deleteInvoice}
            />
          </section>
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "paid") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        Lunas
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      Belum Dibayar
    </span>
  );
}
