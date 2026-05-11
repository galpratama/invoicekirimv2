import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/PrintButton";

type LineItem = {
  name: string;
  qty: number;
  price: number;
};

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data } = await supabase
    .from("invoices")
    .select("invoice_number")
    .eq("id", id)
    .maybeSingle();
  return {
    title: data
      ? `${data.invoice_number} — InvoiceKirim`
      : "Invoice — InvoiceKirim",
  };
}

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

export default async function PublicInvoicePage({ params }: Props) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!invoice) notFound();

  const items = invoice.items as LineItem[];
  const isPaid = invoice.status === "paid";

  return (
    <>
      <style>{`
        @media print {
          @page { margin: 1.5cm; size: A4; }
          body { background: white !important; }
          .invoice-card { box-shadow: none !important; border: none !important; }
        }
      `}</style>

      <div className="min-h-screen bg-bg px-4 py-8 print:bg-white print:p-0">
        {/* Toolbar — hidden on print */}
        <div className="mx-auto mb-6 flex max-w-3xl items-center justify-between print:hidden">
          <span className="font-display text-xl font-medium tracking-tight text-ink">
            Invoice<span className="text-brand">Kirim</span>
          </span>
          <PrintButton />
        </div>

        {/* Invoice card */}
        <div className="invoice-card mx-auto max-w-3xl overflow-hidden rounded-2xl border border-line bg-white shadow-sm print:rounded-none print:shadow-none">
          {/* Card header */}
          <div className="border-b border-line bg-brand px-10 py-8 print:px-8 print:py-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-display text-2xl font-semibold tracking-tight text-white">
                  Invoice<span className="opacity-70">Kirim</span>
                </p>
                <p className="mt-1 text-sm text-white/70">
                  invoicekirim.com
                </p>
              </div>
              <div className="text-right">
                <p className="font-display text-3xl font-bold text-white">
                  {invoice.invoice_number}
                </p>
                <span
                  className={`mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold ${
                    isPaid
                      ? "bg-green-400/20 text-green-100"
                      : "bg-white/20 text-white"
                  }`}
                >
                  {isPaid ? "✓ Lunas" : "Menunggu Pembayaran"}
                </span>
              </div>
            </div>
          </div>

          <div className="px-10 py-8 print:px-8 print:py-6">
            {/* From / To */}
            <div className="mb-8 grid grid-cols-2 gap-8">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                  Dari
                </p>
                <p className="text-sm font-medium text-ink">
                  {invoice.user_email ?? "—"}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
                  Kepada
                </p>
                <p className="text-sm font-medium text-ink">
                  {invoice.client_name}
                </p>
                {invoice.client_email && (
                  <p className="mt-0.5 text-sm text-muted">
                    {invoice.client_email}
                  </p>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="mb-8 flex flex-wrap gap-x-10 gap-y-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Tanggal Dibuat
                </p>
                <p className="mt-1 text-sm text-ink">
                  {formatDate(invoice.created_at)}
                </p>
              </div>
              {invoice.due_date && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Jatuh Tempo
                  </p>
                  <p className="mt-1 text-sm font-medium text-ink">
                    {formatDate(invoice.due_date)}
                  </p>
                </div>
              )}
            </div>

            {/* Items table */}
            <div className="mb-8 overflow-hidden rounded-xl border border-line">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line bg-bg">
                    <th className="px-5 py-3 text-left font-semibold text-muted">
                      Deskripsi
                    </th>
                    <th className="px-5 py-3 text-right font-semibold text-muted">
                      Qty
                    </th>
                    <th className="px-5 py-3 text-right font-semibold text-muted">
                      Harga
                    </th>
                    <th className="px-5 py-3 text-right font-semibold text-muted">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {items.map((item, i) => (
                    <tr key={i} className="bg-white">
                      <td className="px-5 py-3.5 text-ink">{item.name}</td>
                      <td className="px-5 py-3.5 text-right text-ink-soft">
                        {item.qty}
                      </td>
                      <td className="px-5 py-3.5 text-right text-ink-soft">
                        {formatRupiah(item.price)}
                      </td>
                      <td className="px-5 py-3.5 text-right font-medium text-ink">
                        {formatRupiah(item.qty * item.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total row */}
              <div className="flex items-center justify-between border-t-2 border-line-strong bg-bg px-5 py-5">
                <span className="text-sm font-semibold uppercase tracking-wider text-muted">
                  Total
                </span>
                <span className="font-display text-4xl font-bold text-ink">
                  {formatRupiah(invoice.total)}
                </span>
              </div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div className="mb-8 rounded-xl border border-line bg-bg px-5 py-4">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                  Catatan
                </p>
                <p className="whitespace-pre-wrap text-sm text-ink-soft">
                  {invoice.notes}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-line bg-bg px-10 py-5 text-center print:px-8 print:py-4">
            <p className="text-xs text-muted">
              Dibuat dengan{" "}
              <span className="font-medium text-brand">InvoiceKirim</span>
              {" · "}
              invoicekirim.com
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
