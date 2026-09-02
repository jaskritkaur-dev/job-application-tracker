import {
    BriefcaseBusiness,
    CalendarCheck,
    Trophy,
    TrendingUp,
} from "lucide-react";

import { JobApplication } from "@/types/application";

interface StatsCardsProps {
    applications: JobApplication[];
}

export default function StatsCards({
    applications,
}: StatsCardsProps) {
    const totalApplications =
        applications.length;

    const interviews =
        applications.filter(
            (application) =>
                application.status ===
                "interview"
        ).length;

    const offers =
        applications.filter(
            (application) =>
                application.status ===
                "offer"
        ).length;

    const submittedApplications =
        applications.filter(
            (application) =>
                application.status !==
                "saved"
        ).length;

    const responses =
        applications.filter(
            (application) =>
                [
                    "interview",
                    "offer",
                    "rejected",
                ].includes(
                    application.status
                )
        ).length;

    const responseRate =
        submittedApplications > 0
            ? Math.round(
                (responses /
                    submittedApplications) *
                100
            )
            : 0;

    const stats = [
        {
            label: "Total Applications",
            value: totalApplications,
            icon: BriefcaseBusiness,
        },
        {
            label: "Interviews",
            value: interviews,
            icon: CalendarCheck,
        },
        {
            label: "Offers",
            value: offers,
            icon: Trophy,
        },
        {
            label: "Response Rate",
            value: `${responseRate}%`,
            icon: TrendingUp,
        },
    ];

    return (
        <section
            aria-label="Application statistics"
            className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
            {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                    <article
                        key={stat.label}
                        className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[var(--text-muted)]">
                                    {stat.label}
                                </p>

                                <p
                                    className="mt-2 text-2xl font-bold text-[var(--text-primary)]"
                                    aria-label={`${stat.label}: ${stat.value}`}
                                >
                                    {stat.value}
                                </p>
                            </div>

                            <div
                                aria-hidden="true"
                                className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]"
                            >
                                <Icon size={21} />
                            </div>
                        </div>
                    </article>
                );
            })}
        </section>
    );
}