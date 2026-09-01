"use client";

import { useState } from "react";
import { Bell, Menu, Plus, Search } from "lucide-react";

import ApplicationModal from "@/components/dashboard/application-modal";
import MobileNav from "@/components/dashboard/mobile-nav";

export default function Topbar() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    return (
        <>
            <header className="flex h-20 items-center justify-between border-b border-[var(--border)] bg-[var(--background)] px-4 md:px-6">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsMobileNavOpen(true)}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] lg:hidden"
                        aria-label="Open navigation"
                    >
                        <Menu size={20} />
                    </button>

                    <div>
                        <h1 className="text-xl font-semibold text-[var(--text-primary)]">
                            Dashboard
                        </h1>

                        <p className="hidden text-sm text-[var(--text-muted)] sm:block">
                            Track and manage your job applications.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 md:flex">
                        <Search size={17} className="text-[var(--text-muted)]" />

                        <input
                            type="text"
                            placeholder="Search applications..."
                            className="w-48 bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
                        />
                    </div>

                    <button
                        type="button"
                        className="hidden h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] transition hover:text-white sm:flex"
                        aria-label="Notifications"
                    >
                        <Bell size={18} />
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-3 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--primary-hover)] sm:px-4"
                    >
                        <Plus size={17} />
                        <span className="hidden sm:inline">Add Application</span>
                    </button>
                </div>
            </header>

            <MobileNav
                isOpen={isMobileNavOpen}
                onClose={() => setIsMobileNavOpen(false)}
            />

            <ApplicationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}