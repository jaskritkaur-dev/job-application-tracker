import { redirect } from "next/navigation";

import Sidebar from "@/components/dashboard/sidebar";
import Topbar from "@/components/dashboard/topbar";
import StatsCards from "@/components/dashboard/statsCards";
import KanbanBoard from "@/components/dashboard/kanban-board";

import { createClient } from "@/lib/supabase/server";
import { JobApplication } from "@/types/application";

export default async function Home() {
  const supabase = await createClient();

  const { data: claimsData, error: claimsError } =
    await supabase.auth.getClaims();

  if (claimsError || !claimsData?.claims) {
    redirect("/login");
  }

  const { data: applicationsData, error: applicationsError } =
    await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

  const applications: JobApplication[] = applicationsData ?? [];

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
                  Could not load applications.
                </div>
              )}

              <StatsCards applications={applications} />

              <KanbanBoard applications={applications} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}