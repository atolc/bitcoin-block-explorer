import { BlockCard } from "@/components/bitcoin/block-card"
import { BlockTable } from "@/components/bitcoin/block-table"
import { useLatestBlocks } from "@/hooks/use-api"
import { useSharedNetworkStats } from "@/layouts/root-layout"
import { Blocks as BlocksIcon } from "lucide-react"

function Skeleton({ className = "" }: { className?: string }) {
    return (
        <div className={`animate-pulse rounded-md bg-muted ${className}`} />
    )
}

export default function BlocksPage() {
    const { data: blocks, loading } = useLatestBlocks(50)
    const { data: networkStats } = useSharedNetworkStats()

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
            {loading ? (
                <div className="space-y-3">
                    <Skeleton className="h-40" />
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        <Skeleton className="h-32" />
                        <Skeleton className="h-32" />
                        <Skeleton className="h-32" />
                        <Skeleton className="h-32" />
                        <Skeleton className="h-32" />
                        <Skeleton className="h-32" />
                    </div>
                </div>
            ) : blocks && blocks.length > 0 ? (
                <div className="space-y-8">
                    <div className="space-y-3">
                        <BlockCard block={blocks[0]} variant="featured" />
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                            {blocks.slice(1, 4).map((block) => (
                                <BlockCard key={block.height} block={block} />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="font-heading text-xl font-bold tracking-tight">
                            Older Blocks
                        </h2>
                        <BlockTable data={blocks.slice(4)} pageSize={10} />
                    </div>
                </div>
            ) : (
                <p className="text-center text-muted-foreground py-16">
                    No blocks available.
                </p>
            )}
        </div>
    )
}
