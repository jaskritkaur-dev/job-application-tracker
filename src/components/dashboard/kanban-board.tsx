import JobCard from "@/components/dashboard/job-card";
import { mockApplications } from "@/data/mockApplications";
import { ApplicationStatus } from "@/types/application";

const columns: {
    title: string;
    status: ApplicationStatus;
    color: string;
}[] = [
        {
            title: "Saved",
            status: "saved",
            color: "var(--status-saved)",
        },
        {
            title: "Applied",
            status: "applied",
            color: "var(--status-applied)",
        },
        {
            title: "Interview",
            status: "interview",
            color: "var(--status-interview)",
        },
        {
            title: "Offer",
            status: "offer",
            color: "var(--status-offer)",
        },
        {
            title: "Rejected",
            status: "rejected",
            color: "var(--status-rejected)",
        },
    ];

export default function KanbanBoard() {
    return (
        <section id="board" className="mt-8">
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                    Applications
                </h2>

                <p className="mt-1 text-sm text-[var(--text-muted)]">
                    Track your applications through each stage.
                </p>
            </div>

            <div className="overflow-x-auto pb-4">
                <div className="grid min-w-[1400px] grid-cols-5 gap-4">
                    {columns.map((column) => {
                        const applications = mockApplications.filter(
                            (application) => application.status === column.status
                        );

                        return (
                            <div
                                key={column.status}
                                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3"
                            >
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className="h-2.5 w-2.5 rounded-full"
                                            style={{ backgroundColor: column.color }}
                                        />

                                        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                                            {column.title}
                                        </h3>
                                    </div>

                                    <span className="rounded-lg bg-[var(--surface-soft)] px-2 py-1 text-xs text-[var(--text-muted)]">
                                        {applications.length}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {applications.map((application) => (
                                        <JobCard
                                            key={application.id}
                                            application={application}
                                        />
                                    ))}

                                    {applications.length === 0 && (
                                        <div className="rounded-xl border border-dashed border-[var(--border)] px-3 py-8 text-center">
                                            <p className="text-xs text-[var(--text-muted)]">
                                                No applications
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}