import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserPlan } from "@/lib/subscription";
import { UpgradeClient } from "./UpgradeClient";

export const metadata = {
  title: "Upgrade ke Pro — InvoiceKirim",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function UpgradePage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const plan = await getUserPlan(supabase, user.id);

  let expiresAt: string | null = null;
  if (plan === "pro") {
    const { data } = await supabase
      .from("subscriptions")
      .select("expires_at")
      .eq("user_id", user.id)
      .maybeSingle();
    expiresAt = data?.expires_at ?? null;
  }

  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? "";

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-line bg-surface">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link
            href="/dashboard"
            className="font-display text-xl font-medium tracking-tight text-ink"
          >
            Invoice<span className="text-brand">Kirim</span>
          </Link>
          <Link href="/dashboard" className="text-sm text-muted hover:text-ink-soft">
            ← Dashboard
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="mb-10 text-center">
          <h1 className="font-display text-4xl font-semibold text-ink">
            Upgrade ke InvoiceKirim{" "}
            <em className="font-light italic">Pro</em>
          </h1>
          <p className="mt-3 text-muted">
            Buat invoice tak terbatas dengan branding sendiri.
          </p>
        </div>

        {plan === "pro" ? (
          <div className="rounded-[--radius-card] border-2 border-brand bg-surface p-10 text-center">
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
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </div>
            <h2 className="font-display text-2xl font-semibold text-ink">
              Kamu sudah <em className="font-light italic">Pro!</em>
            </h2>
            {expiresAt && (
              <p className="mt-2 text-sm text-muted">
                Aktif hingga{" "}
                <span className="font-medium text-ink-soft">
                  {formatDate(expiresAt)}
                </span>
              </p>
            )}
            <div className="mt-6">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
              >
                Kembali ke Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <UpgradeClient clientKey={clientKey} />
        )}
      </main>
    </div>
  );
}
