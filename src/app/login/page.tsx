"use client";

import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BriefcaseBusiness } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
    const supabase = createClient();
    const router = useRouter();

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    async function handleLogin(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setMessage("");
        setIsSubmitting(true);

        const { error } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            });

        if (error) {
            setMessage(error.message);
            setIsSubmitting(false);
            return;
        }

        router.push("/");
        router.refresh();
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
                        Welcome back
                    </h2>

                    <p className="mt-2 text-sm text-[var(--text-muted)]">
                        Sign in to continue managing your applications.
                    </p>
                </div>

                <form
                    onSubmit={handleLogin}
                    className="mt-6 space-y-4"
                >
                    <div>
                        <label
                            htmlFor="login-email"
                            className="mb-2 block text-sm font-medium text-[var(--text-secondary)]"
                        >
                            Email
                        </label>

                        <input
                            id="login-email"
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

                    <div>
                        <label
                            htmlFor="login-password"
                            className="mb-2 block text-sm font-medium text-[var(--text-secondary)]"
                        >
                            Password
                        </label>

                        <input
                            id="login-password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            required
                            minLength={6}
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40"
                        />
                    </div>

                    {message && (
                        <div
                            role="alert"
                            className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 p-4 text-sm text-[var(--danger)]"
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
                            ? "Signing In..."
                            : "Sign In"}
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-[var(--text-muted)]">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/signup"
                        className="font-medium text-[var(--primary)] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                    >
                        Sign up
                    </Link>
                </p>
            </div>
        </main>
    );
}