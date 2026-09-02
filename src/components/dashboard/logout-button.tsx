"use client";

import {
    useState,
} from "react";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
    const supabase = createClient();
    const router = useRouter();

    const [
        isLoggingOut,
        setIsLoggingOut,
    ] = useState(false);

    async function handleLogout() {
        setIsLoggingOut(true);

        const {
            error,
        } = await supabase.auth.signOut();

        if (error) {
            alert("Could not log out. Please try again.");
            setIsLoggingOut(false);
            return;
        }

        router.push("/login");
        router.refresh();
    }

    return (
        <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-label={
                isLoggingOut
                    ? "Logging out"
                    : "Log out of your account"
            }
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-60"
        >
            <LogOut
                size={18}
                aria-hidden="true"
            />

            {isLoggingOut
                ? "Logging out..."
                : "Logout"}
        </button>
    );
}