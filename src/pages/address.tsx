import { useParams } from "react-router"
import { useAddress, useAddressTransactions } from "@/hooks/use-api"
import { HashDisplay } from "@/components/bitcoin/hash-display"
import { TransactionTable } from "@/components/bitcoin/transaction-table"
import { StatCard } from "@/components/bitcoin/stat-card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Wallet, ArrowDownLeft, ArrowUpRight, History, Activity } from "lucide-react"

export default function AddressPage() {
    const { address } = useParams<{ address: string }>()
    const { data: info, loading: infoLoading, error: infoError } = useAddress(address)
    const { data: transactions, loading: txLoading } = useAddressTransactions(address)

    if (infoLoading) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-16 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-bitcoin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading address information...</p>
            </div>
        )
    }

    if (infoError || !info) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-destructive mb-2">Error loading address</h1>
                <p className="text-muted-foreground">{infoError || "Address not found"}</p>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bitcoin/10">
                        <Wallet className="h-6 w-6 text-bitcoin" />
                    </div>
                    <div>
                        <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
                            Address Detail
                        </h1>
                        <Badge variant="outline" className="mt-1 border-bitcoin/30 text-bitcoin">
                            Bitcoin Testnet4
                        </Badge>
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex flex-col gap-2">
                        <span className="text-sm font-medium text-muted-foreground">Address Hash</span>
                        <div className="flex items-center gap-2">
                            <HashDisplay hash={info.address} variant="full" size="lg" copyable />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatCard
                    title="Balance"
                    value={`${info.balance.toFixed(8)} BTC`}
                    icon={Wallet}
                    variant="highlighted"
                />
                <StatCard
                    title="Total Received"
                    value={`${info.received.toFixed(8)} BTC`}
                    icon={ArrowDownLeft}
                />
                <StatCard
                    title="Total Sent"
                    value={`${info.sent.toFixed(8)} BTC`}
                    icon={ArrowUpRight}
                />
                <StatCard
                    title="Transactions"
                    value={info.txCount.toLocaleString()}
                    icon={History}
                />
            </div>

            {/* Mempool Stats if any */}
            {(info.unconfirmedBalance !== 0 || info.unconfirmedTxCount > 0) && (
                <div className="mb-8 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 flex items-center gap-4">
                    <Activity className="h-5 w-5 text-amber-500" />
                    <div className="text-sm">
                        <span className="font-semibold text-amber-600">Unconfirmed:</span>
                        <span className="ml-2 font-mono text-amber-700">
                            {info.unconfirmedBalance.toFixed(8)} BTC ({info.unconfirmedTxCount} txs)
                        </span>
                    </div>
                </div>
            )}

            <Separator className="my-8" />

            {/* Transactions Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight">Latest Transactions</h2>
                    <Badge variant="secondary" className="font-mono">
                        {info.txCount} Total
                    </Badge>
                </div>

                {txLoading ? (
                    <div className="space-y-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 w-full animate-pulse bg-muted rounded-lg" />
                        ))}
                    </div>
                ) : transactions && transactions.length > 0 ? (
                    <TransactionTable data={transactions} showPagination={false} />
                ) : (
                    <div className="rounded-lg border border-dashed p-12 text-center">
                        <p className="text-muted-foreground">No transactions found for this address.</p>
                    </div>
                )}
            </section>
        </div>
    )
}
