"use client";

import { useState } from "react";

import Link from "next/link";
import { BriefcaseBusiness } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
    const supabase = createClient();

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    async function handleResetRequest(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setMessage("");
        setIsSuccess(false);
        setIsSubmitting(true);

        const redirectTo =
            typeof window !== "undefined"
                ? `${window.location.origin}/reset-password`
                : undefined;

        const { error } =
            await supabase.auth.resetPasswordForEmail(email, {
                redirectTo,
            });

        if (error) {
            setMessage(error.message);
            setIsSubmitting(false);
            return;
        }

        setIsSuccess(true);
        setMessage(
            "Password reset email sent. Check your inbox and open the reset link."
        );
        setIsSubmitting(false);
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4">
            <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)] sm:p-8">
                <div className="mb-7 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--primary)] text-white">
                        <BriefcaseBusiness
                            size={23}
                            aria-hidden="true"
                        />
                    </div>

                    <h1 className="mt-4 text-2xl font-semibold text-[var(--text-primary)]">
                        JobTracker
                    </h1>

                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                        Job Application Manager
                    </p>
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                        Forgot your password?
                    </h2>

                    <p className="mt-2 text-sm text-[var(--text-muted)]">
                        Enter your email and we&apos;ll send you a password reset link.
                    </p>
                </div>

                <form
                    onSubmit={handleResetRequest}
                    className="mt-6 space-y-4"
                >
                    <div>
                        <label
                            htmlFor="reset-email"
                            className="mb-2 block text-sm font-medium text-[var(--text-secondary)]"
                        >
                            Email
                        </label>

                        <input
                            id="reset-email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            required
                            autoComplete="email"
                            placeholder="you@example.com"
                            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40"
                        />
                    </div>

                    {message && (
                        <div
                            role={isSuccess ? "status" : "alert"}
                            className={`rounded-xl border p-4 text-sm ${isSuccess
                                    ? "border-[var(--success)]/30 bg-[var(--success)]/10 text-[var(--success)]"
                                    : "border-[var(--danger)]/30 bg-[var(--danger)]/10 text-[var(--danger)]"
                                }`}
                        >
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-medium text-white transition hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting
                            ? "Sending..."
                            : "Send Reset Link"}
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-[var(--text-muted)]">
                    Remember your password?{" "}
                    <Link
                        href="/login"
                        className="font-medium text-[var(--primary)] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                    >
                        Back to sign in
                    </Link>
                </p>
            </div>
        </main>
    );
}