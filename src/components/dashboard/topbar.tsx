"use client";

import { useState } from "react";

import {
    Menu,
    Plus,
} from "lucide-react";

import ApplicationModal from "@/components/dashboard/application-modal";
import MobileNav from "@/components/dashboard/mobile-nav";

export default function Topbar() {
    const [
        isModalOpen,
        setIsModalOpen,
    ] = useState(false);

    const [
        isMobileNavOpen,
        setIsMobileNavOpen,
    ] = useState(false);

    return (
        <>
            <header className="flex h-20 items-center justify-between border-b border-[var(--border)] bg-[var(--background)] px-4 md:px-6">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        onClick={() =>
                            setIsMobileNavOpen(true)
                        }
                        aria-label="Open navigation menu"
                        aria-expanded={isMobileNavOpen}
                        aria-controls="mobile-navigation"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] lg:hidden"
                    >
                        <Menu
                            size={20}
                            aria-hidden="true"
                        />
                    </button>

                    <div className="min-w-0">
                        <h1 className="truncate text-xl font-semibold text-[var(--text-primary)]">
                            Dashboard
                        </h1>

                        <p className="hidden text-sm text-[var(--text-muted)] sm:block">
                            Track and manage your job applications.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        setIsModalOpen(true)
                    }
                    aria-label="Add a new job application"
                    className="flex shrink-0 items-center gap-2 rounded-xl bg-[var(--primary)] px-3 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] sm:px-4"
                >
                    <Plus
                        size={17}
                        aria-hidden="true"
                    />

                    <span className="hidden sm:inline">
                        Add Application
                    </span>
                </button>
            </header>

            <MobileNav
                isOpen={isMobileNavOpen}
                onClose={() =>
                    setIsMobileNavOpen(false)
                }
            />

            <ApplicationModal
                isOpen={isModalOpen}
                onClose={() =>
                    setIsModalOpen(false)
                }
            />
        </>
    );
}