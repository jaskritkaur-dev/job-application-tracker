"use client";

import { X } from "lucide-react";

interface ApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ApplicationModal({
    isOpen,
    onClose,
}: ApplicationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl">
                <div className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5">
                    <div>
                        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                            Add Application
                        </h2>

                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                            Add a job opportunity to your application tracker.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-white"
                        aria-label="Close modal"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form className="space-y-5 p-6">
                    <div className="grid gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm text-[var(--text-secondary)]">
                                Company
                            </label>

                            <input
                                type="text"
                                placeholder="e.g. Stripe"
                                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-[var(--text-secondary)]">
                                Role
                            </label>

                            <input
                                type="text"
                                placeholder="e.g. Frontend Developer"
                                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-[var(--text-secondary)]">
                                Status
                            </label>

                            <select className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]">
                                <option value="saved">Saved</option>
                                <option value="applied">Applied</option>
                                <option value="interview">Interview</option>
                                <option value="offer">Offer</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-[var(--text-secondary)]">
                                Application Source
                            </label>

                            <select className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]">
                                <option value="job_portal">Job Portal</option>
                                <option value="career_page">Company Career Page</option>
                                <option value="cold_email">Cold Email</option>
                                <option value="recruiter_outreach">Recruiter / HR Outreach</option>
                                <option value="referral">Referral</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-[var(--text-secondary)]">
                                Location
                            </label>

                            <input
                                type="text"
                                placeholder="e.g. Chandigarh"
                                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-[var(--text-secondary)]">
                                Work Type
                            </label>

                            <select className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]">
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
                                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-[var(--text-secondary)]">
                                Follow-up Date
                            </label>

                            <input
                                type="date"
                                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-[var(--text-secondary)]">
                            Notes
                        </label>

                        <textarea
                            rows={4}
                            placeholder="Interview details, contact person, reminders..."
                            className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none focus:border-[var(--primary)]"
                        />
                    </div>

                    <div className="flex justify-end gap-3 border-t border-[var(--border)] pt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm text-[var(--text-secondary)] transition hover:bg-[var(--surface-soft)]"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--primary-hover)]"
                        >
                            Save Application
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}