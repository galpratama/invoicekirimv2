"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { InvoicePayload } from "@/app/dashboard/invoices/new/actions";

type LineItem = {
  id: string;
  name: string;
  qty: number;
  price: number;
};

type Props = {
  invoiceNumber: string;
  action: (payload: InvoicePayload) => Promise<{ error: string } | void>;
};

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

const inputClass =
  "w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-faint transition-colors focus:border-brand focus:outline-none";

export function InvoiceForm({ invoiceNumber, action }: Props) {
  const [isPending, startTransition] = useTransition();
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState<LineItem[]>([
    { id: crypto.randomUUID(), name: "", qty: 1, price: 0 },
  ]);
  const [error, setError] = useState("");

  const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  function addItem() {
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: "", qty: 1, price: 0 },
    ]);
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function updateItem(
    id: string,
    field: keyof Omit<LineItem, "id">,
    value: string | number
  ) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!clientName.trim()) {
      setError("Nama client wajib diisi.");
      return;
    }

    const validItems = items.filter((item) => item.name.trim());
    if (validItems.length === 0) {
      setError("Tambahkan minimal 1 item dengan nama.");
      return;
    }

    startTransition(async () => {
      const result = await action({
        invoiceNumber,
        clientName: clientName.trim(),
        clientEmail: clientEmail.trim(),
        items: validItems.map(({ name, qty, price }) => ({ name, qty, price })),
        notes: notes.trim(),
        dueDate,
      });
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Info Invoice */}
      <section className="rounded-[--radius-card] border border-line bg-surface p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">
          Info Invoice
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-soft">
              Nomor Invoice
            </label>
            <input
              type="text"
              value={invoiceNumber}
              readOnly
              className="w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm text-muted"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-soft">
              Jatuh Tempo
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Info Client */}
      <section className="rounded-[--radius-card] border border-line bg-surface p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">
          Info Client
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-soft">
              Nama Client{" "}
              <span className="text-red-500" aria-hidden>
                *
              </span>
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Contoh: PT Maju Jaya"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-soft">
              Email Client
            </label>
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="client@email.com"
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* Items */}
      <section className="rounded-[--radius-card] border border-line bg-surface p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">
          Item
        </h2>

        <div className="space-y-3">
          <div className="hidden grid-cols-[1fr_72px_148px_116px_32px] gap-3 sm:grid">
            <span className="text-xs font-medium text-muted">Nama Item</span>
            <span className="text-xs font-medium text-muted">Jumlah</span>
            <span className="text-xs font-medium text-muted">Harga Satuan</span>
            <span className="text-right text-xs font-medium text-muted">
              Subtotal
            </span>
            <span />
          </div>

          {items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_72px_148px_116px_32px] sm:items-center"
            >
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItem(item.id, "name", e.target.value)}
                placeholder="Nama item..."
                className={inputClass}
              />
              <input
                type="number"
                value={item.qty}
                min={1}
                onChange={(e) =>
                  updateItem(
                    item.id,
                    "qty",
                    Math.max(1, parseInt(e.target.value) || 1)
                  )
                }
                className={inputClass}
              />
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted">
                  Rp
                </span>
                <input
                  type="number"
                  value={item.price || ""}
                  min={0}
                  step={1000}
                  onChange={(e) =>
                    updateItem(
                      item.id,
                      "price",
                      parseInt(e.target.value) || 0
                    )
                  }
                  placeholder="0"
                  className="w-full rounded-lg border border-line bg-surface py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-faint transition-colors focus:border-brand focus:outline-none"
                />
              </div>
              <p className="text-right text-sm font-medium text-ink sm:block">
                {formatRupiah(item.qty * item.price)}
              </p>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                disabled={items.length === 1}
                aria-label="Hapus item"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-bg hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
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
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-line pt-4">
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-brand transition-colors hover:text-brand-hover"
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
            Tambah Item
          </button>

          <div className="text-right">
            <p className="text-xs text-muted">Total</p>
            <p className="font-display text-2xl font-semibold text-ink">
              {formatRupiah(total)}
            </p>
          </div>
        </div>
      </section>

      {/* Catatan */}
      <section className="rounded-[--radius-card] border border-line bg-surface p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">
          Catatan
        </h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Catatan tambahan untuk client (opsional)..."
          rows={3}
          className="w-full resize-none rounded-lg border border-line bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-faint transition-colors focus:border-brand focus:outline-none"
        />
      </section>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 pb-8">
        <Link
          href="/dashboard"
          className="rounded-lg border border-line px-4 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-bg"
        >
          Batal
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending && (
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
              />
            </svg>
          )}
          {isPending ? "Menyimpan..." : "Simpan Invoice"}
        </button>
      </div>
    </form>
  );
}
