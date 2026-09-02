"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    BriefcaseBusiness,
    CalendarDays,
    MapPin,
    Pencil,
    Trash2,
} from "lucide-react";

import ApplicationModal from "@/components/dashboard/application-modal";
import { createClient } from "@/lib/supabase/client";
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

export default function JobCard({
    application,
}: JobCardProps) {
    const supabase = createClient();
    const router = useRouter();

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        const confirmed = window.confirm(
            `Delete ${application.role} at ${application.company}?`
        );

        if (!confirmed) return;

        setIsDeleting(true);

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            setIsDeleting(false);
            return;
        }

        const { error } = await supabase
            .from("applications")
            .delete()
            .eq("id", application.id)
            .eq("user_id", user.id);

        if (error) {
            alert("Could not delete application.");
            setIsDeleting(false);
            return;
        }

        router.refresh();
    }

    return (
        <>
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

                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => setIsEditOpen(true)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-white"
                            aria-label={`Edit ${application.role} at ${application.company}`}
                        >
                            <Pencil size={15} />
                        </button>

                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--danger)]/10 hover:text-[var(--danger)] disabled:opacity-50"
                            aria-label={`Delete ${application.role} at ${application.company}`}
                        >
                            <Trash2 size={15} />
                        </button>
                    </div>
                </div>

                <div className="mt-3">
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
                        {application.work_type?.replace("_", " ") ??
                            "Not specified"}
                    </span>

                    {application.salary && (
                        <span className="text-xs font-medium text-[var(--text-secondary)]">
                            {application.salary}
                        </span>
                    )}
                </div>
            </article>

            <ApplicationModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                application={application}
            />
        </>
    );
}