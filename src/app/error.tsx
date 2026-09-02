"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorPageProps {
    error: Error & {
        digest?: string;
    };
    reset: () => void;
}

export default function ErrorPage({
    error,
    reset,
}: ErrorPageProps) {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4">
            <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-[var(--shadow-card)]">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--danger)]/10 text-[var(--danger)]">
                    <AlertTriangle size={26} />
                </div>

                <h1 className="mt-5 text-xl font-semibold text-[var(--text-primary)]">
                    Something went wrong
                </h1>

                <p className="mt-2 text-sm text-[var(--text-muted)]">
                    We couldn&apos;t load your dashboard. Please try again.
                </p>

                {process.env.NODE_ENV === "development" && (
                    <p className="mt-3 break-words text-xs text-[var(--danger)]">
                        {error.message}
                    </p>
                )}

                <button
                    type="button"
                    onClick={reset}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--primary-hover)]"
                >
                    <RotateCcw size={16} />
                    Try Again
                </button>
            </div>
        </main>
    );
}