"use client";

import { useTransition } from "react";

interface Props {
  action: () => Promise<void>;
}

export function LogoutButton({ action }: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={() => startTransition(() => action())}
    >
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-line px-4 py-1.5 text-sm text-ink-soft transition hover:border-line-strong hover:text-ink disabled:opacity-50"
      >
        {pending ? "Keluar…" : "Logout"}
      </button>
    </form>
  );
}
