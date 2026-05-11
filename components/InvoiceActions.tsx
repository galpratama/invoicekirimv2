"use client";

import { useState, useTransition } from "react";

type Props = {
  id: string;
  status: string;
  onUpdateStatus: (
    id: string,
    status: "paid" | "unpaid"
  ) => Promise<{ error: string } | void>;
  onDelete: (id: string) => Promise<{ error: string } | void>;
};

export function InvoiceActions({
  id,
  status,
  onUpdateStatus,
  onDelete,
}: Props) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [isStatusPending, startStatusTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  function handleToggleStatus() {
    const newStatus = currentStatus === "paid" ? "unpaid" : "paid";
    startStatusTransition(async () => {
      const result = await onUpdateStatus(id, newStatus);
      if (result?.error) {
        setError(result.error);
      } else {
        setCurrentStatus(newStatus);
      }
    });
  }

  async function handleCopyLink() {
    try {
      const url = `${window.location.origin}/invoice/${id}`;
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Gagal menyalin link.");
    }
  }

  function handleDelete() {
    if (
      !window.confirm(
        "Yakin hapus invoice ini? Aksi ini tidak bisa dibatalkan."
      )
    )
      return;
    startDeleteTransition(async () => {
      const result = await onDelete(id);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleToggleStatus}
          disabled={isStatusPending}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
            currentStatus === "paid"
              ? "border border-line bg-surface text-ink-soft hover:bg-bg"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          {isStatusPending ? (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
            </svg>
          ) : currentStatus === "paid" ? (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          )}
          {isStatusPending
            ? "Menyimpan..."
            : currentStatus === "paid"
            ? "Tandai Belum Bayar"
            : "Tandai Lunas"}
        </button>

        <button
          onClick={handleCopyLink}
          className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-bg"
        >
          {copied ? (
            <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
          )}
          {copied ? "Tersalin!" : "Share Link"}
        </button>

        <button
          onClick={handleDelete}
          disabled={isDeletePending}
          className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeletePending ? (
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
            </svg>
          ) : (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          )}
          {isDeletePending ? "Menghapus..." : "Hapus Invoice"}
        </button>
      </div>
    </div>
  );
}
