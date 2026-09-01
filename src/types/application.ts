export type ApplicationStatus =
    | "saved"
    | "applied"
    | "interview"
    | "offer"
    | "rejected";

export type ApplicationSource =
    | "job_portal"
    | "career_page"
    | "cold_email"
    | "recruiter_outreach"
    | "referral"
    | "other";

export type WorkType =
    | "remote"
    | "hybrid"
    | "on_site";

export interface JobApplication {
    id: string;
    user_id: string;

    company: string;
    role: string;

    status: ApplicationStatus;
    application_source: ApplicationSource;

    location: string | null;
    work_type: WorkType | null;

    job_url: string | null;
    salary: string | null;

    applied_date: string | null;
    follow_up_date: string | null;

    notes: string | null;

    position: number;

    created_at: string;
    updated_at: string;
}