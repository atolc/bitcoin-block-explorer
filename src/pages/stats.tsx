import { StatCard } from "@/components/bitcoin/stat-card"
import { NetworkStatus } from "@/components/bitcoin/network-status"
import { HashDisplay } from "@/components/bitcoin/hash-display"
import { useLatestBlocks } from "@/hooks/use-api"
import { useSharedNetworkStats } from "@/layouts/root-layout"
import {
    BarChart3,
    Activity,
    TrendingUp,
    Cpu,
    Wallet,
    Blocks,
    ArrowRightLeft,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

function Skeleton({ className = "" }: { className?: string }) {
    return (
        <div className={`animate-pulse rounded-md bg-muted ${className}`} />
    )
}

export default function StatsPage() {
    const { data: networkStats, loading: networkLoading } =
        useSharedNetworkStats()
    const { data: blocks } = useLatestBlocks(1)

    const networkData = networkStats ?? {
        hashrate: "—",
        difficulty: "—",
        mempoolSize: 0,
        btcPrice: 0,
        blockHeight: 0,
        unconfirmedTxs: 0,
    }

    const blockHeight = networkStats?.blockHeight ?? 0
    const hashrate = networkStats?.hashrate ?? "—"
    const difficulty = networkStats?.difficulty ?? "—"
    const mempoolSize = networkStats?.mempoolSize ?? 0
    const btcPrice = networkStats?.btcPrice ?? 0

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bitcoin/10">
                        <BarChart3 className="h-5 w-5 text-bitcoin" />
                    </div>
                    <div>
                        <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
                            Network Statistics
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Real-time Bitcoin network metrics
                        </p>
                    </div>
                </div>
            </div>

            {/* Network Overview Card */}
            <NetworkStatus
                variant="card"
                data={networkData}
                loading={networkLoading}
            />

            <Separator className="my-8" />

            {/* Stats Grid */}
            {networkLoading ? (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                    <Skeleton className="h-28" />
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                    <StatCard
                        title="Block Height"
                        value={`#${blockHeight.toLocaleString()}`}
                        icon={Blocks}
                        variant="highlighted"
                    />
                    <StatCard
                        title="Hashrate"
                        value={hashrate}
                        icon={Cpu}
                    />
                    <StatCard
                        title="Difficulty"
                        value={difficulty}
                        icon={TrendingUp}
                        variant="highlighted"
                    />
                    <StatCard
                        title="BTC Price"
                        value={`$${btcPrice.toLocaleString()}`}
                        icon={Wallet}
                    />
                    <StatCard
                        title="Unconfirmed TXs"
                        value={mempoolSize.toLocaleString()}
                        icon={ArrowRightLeft}
                    />
                    <StatCard
                        title="Mempool Size"
                        value={`${mempoolSize.toLocaleString()} txs`}
                        icon={Activity}
                        description="Pending transactions"
                    />
                </div>
            )}

            {/* Latest Block Hash */}
            {blocks && blocks.length > 0 && (
                <>
                    <Separator className="my-8" />
                    <div className="rounded-lg border p-6">
                        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                            Latest Block Hash
                        </h3>
                        <HashDisplay
                            hash={blocks[0].hash}
                            variant="full"
                            size="sm"
                            copyable
                        />
                    </div>
                </>
            )}
        </div>
    )
}
