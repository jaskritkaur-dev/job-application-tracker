"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    ArrowLeft,
    AlertTriangle,
    Trash2,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
    const supabase = createClient();
    const router = useRouter();

    const [confirmation, setConfirmation] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [isDeleting, setIsDeleting] =
        useState(false);

    const canDelete =
        confirmation.trim().toUpperCase() ===
        "DELETE";

    async function handleDeleteAccount() {
        if (!canDelete || isDeleting) {
            return;
        }

        const confirmed =
            window.confirm(
                "This will permanently delete your account and application data. This action cannot be undone."
            );

        if (!confirmed) {
            return;
        }

        setMessage("");
        setIsDeleting(true);

        const {
            data: { session },
            error: sessionError,
        } =
            await supabase.auth.getSession();

        if (
            sessionError ||
            !session
        ) {
            setMessage(
                "Your session could not be verified. Please sign in again."
            );
            setIsDeleting(false);
            return;
        }

        const response = await fetch(
            "/api/delete-account",
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            }
        );

        const result = await response.json();

        if (!response.ok) {
            setMessage(
                result.error ??
                "Could not delete your account."
            );
            setIsDeleting(false);
            return;
        }

        await supabase.auth.signOut();

        router.push("/signup");
        router.refresh();
    }

    return (
        <main className="min-h-screen bg-[var(--background)] px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-3xl">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                >
                    <ArrowLeft
                        size={17}
                        aria-hidden="true"
                    />

                    Back to dashboard
                </Link>

                <div className="mt-6">
                    <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
                        Settings
                    </h1>

                    <p className="mt-2 text-sm text-[var(--text-muted)]">
                        Manage your JobTracker account.
                    </p>
                </div>

                <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                        Account
                    </h2>

                    <p className="mt-2 text-sm text-[var(--text-muted)]">
                        Your account is connected to Supabase authentication.
                    </p>
                </section>

                <section className="mt-6 rounded-2xl border border-[var(--danger)]/40 bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
                    <div className="flex items-start gap-3">
                        <div
                            aria-hidden="true"
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--danger)]/10 text-[var(--danger)]"
                        >
                            <AlertTriangle size={20} />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                                Danger Zone
                            </h2>

                            <p className="mt-1 text-sm text-[var(--text-muted)]">
                                Deleting your account permanently removes your JobTracker account and all associated application data.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label
                            htmlFor="delete-confirmation"
                            className="mb-2 block text-sm font-medium text-[var(--text-secondary)]"
                        >
                            Type{" "}
                            <span className="font-semibold text-[var(--danger)]">
                                DELETE
                            </span>{" "}
                            to confirm
                        </label>

                        <input
                            id="delete-confirmation"
                            type="text"
                            value={confirmation}
                            onChange={(event) =>
                                setConfirmation(
                                    event.target.value
                                )
                            }
                            autoComplete="off"
                            placeholder="DELETE"
                            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--danger)] focus-visible:ring-2 focus-visible:ring-[var(--danger)]/30"
                        />
                    </div>

                    {message && (
                        <div
                            role="alert"
                            className="mt-4 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 p-4 text-sm text-[var(--danger)]"
                        >
                            {message}
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={
                            handleDeleteAccount
                        }
                        disabled={
                            !canDelete ||
                            isDeleting
                        }
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--danger)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--danger)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <Trash2
                            size={17}
                            aria-hidden="true"
                        />

                        {isDeleting
                            ? "Deleting Account..."
                            : "Delete Account"}
                    </button>
                </section>
            </div>
        </main>
    );
}