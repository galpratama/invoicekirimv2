"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

type Status = "idle" | "loading" | "pending" | "success" | "error";

const FEATURES_FREE = [
  "5 invoice/bulan",
  "Template standar",
  "Branding InvoiceKirim di invoice",
];

const FEATURES_PRO = [
  "Unlimited invoice",
  "Custom branding",
  "Priority support",
  "Tanpa branding InvoiceKirim",
];

function CheckIcon({ muted }: { muted?: boolean }) {
  return (
    <svg
      className={`mt-0.5 h-4 w-4 shrink-0 ${muted ? "text-faint" : "text-brand"}`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function UpgradeClient({ clientKey }: { clientKey: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleUpgrade() {
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/payment/create-transaction", {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Gagal memulai pembayaran.");
        return;
      }

      window.snap?.pay(data.token, {
        onSuccess: () => {
          setStatus("success");
          setMessage("Pembayaran berhasil! Kamu sekarang Pro.");
          setTimeout(() => router.push("/dashboard"), 2500);
        },
        onPending: () => {
          setStatus("pending");
          setMessage("Menunggu pembayaran...");
        },
        onError: () => {
          setStatus("error");
          setMessage("Pembayaran gagal. Coba lagi.");
        },
        onClose: () => {
          if (status === "loading") setStatus("idle");
        },
      });
    } catch {
      setStatus("error");
      setMessage("Terjadi kesalahan. Coba lagi.");
    }
  }

  return (
    <>
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={clientKey}
        strategy="afterInteractive"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Free card */}
        <div className="flex flex-col rounded-[--radius-card] border border-line bg-surface p-6">
          <div className="mb-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">
              Gratis
            </p>
            <p className="mt-1 font-display text-2xl font-semibold text-ink">
              Rp 0
            </p>
            <p className="text-sm text-muted">selamanya</p>
          </div>
          <ul className="flex flex-col gap-2 text-sm text-ink-soft">
            {FEATURES_FREE.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <CheckIcon muted />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Link
              href="/dashboard"
              className="block w-full rounded-lg border border-line py-2.5 text-center text-sm font-medium text-ink-soft transition-colors hover:bg-bg-soft"
            >
              Tetap Gratis
            </Link>
          </div>
        </div>

        {/* Pro card */}
        <div className="flex flex-col rounded-[--radius-card] border-2 border-brand bg-surface p-6 shadow-sm">
          <div className="mb-4">
            <span className="inline-block rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-medium text-brand">
              Populer
            </span>
            <p className="mt-2 font-display text-2xl font-semibold text-ink">
              Rp 49.000
            </p>
            <p className="text-sm text-muted">per bulan</p>
          </div>
          <ul className="flex flex-col gap-2 text-sm text-ink-soft">
            {FEATURES_PRO.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <CheckIcon />
                {f}
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <button
              onClick={handleUpgrade}
              disabled={status === "loading" || status === "success"}
              className="w-full rounded-lg bg-brand py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "loading"
                ? "Memproses..."
                : "Upgrade ke Pro — Rp 49.000/bulan"}
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div
          className={`mt-6 rounded-lg px-4 py-3 text-sm font-medium ${
            status === "success"
              ? "bg-green-50 text-green-700"
              : status === "pending"
                ? "bg-amber-50 text-amber-700"
                : "bg-red-50 text-red-600"
          }`}
        >
          {message}
        </div>
      )}
    </>
  );
}
