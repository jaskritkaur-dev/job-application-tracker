"use client";

import {
    useEffect,
    useId,
    useRef,
    useState,
    type ChangeEvent,
    type FormEvent,
    type KeyboardEvent,
} from "react";

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

const fieldClassName =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40";

const labelClassName =
    "mb-2 block text-sm font-medium text-[var(--text-secondary)]";

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

    const titleId = useId();
    const descriptionId = useId();
    const errorId = useId();

    const dialogRef = useRef<HTMLDivElement>(null);

    const isEditing = Boolean(application);

    const [formData, setFormData] = useState<FormData>(() =>
        getInitialFormData(application)
    );

    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const previousActiveElement =
            document.activeElement as HTMLElement | null;

        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
            previousActiveElement?.focus();
        };
    }, []);

    useEffect(() => {
        function handleEscape(event: globalThis.KeyboardEvent) {
            if (event.key === "Escape" && !isSaving) {
                onClose();
            }
        }

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isSaving, onClose]);

    function handleDialogKeyDown(
        event: KeyboardEvent<HTMLDivElement>
    ) {
        if (event.key !== "Tab" || !dialogRef.current) {
            return;
        }

        const focusableElements =
            dialogRef.current.querySelectorAll<HTMLElement>(
                'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])'
            );

        if (focusableElements.length === 0) {
            return;
        }

        const firstElement = focusableElements[0];
        const lastElement =
            focusableElements[focusableElements.length - 1];

        if (
            event.shiftKey &&
            document.activeElement === firstElement
        ) {
            event.preventDefault();
            lastElement.focus();
        }

        if (
            !event.shiftKey &&
            document.activeElement === lastElement
        ) {
            event.preventDefault();
            firstElement.focus();
        }
    }

    function handleChange(
        event: ChangeEvent<
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
        event: FormEvent<HTMLFormElement>
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
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onMouseDown={(event) => {
                if (
                    event.target === event.currentTarget &&
                    !isSaving
                ) {
                    onClose();
                }
            }}
        >
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={
                    errorMessage
                        ? `${descriptionId} ${errorId}`
                        : descriptionId
                }
                onKeyDown={handleDialogKeyDown}
                className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl"
            >
                <div className="flex items-start justify-between gap-4 border-b border-[var(--border)] px-5 py-5 sm:px-6">
                    <div>
                        <h2
                            id={titleId}
                            className="text-lg font-semibold text-[var(--text-primary)]"
                        >
                            {isEditing
                                ? "Edit Application"
                                : "Add Application"}
                        </h2>

                        <p
                            id={descriptionId}
                            className="mt-1 text-sm text-[var(--text-muted)]"
                        >
                            {isEditing
                                ? "Update the details of this application."
                                : "Add a job opportunity to your application tracker."}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSaving}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Close application form"
                    >
                        <X size={20} aria-hidden="true" />
                    </button>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 p-5 sm:p-6"
                    aria-busy={isSaving}
                >
                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label
                                htmlFor="company"
                                className={labelClassName}
                            >
                                Company
                                <span
                                    aria-hidden="true"
                                    className="ml-1 text-[var(--danger)]"
                                >
                                    *
                                </span>
                            </label>

                            <input
                                id="company"
                                type="text"
                                name="company"
                                value={formData.company}
                                onChange={handleChange}
                                required
                                autoFocus
                                autoComplete="organization"
                                placeholder="e.g. Stripe"
                                className={fieldClassName}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="role"
                                className={labelClassName}
                            >
                                Role
                                <span
                                    aria-hidden="true"
                                    className="ml-1 text-[var(--danger)]"
                                >
                                    *
                                </span>
                            </label>

                            <input
                                id="role"
                                type="text"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                autoComplete="organization-title"
                                placeholder="e.g. Frontend Developer"
                                className={fieldClassName}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="status"
                                className={labelClassName}
                            >
                                Status
                            </label>

                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className={fieldClassName}
                            >
                                <option value="saved">Saved</option>
                                <option value="applied">Applied</option>
                                <option value="interview">Interview</option>
                                <option value="offer">Offer</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="application_source"
                                className={labelClassName}
                            >
                                Application Source
                            </label>

                            <select
                                id="application_source"
                                name="application_source"
                                value={formData.application_source}
                                onChange={handleChange}
                                className={fieldClassName}
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

                                <option value="other">
                                    Other
                                </option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="location"
                                className={labelClassName}
                            >
                                Location
                            </label>

                            <input
                                id="location"
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                autoComplete="address-level2"
                                placeholder="e.g. Chandigarh"
                                className={fieldClassName}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="work_type"
                                className={labelClassName}
                            >
                                Work Type
                            </label>

                            <select
                                id="work_type"
                                name="work_type"
                                value={formData.work_type}
                                onChange={handleChange}
                                className={fieldClassName}
                            >
                                <option value="remote">
                                    Remote
                                </option>

                                <option value="hybrid">
                                    Hybrid
                                </option>

                                <option value="on_site">
                                    On-site
                                </option>
                            </select>
                        </div>

                        <div>
                            <label
                                htmlFor="salary"
                                className={labelClassName}
                            >
                                Salary
                            </label>

                            <input
                                id="salary"
                                type="text"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                placeholder="e.g. ₹4–6 LPA"
                                className={fieldClassName}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="job_url"
                                className={labelClassName}
                            >
                                Job URL
                            </label>

                            <input
                                id="job_url"
                                type="url"
                                name="job_url"
                                value={formData.job_url}
                                onChange={handleChange}
                                inputMode="url"
                                autoComplete="url"
                                placeholder="https://..."
                                className={fieldClassName}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="applied_date"
                                className={labelClassName}
                            >
                                Applied Date
                            </label>

                            <input
                                id="applied_date"
                                type="date"
                                name="applied_date"
                                value={formData.applied_date}
                                onChange={handleChange}
                                className={fieldClassName}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="follow_up_date"
                                className={labelClassName}
                            >
                                Follow-up Date
                            </label>

                            <input
                                id="follow_up_date"
                                type="date"
                                name="follow_up_date"
                                value={formData.follow_up_date}
                                onChange={handleChange}
                                className={fieldClassName}
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="notes"
                            className={labelClassName}
                        >
                            Notes
                        </label>

                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={4}
                            placeholder="Interview details, contact person, reminders..."
                            className={`${fieldClassName} resize-none`}
                        />
                    </div>

                    {errorMessage && (
                        <div
                            id={errorId}
                            role="alert"
                            aria-live="assertive"
                            className="rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 p-3 text-sm text-[var(--danger)]"
                        >
                            {errorMessage}
                        </div>
                    )}

                    <div className="flex flex-col-reverse gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSaving}
                            className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--surface-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--primary-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-60"
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