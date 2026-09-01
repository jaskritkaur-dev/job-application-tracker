import {
    BriefcaseBusiness,
    CalendarDays,
    MapPin,
} from "lucide-react";

import { JobApplication } from "@/types/application";

interface JobCardProps {
    application: JobApplication;
}

const sourceLabels = {
    job_portal: "Job Portal",
    career_page: "Career Page",
    cold_email: "Cold Email",
    recruiter_outreach: "Recruiter",
    referral: "Referral",
    other: "Other",
};

export default function JobCard({ application }: JobCardProps) {
    return (
        <article className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-card)]">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="font-semibold text-[var(--text-primary)]">
                        {application.role}
                    </h3>

                    <div className="mt-1 flex items-center gap-2 text-sm text-[var(--text-muted)]">
                        <BriefcaseBusiness size={14} />
                        <span>{application.company}</span>
                    </div>
                </div>

                <span className="rounded-lg bg-[var(--primary-soft)] px-2.5 py-1 text-xs text-[var(--primary)]">
                    {sourceLabels[application.application_source]}
                </span>
            </div>

            <div className="mt-4 space-y-2 text-sm text-[var(--text-muted)]">
                {application.location && (
                    <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>{application.location}</span>
                    </div>
                )}

                {application.applied_date && (
                    <div className="flex items-center gap-2">
                        <CalendarDays size={14} />
                        <span>Applied {application.applied_date}</span>
                    </div>
                )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3">
                <span className="text-xs capitalize text-[var(--text-muted)]">
                    {application.work_type?.replace("_", " ") ?? "Not specified"}
                </span>

                {application.salary && (
                    <span className="text-xs font-medium text-[var(--text-secondary)]">
                        {application.salary}
                    </span>
                )}
            </div>
        </article>
    );
}