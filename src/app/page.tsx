import Sidebar from "@/components/dashboard/sidebar";
import Topbar from "@/components/dashboard/topbar";
import KanbanBoard from "@/components/dashboard/kanban-board";
import StatsCards from "@/components/dashboard/statsCards";
export default function Home() {
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
                Your application statistics and Kanban board will appear here.
              </p>
              <StatsCards />
              <KanbanBoard />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}