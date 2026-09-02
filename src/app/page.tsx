import { BriefcaseBusiness, Plus } from "lucide-react";
import { redirect } from "next/navigation";

import AnalyticsSection from "@/components/dashboard/analytics-section";
import KanbanBoard from "@/components/dashboard/kanban-board";
import Sidebar from "@/components/dashboard/sidebar";
import StatsCards from "@/components/dashboard/statsCards";
import Topbar from "@/components/dashboard/topbar";

import { createClient } from "@/lib/supabase/server";
import { JobApplication } from "@/types/application";

export default async function Home() {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims) {
    redirect("/login");
  }

  const {
    data: applicationsData,
    error: applicationsError,
  } = await supabase
    .from("applications")
    .select("*")
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  const applications: JobApplication[] =
    applicationsData ?? [];

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="flex min-h-screen">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar />

          <section
            id="dashboard"
            className="flex-1 px-4 py-6 md:px-6"
          >
            <div className="mx-auto max-w-[1600px]">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Overview
              </h2>

              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Your application statistics and Kanban board.
              </p>

              {applicationsError && (
                <div className="mt-4 rounded-xl border border-[var(--danger)]/30 bg-[var(--danger)]/10 p-4 text-sm text-[var(--danger)]">
                  Could not load applications. Please refresh and try again.
                </div>
              )}

              <StatsCards applications={applications} />

              {applications.length === 0 &&
                !applicationsError && (
                  <div className="mt-8 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-12 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)]">
                      <BriefcaseBusiness size={26} />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold text-[var(--text-primary)]">
                      No applications yet
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm text-[var(--text-muted)]">
                      Start building your job pipeline by adding your first
                      application.
                    </p>

                    <div className="mt-5 flex items-center justify-center gap-2 text-sm font-medium text-[var(--primary)]">
                      <Plus size={16} />
                      Use the Add Application button above
                    </div>
                  </div>
                )}

              <KanbanBoard
                key={applications
                  .map(
                    (application) =>
                      `${application.id}-${application.updated_at}-${application.status}-${application.position}`
                  )
                  .join("|")}
                applications={applications}
              />

              <AnalyticsSection applications={applications} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}