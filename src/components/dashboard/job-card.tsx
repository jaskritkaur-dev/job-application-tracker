"use client";

import {
    useState,
    type ReactNode,
} from "react";

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
    dragHandle?: ReactNode;
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
    dragHandle,
}: JobCardProps) {
    const supabase = createClient();
    const router = useRouter();

    const [isEditOpen, setIsEditOpen] =
        useState(false);

    const [isDeleting, setIsDeleting] =
        useState(false);

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
            <article
                aria-label={`${application.role} at ${application.company}`}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 shadow-[var(--shadow-card)]"
            >
                <div className="mb-3 flex items-center justify-between">
                    <div className="shrink-0">
                        {dragHandle}
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                        <button
                            type="button"
                            onClick={() =>
                                setIsEditOpen(true)
                            }
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                            aria-label={`Edit ${application.role} at ${application.company}`}
                        >
                            <Pencil
                                size={15}
                                aria-hidden="true"
                            />
                        </button>

                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--danger)]/10 hover:text-[var(--danger)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--danger)] disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label={
                                isDeleting
                                    ? `Deleting ${application.role} at ${application.company}`
                                    : `Delete ${application.role} at ${application.company}`
                            }
                        >
                            <Trash2
                                size={15}
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold text-[var(--text-primary)]">
                        {application.role}
                    </h3>

                    <div className="mt-1 flex items-center gap-2 text-sm text-[var(--text-muted)]">
                        <BriefcaseBusiness
                            size={14}
                            aria-hidden="true"
                        />

                        <span>
                            {application.company}
                        </span>
                    </div>
                </div>

                <div className="mt-3">
                    <span className="rounded-lg bg-[var(--primary-soft)] px-2.5 py-1 text-xs text-[var(--primary)]">
                        {
                            sourceLabels[
                            application.application_source
                            ]
                        }
                    </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-[var(--text-muted)]">
                    {application.location && (
                        <div className="flex items-center gap-2">
                            <MapPin
                                size={14}
                                aria-hidden="true"
                            />

                            <span>
                                {application.location}
                            </span>
                        </div>
                    )}

                    {application.applied_date && (
                        <div className="flex items-center gap-2">
                            <CalendarDays
                                size={14}
                                aria-hidden="true"
                            />

                            <span>
                                Applied{" "}
                                <time
                                    dateTime={
                                        application.applied_date
                                    }
                                >
                                    {application.applied_date}
                                </time>
                            </span>
                        </div>
                    )}
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--border)] pt-3">
                    <span className="text-xs capitalize text-[var(--text-muted)]">
                        {application.work_type
                            ?.replace(/_/g, " ") ??
                            "Not specified"}
                    </span>

                    {application.salary && (
                        <span className="text-right text-xs font-medium text-[var(--text-secondary)]">
                            {application.salary}
                        </span>
                    )}
                </div>
            </article>

            <ApplicationModal
                isOpen={isEditOpen}
                onClose={() =>
                    setIsEditOpen(false)
                }
                application={application}
            />
        </>
    );
}