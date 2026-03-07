import { BlockCard } from "@/components/bitcoin/block-card"
import { BlockTable } from "@/components/bitcoin/block-table"
import { useLatestBlocks, usePaginatedBlocks } from "@/hooks/use-api"
import { useState } from "react"
import type { PaginationState } from "@tanstack/react-table"
import { useSharedNetworkStats } from "@/layouts/root-layout"
import { Blocks as BlocksIcon } from "lucide-react"

function Skeleton({ className = "" }: { className?: string }) {
    return (
        <div className={`animate-pulse rounded-md bg-muted ${className}`} />
    )
}

export default function BlocksPage() {
    const { data: latestBlocks, loading: latestLoading } = useLatestBlocks(4)
    const { data: networkStats } = useSharedNetworkStats()

    // Pagination state for the BlockTable
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    })

    const { data: paginatedResponse, loading: tableLoading } = usePaginatedBlocks(
        pagination.pageIndex + 1,
        pagination.pageSize
    )

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bitcoin/10">
                        <BlocksIcon className="h-5 w-5 text-bitcoin" />
                    </div>
                    <div>
                        <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
                            Latest Blocks
                        </h1>
                        {networkStats && (
                            <p className="text-sm text-muted-foreground">
                                Block height:{" "}
                                <span className="font-mono font-medium text-foreground">
                                    #{networkStats.blockHeight.toLocaleString()}
                                </span>
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Blocks Grid */}
            <div className="space-y-8">
                {/* Featured & Latest Blocks */}
                <div className="space-y-3">
                    {latestLoading || !latestBlocks ? (
                        <>
                            <Skeleton className="h-64 md:h-56" />
                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                <Skeleton className="h-40" />
                                <Skeleton className="h-40" />
                                <Skeleton className="h-40" />
                            </div>
                        </>
                    ) : latestBlocks.length > 0 ? (
                        <>
                            <BlockCard block={latestBlocks[0]} variant="featured" />
                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                {latestBlocks.slice(1, 4).map((block) => (
                                    <BlockCard key={block.height} block={block} />
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">
                            No featured blocks available.
                        </p>
                    )}
                </div>

                {/* Paginated Blocks Table */}
                <div className="space-y-4">
                    <h2 className="font-heading text-xl font-bold tracking-tight">
                        Older Blocks
                    </h2>
                    <div className="relative">
                        <BlockTable
                            data={paginatedResponse?.data || []}
                            pageCount={paginatedResponse?.totalPages || -1}
                            pagination={pagination}
                            onPaginationChange={setPagination}
                            isLoading={tableLoading || (!paginatedResponse && latestLoading)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
