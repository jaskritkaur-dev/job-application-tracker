export default function Loading() {
    return (
        <main className="min-h-screen bg-[var(--background)] p-6">
            <div className="mx-auto max-w-[1600px] animate-pulse">
                <div className="mb-8 h-8 w-48 rounded-lg bg-[var(--surface)]" />

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-28 rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
                        />
                    ))}
                </div>

                <div className="mt-8 h-14 rounded-2xl border border-[var(--border)] bg-[var(--surface)]" />

                <div className="mt-6 grid min-w-[900px] grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <div
                            key={index}
                            className="h-72 rounded-2xl border border-[var(--border)] bg-[var(--surface)]"
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}