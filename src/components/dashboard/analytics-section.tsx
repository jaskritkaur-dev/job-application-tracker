"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Cell,
} from "recharts";

import { JobApplication } from "@/types/application";

interface AnalyticsSectionProps {
    applications: JobApplication[];
}

const sourceLabels = {
    job_portal: "Job Portal",
    career_page: "Career Page",
    cold_email: "Cold Email",
    recruiter_outreach: "Recruiter / HR",
    referral: "Referral",
    other: "Other",
};

const sourceColors = [
    "#7c3aed",
    "#22d3ee",
    "#3b82f6",
    "#f59e0b",
    "#22c55e",
    "#ef4444",
];

export default function AnalyticsSection({
    applications,
}: AnalyticsSectionProps) {
    const statusData = [
        {
            name: "Saved",
            total: applications.filter(
                (application) => application.status === "saved"
            ).length,
        },
        {
            name: "Applied",
            total: applications.filter(
                (application) => application.status === "applied"
            ).length,
        },
        {
            name: "Interview",
            total: applications.filter(
                (application) => application.status === "interview"
            ).length,
        },
        {
            name: "Offer",
            total: applications.filter(
                (application) => application.status === "offer"
            ).length,
        },
        {
            name: "Rejected",
            total: applications.filter(
                (application) => application.status === "rejected"
            ).length,
        },
    ];

    const sourceData = Object.entries(sourceLabels)
        .map(([source, label]) => ({
            name: label,
            value: applications.filter(
                (application) =>
                    application.application_source === source
            ).length,
        }))
        .filter((item) => item.value > 0);

    return (
        <section id="analytics" className="mt-10">
            <div className="mb-5">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                    Analytics
                </h2>

                <p className="mt-1 text-sm text-[var(--text-muted)]">
                    Understand your application pipeline and where your opportunities
                    are coming from.
                </p>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
                    <div className="mb-5">
                        <h3 className="font-semibold text-[var(--text-primary)]">
                            Applications by Status
                        </h3>

                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                            Current distribution across your Kanban pipeline.
                        </p>
                    </div>

                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={statusData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#273244"
                                    vertical={false}
                                />

                                <XAxis
                                    dataKey="name"
                                    stroke="#94a3b8"
                                    tickLine={false}
                                    axisLine={false}
                                />

                                <YAxis
                                    allowDecimals={false}
                                    stroke="#94a3b8"
                                    tickLine={false}
                                    axisLine={false}
                                />

                                <Tooltip
                                    cursor={{ fill: "rgba(124, 58, 237, 0.08)" }}
                                    contentStyle={{
                                        background: "#151b2b",
                                        border: "1px solid #273244",
                                        borderRadius: "12px",
                                        color: "#f8fafc",
                                    }}
                                />

                                <Bar
                                    dataKey="total"
                                    fill="#7c3aed"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-card)]">
                    <div className="mb-5">
                        <h3 className="font-semibold text-[var(--text-primary)]">
                            Applications by Source
                        </h3>

                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                            See which application channels you use most.
                        </p>
                    </div>

                    {sourceData.length > 0 ? (
                        <div className="grid items-center gap-5 md:grid-cols-2">
                            <div className="h-72">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={sourceData}
                                            dataKey="value"
                                            nameKey="name"
                                            innerRadius={60}
                                            outerRadius={95}
                                            paddingAngle={4}
                                        >
                                            {sourceData.map((entry, index) => (
                                                <Cell
                                                    key={entry.name}
                                                    fill={
                                                        sourceColors[
                                                        index % sourceColors.length
                                                        ]
                                                    }
                                                />
                                            ))}
                                        </Pie>

                                        <Tooltip
                                            contentStyle={{
                                                background: "#151b2b",
                                                border: "1px solid #273244",
                                                borderRadius: "12px",
                                                color: "#f8fafc",
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="space-y-3">
                                {sourceData.map((item, index) => (
                                    <div
                                        key={item.name}
                                        className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="h-3 w-3 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        sourceColors[
                                                        index % sourceColors.length
                                                        ],
                                                }}
                                            />

                                            <span className="text-sm text-[var(--text-secondary)]">
                                                {item.name}
                                            </span>
                                        </div>

                                        <span className="text-sm font-semibold text-[var(--text-primary)]">
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-[var(--border)]">
                            <p className="text-sm text-[var(--text-muted)]">
                                Add applications to see source analytics.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}