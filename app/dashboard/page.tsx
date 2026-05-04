import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

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
        <div className="mb-10">
          <h1 className="font-display text-3xl font-semibold text-ink">
            Halo, <em className="font-light italic">{user.email}</em>!
          </h1>
          <p className="mt-2 text-sm text-muted">
            Selamat datang di dashboard InvoiceKirim.
          </p>
        </div>

        <div className="rounded-[--radius-card] border border-line border-dashed bg-surface p-12 text-center">
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
            Fitur invoice akan dibangun di{" "}
            <em className="font-light italic">sesi berikutnya</em>
          </h2>
          <p className="mt-2 text-sm text-muted">
            Nantikan — buat, kirim, dan track invoice langsung dari sini.
          </p>
        </div>
      </main>
    </div>
  );
}
