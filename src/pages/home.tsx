import { SearchBar } from "@/components/bitcoin/search-bar"
import { StatCard } from "@/components/bitcoin/stat-card"
import { BlockCard } from "@/components/bitcoin/block-card"
import { TransactionTable } from "@/components/bitcoin/transaction-table"
import { NetworkStatus } from "@/components/bitcoin/network-status"
import { HashDisplay } from "@/components/bitcoin/hash-display"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Blocks,
    ArrowRightLeft,
    Activity,
    TrendingUp,
    Cpu,
    Wallet,
    ArrowRight,
} from "lucide-react"
import { useLatestBlocks, usePaginatedTransactions } from "@/hooks/use-api"
import { useSharedNetworkStats } from "@/layouts/root-layout"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useSearch } from "@/hooks/use-search"

// ─── Skeleton Loader ───────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
    return (
        <div className={`animate-pulse rounded-md bg-muted ${className}`} />
    )
}

// ─── Home Page ─────────────────────────────────────────────────
export default function HomePage() {
    const { data: networkStats, loading: networkLoading } =
        useSharedNetworkStats()

    const { data: blocks, loading: blocksLoading } = useLatestBlocks(4)

    // Pagination state for transactions
    const [txPage, setTxPage] = useState(1)
    const txLimit = 10
    const { data: txData, loading: txLoading } = usePaginatedTransactions(txPage, txLimit)

    const blockHeight = networkStats?.blockHeight ?? 0
    const hashrate = networkStats?.hashrate ?? "—"
    const difficulty = networkStats?.difficulty ?? "—"
    const mempoolSize = networkStats?.mempoolSize ?? 0
    const btcPrice = networkStats?.btcPrice ?? 0

    const networkData = networkStats ?? {
        hashrate: "—",
        difficulty: "—",
        mempoolSize: 0,
        btcPrice: 0,
        blockHeight: 0,
        unconfirmedTxs: 0,
    }

    const { handleSearch } = useSearch()

    return (
        <>
            {/* Hero Section */}
            <section className="relative overflow-hidden border-b bg-gradient-to-b from-bitcoin/5 via-transparent to-transparent">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-bitcoin/10 via-transparent to-transparent" />
                <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                            Explore the{" "}
                            <span className="bg-gradient-to-r from-bitcoin to-amber-600 bg-clip-text text-transparent">
                                Bitcoin Testnet4
                            </span>
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Search blocks, transactions, and addresses on the
                            Bitcoin Testnet4 network in real-time.
                        </p>
                        <div className="mt-8">
                            <SearchBar variant="hero" onSearch={handleSearch} />
                        </div>
                    </div>
                </div>
            </section>

            <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
                {/* Stats Grid */}
                <section className="mb-8">
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                        {networkLoading ? (
                            <>
                                <Skeleton className="h-28" />
                                <Skeleton className="h-28" />
                                <Skeleton className="h-28" />
                                <Skeleton className="h-28" />
                            </>
                        ) : (
                            <>
                                <StatCard
                                    title="Block Height"
                                    value={`#${blockHeight.toLocaleString()}`}
                                    icon={Blocks}
                                    variant="highlighted"
                                />
                                <StatCard
                                    title="Unconfirmed TXs"
                                    value={mempoolSize.toLocaleString()}
                                    icon={ArrowRightLeft}
                                />
                                <StatCard
                                    title="Hashrate"
                                    value={hashrate}
                                    icon={Cpu}
                                />
                                <StatCard
                                    title="BTC Price"
                                    value={`$${btcPrice.toLocaleString()}`}
                                    icon={Wallet}
                                />
                            </>
                        )}
                    </div>
                </section>

                <Separator className="mb-8" />

                {/* Tabs Section */}
                <Tabs defaultValue="blocks" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <TabsList>
                            <TabsTrigger
                                value="blocks"
                                className="flex items-center gap-1.5"
                            >
                                <Blocks className="h-4 w-4" />
                                Latest Blocks
                            </TabsTrigger>
                            <TabsTrigger
                                value="transactions"
                                className="flex items-center gap-1.5"
                            >
                                <ArrowRightLeft className="h-4 w-4" />
                                Transactions
                            </TabsTrigger>
                            <TabsTrigger
                                value="network"
                                className="flex items-center gap-1.5"
                            >
                                <Activity className="h-4 w-4" />
                                Network
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Blocks Tab */}
                    <TabsContent value="blocks" className="space-y-3">
                        {blocksLoading ? (
                            <div className="space-y-3">
                                <Skeleton className="h-40" />
                                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                    <Skeleton className="h-32" />
                                    <Skeleton className="h-32" />
                                    <Skeleton className="h-32" />
                                </div>
                            </div>
                        ) : blocks && blocks.length > 0 ? (
                            <>
                                <BlockCard
                                    block={blocks[0]}
                                    variant="featured"
                                />
                                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                    {blocks.slice(1).map((block) => (
                                        <BlockCard
                                            key={block.height}
                                            block={block}
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-end pt-2">
                                    <Button asChild variant="ghost" className="text-bitcoin hover:text-bitcoin/80 hover:bg-bitcoin/10">
                                        <Link to="/blocks">
                                            View all blocks
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <p className="text-center text-muted-foreground py-8">
                                No blocks available.
                            </p>
                        )}
                    </TabsContent>

                    {/* Transactions Tab */}
                    <TabsContent value="transactions">
                        {txLoading ? (
                            <div className="space-y-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Skeleton key={i} className="h-12" />
                                ))}
                            </div>
                        ) : txData && txData.data.length > 0 ? (
                            <TransactionTable
                                data={txData.data}
                                pageSize={txLimit}
                                pageIndex={txPage - 1}
                                pageCount={txData.totalPages}
                                totalItems={txData.total}
                                onPageChange={(index) => setTxPage(index + 1)}
                            />
                        ) : (
                            <p className="text-center text-muted-foreground py-8">
                                No transactions available.
                            </p>
                        )}
                    </TabsContent>

                    {/* Network Tab */}
                    <TabsContent value="network" className="space-y-4">
                        <NetworkStatus
                            variant="card"
                            data={networkData}
                            loading={networkLoading}
                        />
                        {networkLoading ? (
                            <div className="grid gap-4 md:grid-cols-2">
                                <Skeleton className="h-28" />
                                <Skeleton className="h-28" />
                            </div>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2">
                                <StatCard
                                    title="Difficulty"
                                    value={difficulty}
                                    icon={TrendingUp}
                                    variant="highlighted"
                                />
                                <StatCard
                                    title="Unconfirmed TXs"
                                    value={mempoolSize.toLocaleString()}
                                    icon={Activity}
                                    description="Mempool size"
                                />
                            </div>
                        )}

                        {blocks && blocks.length > 0 && (
                            <div className="rounded-lg border p-4">
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
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </>
    )
}
