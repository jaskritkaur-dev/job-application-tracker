"use client";

import {
    useEffect,
} from "react";

import {
    BarChart3,
    BriefcaseBusiness,
    LayoutDashboard,
    X,
} from "lucide-react";

import LogoutButton from "@/components/dashboard/logout-button";

interface MobileNavProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileNav({
    isOpen,
    onClose,
}: MobileNavProps) {
    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow =
            "hidden";

        function handleEscape(
            event: KeyboardEvent
        ) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        document.addEventListener(
            "keydown",
            handleEscape
        );

        return () => {
            document.body.style.overflow =
                previousOverflow;

            document.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    const navLinkClass =
        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]";

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            <div
                aria-hidden="true"
                onClick={onClose}
                className="absolute inset-0 bg-black/60"
            />

            <aside
                id="mobile-navigation"
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation"
                className="relative z-10 flex min-h-screen w-72 max-w-[85vw] flex-col border-r border-[var(--border)] bg-[var(--surface)]"
            >
                <div className="flex h-20 items-center justify-between border-b border-[var(--border)] px-5">
                    <div className="flex items-center gap-3">
                        <div
                            aria-hidden="true"
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]"
                        >
                            <BriefcaseBusiness
                                size={20}
                            />
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
                        autoFocus
                        aria-label="Close navigation menu"
                        className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                    >
                        <X
                            size={20}
                            aria-hidden="true"
                        />
                    </button>
                </div>

                <nav
                    aria-label="Mobile dashboard navigation"
                    className="flex flex-col gap-2 p-4"
                >
                    <a
                        href="#dashboard"
                        onClick={onClose}
                        className="flex items-center gap-3 rounded-xl bg-[var(--primary-soft)] px-4 py-3 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                    >
                        <LayoutDashboard
                            size={18}
                            aria-hidden="true"
                        />

                        Dashboard
                    </a>

                    <a
                        href="#board"
                        onClick={onClose}
                        className={navLinkClass}
                    >
                        <BriefcaseBusiness
                            size={18}
                            aria-hidden="true"
                        />

                        Applications
                    </a>

                    <a
                        href="#analytics"
                        onClick={onClose}
                        className={navLinkClass}
                    >
                        <BarChart3
                            size={18}
                            aria-hidden="true"
                        />

                        Analytics
                    </a>
                </nav>

                <div className="mt-auto border-t border-[var(--border)] p-4">
                    <LogoutButton />
                </div>
            </aside>
        </div>
    );
}