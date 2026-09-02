"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import {
    ApplicationSource,
    ApplicationStatus,
    JobApplication,
    WorkType,
} from "@/types/application";

interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    application?: JobApplication | null;
}

interface FormData {
    company: string;
    role: string;
    status: ApplicationStatus;
    application_source: ApplicationSource;
    location: string;
    work_type: WorkType;
    salary: string;
    job_url: string;
    applied_date: string;
    follow_up_date: string;
    notes: string;
}

const initialFormData: FormData = {
    company: "",
    role: "",
    status: "saved",
    application_source: "job_portal",
    location: "",
    work_type: "remote",
    salary: "",
    job_url: "",
    applied_date: "",
    follow_up_date: "",
    notes: "",
};

function getInitialFormData(
    application?: JobApplication | null
): FormData {
    if (!application) {
        return { ...initialFormData };
    }

    return {
        company: application.company,
        role: application.role,
        status: application.status,
        application_source: application.application_source,
        location: application.location ?? "",
        work_type: application.work_type ?? "remote",
        salary: application.salary ?? "",
        job_url: application.job_url ?? "",
        applied_date: application.applied_date ?? "",
        follow_up_date: application.follow_up_date ?? "",
        notes: application.notes ?? "",
    };
}

export default function ApplicationModal({
    isOpen,
    onClose,
    application = null,
}: ApplicationModalProps) {
    if (!isOpen) return null;

    return (
        <ApplicationModalContent
            application={application}
            onClose={onClose}
        />
    );
}

interface ApplicationModalContentProps {
    application: JobApplication | null;
    onClose: () => void;
}

function ApplicationModalContent({
    application,
    onClose,
}: ApplicationModalContentProps) {
    const supabase = createClient();
    const router = useRouter();

    const isEditing = Boolean(application);

    const [formData, setFormData] = useState<FormData>(() =>
        getInitialFormData(application)
    );

    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    function handleChange(
        event: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setIsSaving(true);
        setErrorMessage("");

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            setErrorMessage(
                "You must be signed in to save an application."
            );
            setIsSaving(false);
            return;
        }

        const applicationData = {
            company: formData.company.trim(),
            role: formData.role.trim(),
            status: formData.status,
            application_source: formData.application_source,
            location: formData.location.trim() || null,
            work_type: formData.work_type,
            salary: formData.salary.trim() || null,
            job_url: formData.job_url.trim() || null,
            applied_date: formData.applied_date || null,
            follow_up_date: formData.follow_up_date || null,
            notes: formData.notes.trim() || null,
        };

        let error;

        if (application) {
            const result = await supabase
                .from("applications")
                .update(applicationData)
                .eq("id", application.id)
                .eq("user_id", user.id);

            error = result.error;
        } else {
            const result = await supabase
                .from("applications")
                .insert({
                    ...applicationData,
                    user_id: user.id,
                    position: 0,
                });

            error = result.error;
        }

        if (error) {
            setErrorMessage(error.message);
            setIsSaving(false);
            return;
        }

        setIsSaving(false);
        onClose();
        router.refresh();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
                <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5">
                    <div>
                        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                            {isEditing
                                ? "Edit Application"
                                : "Add Application"}
                        </h2>

                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                            {isEditing
                                ? "Update the details of this application."
                                : "Add a job opportunity to your application tracker."}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-white"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 p-6"
                >
                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm text-[var(--text-secondary)]">
                                Company
                            </label>

                            <input
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Stripe"
                                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-[var(--text-secondary)]">
                                Role
                            </label>

                            <input
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Frontend Developer"
                                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-[var(--text-secondary)]">
                                Status
                            </label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
                            >
                                <option value="saved">Saved</option>
                                <option value="applied">Applied</option>
                                <option value="interview">
                                    Interview
                                </option>
                                <option value="offer">Offer</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-[var(--text-secondary)]">
                                Application Source
                            </label>

                            <select
                                name="application_source"
                                value={formData.application_source}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
                            >
                                <option value="job_portal">
                                    Job Portal
                                </option>

                                <option value="career_page">
                                    Company Career Page
                                </option>

                                <option value="cold_email">
                                    Cold Email
                                </option>

                                <option value="recruiter_outreach">
                                    Recruiter / HR Outreach
                                </option>

                                <option value="referral">
                                    Referral
                                </option>

                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-[var(--text-secondary)]">
                                Location
                            </label>

                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. Chandigarh"
                                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-[var(--text-secondary)]">
                                Work Type
                            </label>

                            <select
                                name="work_type"
                                value={formData.work_type}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
                            >
                                <option value="remote">Remote</option>
                                <option value="hybrid">Hybrid</option>
                                <option value="on_site">On-site</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-[var(--text-secondary)]">
                                Salary
                            </label>

                            <input
                                type="text"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                placeholder="e.g. ₹4–6 LPA"
                                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-[var(--text-secondary)]">
                                Job URL
                            </label>

                            <input
                                type="url"
                                name="job_url"
                                value={formData.job_url}
                                onChange={handleChange}
                                placeholder="https://..."
                                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-[var(--text-secondary)]">
                                Applied Date
                            </label>

                            <input
                                type="date"
                                name="applied_date"
                                value={formData.applied_date}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-[var(--text-secondary)]">
                                Follow-up Date
                            </label>

                            <input
                                type="date"
                                name="follow_up_date"
                                value={formData.follow_up_date}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-[var(--text-secondary)]">
                            Notes
                        </label>

                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Interview details, contact person, reminders..."
                            className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
                        />
                    </div>

                    {errorMessage && (
                        <div className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 p-3 text-sm text-[var(--danger)]">
                            {errorMessage}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 border-t border-[var(--border)] pt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--surface-soft)] disabled:opacity-60"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--primary-hover)] disabled:opacity-60"
                        >
                            {isSaving
                                ? "Saving..."
                                : isEditing
                                    ? "Save Changes"
                                    : "Save Application"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}