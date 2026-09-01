import {
    BriefcaseBusiness,
    CalendarCheck,
    Trophy,
    TrendingUp,
} from "lucide-react";

const stats = [
    {
        label: "Total Applications",
        value: "24",
        icon: BriefcaseBusiness,
    },
    {
        label: "Interviews",
        value: "6",
        icon: CalendarCheck,
    },
    {
        label: "Offers",
        value: "2",
        icon: Trophy,
    },
    {
        label: "Response Rate",
        value: "33%",
        icon: TrendingUp,
    },
];

export default function StatsCards() {
    return (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                    <div
                        key={stat.label}
                        className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[var(--text-muted)]">
                                    {stat.label}
                                </p>

                                <p className="mt-2 text-2xl font-bold text-[var(--text-primary)]">
                                    {stat.value}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-[var(--primary)]">
                                <Icon size={21} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}