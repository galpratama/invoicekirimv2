import { LoginForm } from "@/components/LoginForm";
import Link from "next/link";

export const metadata = {
  title: "Login — InvoiceKirim",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24 bg-bg">
      <div className="w-full max-w-md">
        <div className="mb-10 text-center">
          <Link
            href="/"
            className="font-display text-2xl font-medium tracking-tight text-ink"
          >
            Invoice<span className="text-brand">Kirim</span>
          </Link>
          <h1 className="mt-6 font-display text-3xl font-semibold text-ink">
            Masuk ke akun <em className="font-light italic">kamu</em>
          </h1>
          <p className="mt-2 text-sm text-muted">
            Kami kirim link login ke email kamu — nggak perlu ingat password.
          </p>
        </div>

        <div className="rounded-[--radius-card] border border-line bg-surface p-8 shadow-sm">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-faint">
          Belum punya akun?{" "}
          <Link href="/" className="text-brand hover:text-brand-hover transition">
            Daftar gratis
          </Link>
        </p>
      </div>
    </main>
  );
}
