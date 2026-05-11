import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

export const metadata = {
  title: "Dashboard — InvoiceKirim",
};

async function signOut() {
  "use server";
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  await supabase.auth.signOut();
  redirect("/login");
}

type Invoice = {
  id: string;
  invoice_number: string;
  client_name: string;
  total: number;
  status: string;
  created_at: string;
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
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: string }) {
  if (status === "paid") {
    return (
      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
        Lunas
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">
      Belum Dibayar
    </span>
  );
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: invoices } = await supabase
    .from("invoices")
    .select("id, invoice_number, client_name, total, status, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-line bg-surface">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <span className="font-display text-xl font-medium tracking-tight text-ink">
            Invoice<span className="text-brand">Kirim</span>
          </span>
          <LogoutButton action={signOut} />
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink">
              Halo, <em className="font-light italic">{user.email}</em>!
            </h1>
            <p className="mt-2 text-sm text-muted">
              Selamat datang di dashboard InvoiceKirim.
            </p>
          </div>
          <Link
            href="/dashboard/invoices/new"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Bikin Invoice Baru
          </Link>
        </div>

        {invoices && invoices.length > 0 ? (
          <div className="overflow-hidden rounded-[--radius-card] border border-line bg-surface">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line bg-bg">
                    <th className="px-6 py-3 text-left font-medium text-muted">
                      Nomor Invoice
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-muted">
                      Client
                    </th>
                    <th className="px-6 py-3 text-right font-medium text-muted">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-muted">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left font-medium text-muted">
                      Tanggal
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {(invoices as Invoice[]).map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="relative transition-colors hover:bg-bg-soft"
                    >
                      <td className="px-6 py-4 font-medium text-ink">
                        <Link
                          href={`/dashboard/invoices/${invoice.id}`}
                          className="after:absolute after:inset-0"
                        >
                          {invoice.invoice_number}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-ink-soft">
                        {invoice.client_name}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-ink">
                        {formatRupiah(invoice.total)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={invoice.status} />
                      </td>
                      <td className="px-6 py-4 text-muted">
                        {formatDate(invoice.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-[--radius-card] border border-dashed border-line bg-surface p-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft">
              <svg
                className="h-7 w-7 text-brand"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z"
                />
              </svg>
            </div>
            <h2 className="font-display text-xl font-semibold text-ink">
              Belum ada invoice.{" "}
              <em className="font-light italic">Yuk bikin yang pertama!</em>
            </h2>
            <p className="mt-6">
              <Link
                href="/dashboard/invoices/new"
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
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
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                Bikin Invoice Baru
              </Link>
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
