"use client";

import { useActionState } from "react";
import { login } from "../actions";
import { Wordmark } from "@/components/store/Shell";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, {});
  const input = "w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-sm focus:border-moss focus:outline-none";

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Wordmark />
        <h1 className="mt-8 font-serif-display text-2xl">Masuk ke dashboard</h1>
        <form action={action} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm text-ink-soft">Email</span>
            <input name="email" type="email" required autoComplete="email" className={input} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-ink-soft">Password</span>
            <input name="password" type="password" required autoComplete="current-password" className={input} />
          </label>
          {state.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{state.error}</p>}
          <button type="submit" disabled={pending} className="w-full rounded-full bg-ink py-3 text-paper disabled:opacity-60">
            {pending ? "Memeriksa…" : "Masuk"}
          </button>
        </form>
      </div>
    </main>
  );
}
