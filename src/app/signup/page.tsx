"use client";

import { useState } from "react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
    const supabase = createClient();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setMessage("");

        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setMessage(error.message);
            return;
        }

        setMessage(
            `Account created! We sent a verification email to ${email}. Please verify your email, then sign in.`
        );
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[var(--background)] p-4">
            <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow-card)]">
                <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
                    Create account
                </h1>

                <p className="mt-2 text-sm text-[var(--text-muted)]">
                    Start tracking your job applications.
                </p>

                <form onSubmit={handleSignup} className="mt-6 space-y-4">
                    <div>
                        <label className="mb-2 block text-sm text-[var(--text-secondary)]">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-[var(--text-secondary)]">
                            Password
                        </label>

                        <input
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                            minLength={6}
                            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
                        />
                    </div>

                    {message && (
                        <div className="rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/10 p-4 text-sm text-[var(--success)]">
                            {message}
                        </div>
                    )}
                    {message && (
                        <Link
                            href="/login"
                            className="block text-center text-sm font-medium text-[var(--primary)] hover:text-white"
                        >
                            Go to Sign In
                        </Link>
                    )}
                    <button
                        type="submit"
                        className="w-full rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-medium text-white transition hover:bg-[var(--primary-hover)]"
                    >
                        Create Account
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-[var(--text-muted)]">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-medium text-[var(--primary)] hover:text-white"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </main>
    );
}