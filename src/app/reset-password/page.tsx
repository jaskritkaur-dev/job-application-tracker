"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
    const supabase = createClient();
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] =
        useState(false);

    async function handleResetPassword(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setMessage("");
        setIsSuccess(false);

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        if (password.length < 6) {
            setMessage(
                "Password must be at least 6 characters."
            );
            return;
        }

        setIsSubmitting(true);

        const { error } =
            await supabase.auth.updateUser({
                password,
            });

        if (error) {
            setMessage(error.message);
            setIsSubmitting(false);
            return;
        }

        setIsSuccess(true);
        setMessage(
            "Password updated successfully. You can now sign in with your new password."
        );

        setIsSubmitting(false);

        setTimeout(() => {
            router.push("/login");
            router.refresh();
        }, 1800);
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
                        Reset your password
                    </h2>

                    <p className="mt-2 text-sm text-[var(--text-muted)]">
                        Choose a new password for your account.
                    </p>
                </div>

                <form
                    onSubmit={handleResetPassword}
                    className="mt-6 space-y-4"
                >
                    <div>
                        <label
                            htmlFor="new-password"
                            className="mb-2 block text-sm font-medium text-[var(--text-secondary)]"
                        >
                            New Password
                        </label>

                        <input
                            id="new-password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                            minLength={6}
                            autoComplete="new-password"
                            placeholder="Minimum 6 characters"
                            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="confirm-password"
                            className="mb-2 block text-sm font-medium text-[var(--text-secondary)]"
                        >
                            Confirm Password
                        </label>

                        <input
                            id="confirm-password"
                            type="password"
                            value={confirmPassword}
                            onChange={(event) =>
                                setConfirmPassword(
                                    event.target.value
                                )
                            }
                            required
                            minLength={6}
                            autoComplete="new-password"
                            placeholder="Re-enter your password"
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
                            ? "Updating Password..."
                            : "Update Password"}
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-[var(--text-muted)]">
                    Back to{" "}
                    <Link
                        href="/login"
                        className="font-medium text-[var(--primary)] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </main>
    );
}