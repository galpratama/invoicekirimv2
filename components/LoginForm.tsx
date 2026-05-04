"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setError("Gagal kirim link. Coba lagi ya.");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft">
          <svg
            className="h-6 w-6 text-brand"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="font-display text-xl font-semibold text-ink">
          Cek email kamu
        </h2>
        <p className="mt-2 text-sm text-muted">
          Kami kirim link login ke{" "}
          <span className="font-medium text-ink-soft">{email}</span>.
          Klik linknya untuk masuk.
        </p>
        <button
          onClick={() => { setSent(false); setEmail(""); }}
          className="mt-6 text-sm text-brand hover:text-brand-hover transition"
        >
          Ganti email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-ink-soft">
          Alamat email
        </label>
        <input
          id="email"
          type="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="kamu@email.com"
          className="w-full rounded-lg border border-line bg-bg px-4 py-2.5 text-sm text-ink placeholder:text-faint outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-1 w-full rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg transition hover:bg-brand disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? "Mengirim…" : "Kirim link login"}
      </button>
    </form>
  );
}
