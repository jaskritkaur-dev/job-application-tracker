"use client";

import { useState } from "react";

import Link from "next/link";

import {
    BriefcaseBusiness,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
    const supabase = createClient();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    async function handleSignup(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setMessage("");
        setIsSubmitting(true);

        const { error } =
            await supabase.auth.signUp({
                email,
                password,
            });

        if (error) {
            setMessage(error.message);
            setIsSubmitting(false);
            return;
        }

        setMessage(
            `Account created! We sent a verification email to ${email}. Please verify your email, then sign in.`
        );

        setIsSubmitting(false);
    }

    const isSuccess =
        message.startsWith(
            "Account created!"
        );

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
                        Create your account
                    </h2>

                    <p className="mt-2 text-sm text-[var(--text-muted)]">
                        Start tracking your job applications in one place.
                    </p>
                </div>

                <form
                    onSubmit={handleSignup}
                    className="mt-6 space-y-4"
                >
                    <div>
                        <label
                            htmlFor="signup-email"
                            className="mb-2 block text-sm font-medium text-[var(--text-secondary)]"
                        >
                            Email
                        </label>

                        <input
                            id="signup-email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(
                                    event.target.value
                                )
                            }
                            required
                            autoComplete="email"
                            placeholder="you@example.com"
                            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="signup-password"
                            className="mb-2 block text-sm font-medium text-[var(--text-secondary)]"
                        >
                            Password
                        </label>

                        <input
                            id="signup-password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(
                                    event.target.value
                                )
                            }
                            required
                            minLength={6}
                            autoComplete="new-password"
                            placeholder="Minimum 6 characters"
                            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40"
                        />
                    </div>

                    {message && (
                        <div
                            role={
                                isSuccess
                                    ? "status"
                                    : "alert"
                            }
                            className={`rounded-xl border p-4 text-sm ${isSuccess
                                    ? "border-[var(--success)]/30 bg-[var(--success)]/10 text-[var(--success)]"
                                    : "border-[var(--danger)]/30 bg-[var(--danger)]/10 text-[var(--danger)]"
                                }`}
                        >
                            {message}
                        </div>
                    )}

                    {isSuccess && (
                        <Link
                            href="/login"
                            className="block text-center text-sm font-medium text-[var(--primary)] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                        >
                            Go to Sign In
                        </Link>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-medium text-white transition hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-[var(--text-muted)]">
                    Already have an account?{" "}
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