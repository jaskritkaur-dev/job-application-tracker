"use client";

import {
    BarChart3,
    BriefcaseBusiness,
    LayoutDashboard,
    X,
} from "lucide-react";

interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileNav({
    isOpen,
    onClose,
}: MobileNavProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            <button
                type="button"
                aria-label="Close navigation"
                onClick={onClose}
                className="absolute inset-0 bg-black/60"
            />

            <aside className="relative z-10 flex min-h-screen w-72 flex-col border-r border-[var(--border)] bg-[var(--surface)]">
                <div className="flex h-20 items-center justify-between border-b border-[var(--border)] px-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]">
                            <BriefcaseBusiness size={20} />
                        </div>

                        <div>
                            <p className="font-semibold text-[var(--text-primary)]">
                                JobTracker
                            </p>

                            <p className="text-xs text-[var(--text-muted)]">
                                Application Manager
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close menu"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-white"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex flex-col gap-2 p-4">
                    <a
                        href="#dashboard"
                        onClick={onClose}
                        className="flex items-center gap-3 rounded-xl bg-[var(--primary-soft)] px-4 py-3 text-sm font-medium text-white"
                    >
                        <LayoutDashboard size={18} />
                        Dashboard
                    </a>

                    <a
                        href="#board"
                        onClick={onClose}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-white"
                    >
                        <BriefcaseBusiness size={18} />
                        Applications
                    </a>

                    <a
                        href="#analytics"
                        onClick={onClose}
                        className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[var(--text-muted)] hover:bg-[var(--surface-soft)] hover:text-white"
                    >
                        <BarChart3 size={18} />
                        Analytics
                    </a>
                </nav>
            </aside>
        </div>
    );
}