import {
    BarChart3,
    BriefcaseBusiness,
    LayoutDashboard,
} from "lucide-react";
import LogoutButton from "@/components/dashboard/logout-button";

export default function Sidebar() {
    return (
        <aside className="hidden min-h-screen w-64 flex-col border-r border-[var(--border)] bg-[var(--surface)] lg:flex">
            <div className="flex h-20 items-center gap-3 border-b border-[var(--border)] px-6">
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

            <nav className="flex flex-1 flex-col gap-2 p-4">
                <a
                    href="#dashboard"
                    className="flex items-center gap-3 rounded-xl bg-[var(--primary-soft)] px-4 py-3 text-sm font-medium text-white"
                >
                    <LayoutDashboard size={18} />
                    Dashboard
                </a>

                <a
                    href="#board"
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-white"
                >
                    <BriefcaseBusiness size={18} />
                    Applications
                </a>

                <a
                    href="#analytics"
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-white"
                >
                    <BarChart3 size={18} />
                    Analytics
                </a>
            </nav>
            <div className="border-t border-[var(--border)] p-4">
                <LogoutButton />

                <p className="mt-2 px-4 text-xs text-[var(--text-muted)]">
                    Job Application Tracker
                </p>
            </div>
        </aside>
    );
}