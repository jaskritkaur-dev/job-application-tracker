"use client";

import { useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
    closestCorners,
    DndContext,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useDroppable,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";

import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import {
    GripVertical,
    Search,
    SlidersHorizontal,
    X,
} from "lucide-react";

import JobCard from "@/components/dashboard/job-card";
import { createClient } from "@/lib/supabase/client";

import {
    ApplicationSource,
    ApplicationStatus,
    JobApplication,
    WorkType,
} from "@/types/application";

const columns: {
    title: string;
    status: ApplicationStatus;
    color: string;
}[] = [
        {
            title: "Saved",
            status: "saved",
            color: "var(--status-saved)",
        },
        {
            title: "Applied",
            status: "applied",
            color: "var(--status-applied)",
        },
        {
            title: "Interview",
            status: "interview",
            color: "var(--status-interview)",
        },
        {
            title: "Offer",
            status: "offer",
            color: "var(--status-offer)",
        },
        {
            title: "Rejected",
            status: "rejected",
            color: "var(--status-rejected)",
        },
    ];

interface KanbanBoardProps {
    applications: JobApplication[];
}

interface KanbanColumnProps {
    title: string;
    status: ApplicationStatus;
    color: string;
    applications: JobApplication[];
    filtersActive: boolean;
}

function normalizeValue(
    value: string | null | undefined
) {
    return (value ?? "")
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, "_");
}

function SortableJobCard({
    application,
}: {
    application: JobApplication;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: application.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.45 : 1,
    };

    const dragHandle = (
        <button
            type="button"
            {...attributes}
            {...listeners}
            className="flex h-10 w-10 touch-none cursor-grab items-center justify-center rounded-lg text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] active:cursor-grabbing"
            aria-label={`Move ${application.role} at ${application.company}`}
            title="Drag to move application"
        >
            <GripVertical
                size={17}
                aria-hidden="true"
            />
        </button>
    );

    return (
        <div
            ref={setNodeRef}
            style={style}
            aria-roledescription="sortable application"
        >
            <JobCard
                application={application}
                dragHandle={dragHandle}
            />
        </div>
    );
}

function KanbanColumn({
    title,
    status,
    color,
    applications,
    filtersActive,
}: KanbanColumnProps) {
    const { setNodeRef, isOver } =
        useDroppable({
            id: `column-${status}`,
        });

    const headingId = `column-${status}-heading`;

    return (
        <div
            ref={setNodeRef}
            aria-labelledby={headingId}
            className={`rounded-2xl border bg-[var(--surface)] p-3 transition ${isOver
                    ? "border-[var(--primary)]"
                    : "border-[var(--border)]"
                }`}
        >
            <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span
                        aria-hidden="true"
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                            backgroundColor: color,
                        }}
                    />

                    <h3
                        id={headingId}
                        className="text-sm font-semibold text-[var(--text-primary)]"
                    >
                        {title}
                    </h3>
                </div>

                <span
                    className="rounded-lg bg-[var(--surface-soft)] px-2 py-1 text-xs text-[var(--text-muted)]"
                    aria-label={`${applications.length} applications`}
                >
                    {applications.length}
                </span>
            </div>

            <SortableContext
                items={applications.map(
                    (application) => application.id
                )}
                strategy={verticalListSortingStrategy}
            >
                <div className="min-h-28 space-y-3">
                    {applications.map((application) => (
                        <SortableJobCard
                            key={application.id}
                            application={application}
                        />
                    ))}

                    {applications.length === 0 && (
                        <div className="rounded-xl border border-dashed border-[var(--border)] px-3 py-8 text-center">
                            <p className="text-xs text-[var(--text-muted)]">
                                {filtersActive
                                    ? "No matching applications"
                                    : "Drop applications here"}
                            </p>
                        </div>
                    )}
                </div>
            </SortableContext>
        </div>
    );
}

export default function KanbanBoard({
    applications: initialApplications,
}: KanbanBoardProps) {
    const supabase = createClient();
    const router = useRouter();

    const dndContextId = useId();
    const boardHeadingId = useId();
    const searchId = useId();
    const sourceFilterId = useId();
    const workTypeFilterId = useId();
    const resultsId = useId();

    const [applications, setApplications] =
        useState<JobApplication[]>(
            initialApplications
        );

    const [searchQuery, setSearchQuery] =
        useState("");

    const [sourceFilter, setSourceFilter] =
        useState<"all" | ApplicationSource>(
            "all"
        );

    const [workTypeFilter, setWorkTypeFilter] =
        useState<"all" | WorkType>("all");

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),

        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 180,
                tolerance: 8,
            },
        }),

        useSensor(KeyboardSensor, {
            coordinateGetter:
                sortableKeyboardCoordinates,
        })
    );

    const filtersActive =
        searchQuery.trim() !== "" ||
        sourceFilter !== "all" ||
        workTypeFilter !== "all";

    const filteredApplications =
        useMemo(() => {
            const query = searchQuery
                .trim()
                .toLowerCase();

            return applications.filter(
                (application) => {
                    const sourceText =
                        application.application_source
                            .replace(/_/g, " ")
                            .toLowerCase();

                    const workTypeText = (
                        application.work_type ?? ""
                    )
                        .replace(/_/g, " ")
                        .replace(/-/g, " ")
                        .toLowerCase();

                    const matchesSearch =
                        !query ||
                        application.company
                            .toLowerCase()
                            .includes(query) ||
                        application.role
                            .toLowerCase()
                            .includes(query) ||
                        (application.location ?? "")
                            .toLowerCase()
                            .includes(query) ||
                        (application.notes ?? "")
                            .toLowerCase()
                            .includes(query) ||
                        sourceText.includes(query) ||
                        workTypeText.includes(
                            query.replace(/-/g, " ")
                        );

                    const applicationSource =
                        normalizeValue(
                            application.application_source
                        );

                    const selectedSource =
                        normalizeValue(sourceFilter);

                    const matchesSource =
                        sourceFilter === "all" ||
                        applicationSource ===
                        selectedSource;

                    const applicationWorkType =
                        normalizeValue(
                            application.work_type
                        );

                    const selectedWorkType =
                        normalizeValue(workTypeFilter);

                    const matchesWorkType =
                        workTypeFilter === "all" ||
                        applicationWorkType ===
                        selectedWorkType;

                    return (
                        matchesSearch &&
                        matchesSource &&
                        matchesWorkType
                    );
                }
            );
        }, [
            applications,
            searchQuery,
            sourceFilter,
            workTypeFilter,
        ]);

    function clearFilters() {
        setSearchQuery("");
        setSourceFilter("all");
        setWorkTypeFilter("all");
    }

    function getColumnApplications(
        status: ApplicationStatus
    ) {
        return applications
            .filter(
                (application) =>
                    application.status === status
            )
            .sort(
                (a, b) =>
                    a.position - b.position
            );
    }

    function getVisibleColumnApplications(
        status: ApplicationStatus
    ) {
        return filteredApplications
            .filter(
                (application) =>
                    application.status === status
            )
            .sort(
                (a, b) =>
                    a.position - b.position
            );
    }

    async function handleDragEnd(
        event: DragEndEvent
    ) {
        const { active, over } = event;

        if (!over) return;

        const activeId = String(active.id);
        const overId = String(over.id);

        const activeApplication =
            applications.find(
                (application) =>
                    application.id === activeId
            );

        if (!activeApplication) {
            return;
        }

        const previousApplications = [
            ...applications,
        ];

        let newStatus: ApplicationStatus;

        if (
            overId.startsWith("column-")
        ) {
            newStatus = overId.replace(
                "column-",
                ""
            ) as ApplicationStatus;
        } else {
            const overApplication =
                applications.find(
                    (application) =>
                        application.id === overId
                );

            if (!overApplication) {
                return;
            }

            newStatus =
                overApplication.status;
        }

        let updatedApplications = [
            ...applications,
        ];

        if (
            activeApplication.status ===
            newStatus
        ) {
            const columnApplications =
                getColumnApplications(
                    newStatus
                );

            const oldIndex =
                columnApplications.findIndex(
                    (application) =>
                        application.id === activeId
                );

            let newIndex =
                columnApplications.findIndex(
                    (application) =>
                        application.id === overId
                );

            if (
                overId.startsWith("column-")
            ) {
                newIndex =
                    columnApplications.length - 1;
            }

            if (
                oldIndex === -1 ||
                newIndex === -1
            ) {
                return;
            }

            const reorderedApplications =
                arrayMove(
                    columnApplications,
                    oldIndex,
                    newIndex
                ).map(
                    (application, index) => ({
                        ...application,
                        position: index,
                    })
                );

            const reorderedMap =
                new Map(
                    reorderedApplications.map(
                        (application) => [
                            application.id,
                            application,
                        ]
                    )
                );

            updatedApplications =
                applications.map(
                    (application) =>
                        reorderedMap.get(
                            application.id
                        ) ?? application
                );
        } else {
            const sourceApplications =
                getColumnApplications(
                    activeApplication.status
                )
                    .filter(
                        (application) =>
                            application.id !==
                            activeId
                    )
                    .map(
                        (application, index) => ({
                            ...application,
                            position: index,
                        })
                    );

            const targetApplications =
                getColumnApplications(
                    newStatus
                ).filter(
                    (application) =>
                        application.id !==
                        activeId
                );

            let insertIndex =
                targetApplications.findIndex(
                    (application) =>
                        application.id === overId
                );

            if (
                insertIndex === -1 ||
                overId.startsWith("column-")
            ) {
                insertIndex =
                    targetApplications.length;
            }

            const movedApplication: JobApplication =
            {
                ...activeApplication,
                status: newStatus,
                position: insertIndex,
            };

            targetApplications.splice(
                insertIndex,
                0,
                movedApplication
            );

            const reorderedTargetApplications =
                targetApplications.map(
                    (application, index) => ({
                        ...application,
                        position: index,
                    })
                );

            const changedMap =
                new Map<
                    string,
                    JobApplication
                >();

            sourceApplications.forEach(
                (application) => {
                    changedMap.set(
                        application.id,
                        application
                    );
                }
            );

            reorderedTargetApplications.forEach(
                (application) => {
                    changedMap.set(
                        application.id,
                        application
                    );
                }
            );

            updatedApplications =
                applications.map(
                    (application) =>
                        changedMap.get(
                            application.id
                        ) ?? application
                );
        }

        const changedApplications =
            updatedApplications.filter(
                (application) => {
                    const oldApplication =
                        previousApplications.find(
                            (item) =>
                                item.id ===
                                application.id
                        );

                    return (
                        oldApplication &&
                        (oldApplication.status !==
                            application.status ||
                            oldApplication.position !==
                            application.position)
                    );
                }
            );

        if (
            changedApplications.length === 0
        ) {
            return;
        }

        setApplications(
            updatedApplications
        );

        const results =
            await Promise.all(
                changedApplications.map(
                    (application) =>
                        supabase
                            .from("applications")
                            .update({
                                status:
                                    application.status,
                                position:
                                    application.position,
                            })
                            .eq(
                                "id",
                                application.id
                            )
                )
            );

        const failedUpdate =
            results.find(
                (result) =>
                    result.error
            );

        if (failedUpdate?.error) {
            setApplications(
                previousApplications
            );

            alert(
                "Could not save the new Kanban position."
            );

            return;
        }

        router.refresh();
    }

    return (
        <section
            id="board"
            aria-labelledby={boardHeadingId}
            className="mt-8"
        >
            <div className="mb-4">
                <h2
                    id={boardHeadingId}
                    className="text-lg font-semibold text-[var(--text-primary)]"
                >
                    Applications
                </h2>

                <p className="mt-1 text-sm text-[var(--text-muted)]">
                    Search, filter, and drag applications
                    between stages.
                </p>
            </div>

            <div className="mb-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
                <div className="flex flex-col gap-3 xl:flex-row">
                    <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/30">
                        <Search
                            size={17}
                            aria-hidden="true"
                            className="shrink-0 text-[var(--text-muted)]"
                        />

                        <label
                            htmlFor={searchId}
                            className="sr-only"
                        >
                            Search applications
                        </label>

                        <input
                            id={searchId}
                            type="search"
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(
                                    event.target.value
                                )
                            }
                            aria-describedby={resultsId}
                            placeholder="Search company, role, location, source, work type..."
                            className="w-full bg-transparent py-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
                        />
                    </div>

                    <div
                        className="flex items-center gap-2 text-[var(--text-muted)]"
                        aria-hidden="true"
                    >
                        <SlidersHorizontal
                            size={17}
                        />

                        <span className="hidden text-sm md:inline">
                            Filters
                        </span>
                    </div>

                    <div>
                        <label
                            htmlFor={sourceFilterId}
                            className="sr-only"
                        >
                            Filter by application source
                        </label>

                        <select
                            id={sourceFilterId}
                            value={sourceFilter}
                            onChange={(event) =>
                                setSourceFilter(
                                    event.target.value as
                                    | "all"
                                    | ApplicationSource
                                )
                            }
                            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-secondary)] outline-none transition focus:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40 xl:w-auto"
                        >
                            <option value="all">
                                All Sources
                            </option>

                            <option value="job_portal">
                                Job Portal
                            </option>

                            <option value="career_page">
                                Career Page
                            </option>

                            <option value="cold_email">
                                Cold Email
                            </option>

                            <option value="recruiter_outreach">
                                Recruiter / HR
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
                            htmlFor={workTypeFilterId}
                            className="sr-only"
                        >
                            Filter by work type
                        </label>

                        <select
                            id={workTypeFilterId}
                            value={workTypeFilter}
                            onChange={(event) =>
                                setWorkTypeFilter(
                                    event.target.value as
                                    | "all"
                                    | WorkType
                                )
                            }
                            className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--text-secondary)] outline-none transition focus:border-[var(--primary)] focus-visible:ring-2 focus-visible:ring-[var(--primary)]/40 xl:w-auto"
                        >
                            <option value="all">
                                All Work Types
                            </option>

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

                    {filtersActive && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-4 py-3 text-sm text-[var(--text-muted)] transition hover:bg-[var(--surface-soft)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                        >
                            <X
                                size={16}
                                aria-hidden="true"
                            />

                            Clear
                        </button>
                    )}
                </div>

                <div
                    id={resultsId}
                    role="status"
                    aria-live="polite"
                    className="mt-3 text-xs text-[var(--text-muted)]"
                >
                    Showing{" "}
                    <span className="font-medium text-[var(--text-secondary)]">
                        {filteredApplications.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-[var(--text-secondary)]">
                        {applications.length}
                    </span>{" "}
                    applications
                </div>
            </div>

            <DndContext
                id={dndContextId}
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
            >
                <div
                    className="overflow-x-auto pb-4"
                    aria-label="Application Kanban board"
                >
                    <div className="grid min-w-[1400px] grid-cols-5 gap-4">
                        {columns.map((column) => (
                            <KanbanColumn
                                key={column.status}
                                title={column.title}
                                status={column.status}
                                color={column.color}
                                applications={getVisibleColumnApplications(
                                    column.status
                                )}
                                filtersActive={filtersActive}
                            />
                        ))}
                    </div>
                </div>
            </DndContext>
        </section>
    );
}