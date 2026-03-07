import { useParams, Link } from "react-router"
import { useTransaction } from "@/hooks/use-api"
import { ArrowRightLeft, Clock, Database, Scale, Hash, ArrowRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

function Skeleton({ className = "" }: { className?: string }) {
    return <div className={`animate-pulse rounded-md bg-muted ${className}`} />
}

export default function TransactionDetailPage() {
    const { hash } = useParams<{ hash: string }>()
    const { data: tx, loading, error } = useTransaction(hash)

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
                <div className="mb-8 space-y-4">
                    <Skeleton className="h-10 w-64" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                    <Skeleton className="h-32 md:col-span-1" />
                    <Skeleton className="h-32 md:col-span-1" />
                    <Skeleton className="h-32 md:col-span-1" />
                </div>
                <div className="mt-8 space-y-4">
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        )
    }

    if (error || !tx) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-16 text-center">
                <h1 className="text-2xl font-bold text-red-500">Error Loading Transaction</h1>
                <p className="mt-2 text-muted-foreground">{error || "Transaction not found"}</p>
                <Link to="/transactions" className="mt-6 inline-flex text-bitcoin hover:underline">
                    Back to Transactions
                </Link>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bitcoin/10">
                        <ArrowRightLeft className="h-5 w-5 text-bitcoin" />
                    </div>
                    <div>
                        <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
                            Transaction
                        </h1>
                        <p className="text-sm text-muted-foreground break-all font-mono">
                            {tx.hash}
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <div className="rounded-xl border bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Clock className="h-4 w-4" />
                        <span>Status</span>
                    </div>
                    <div className="text-lg font-semibold">
                        {tx.confirmations > 0 ? (
                            <span className="text-green-500">Confirmed</span>
                        ) : (
                            <span className="text-bitcoin">Unconfirmed</span>
                        )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 text-nowrap">
                        {tx.confirmations} Confirmations
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Database className="h-4 w-4" />
                        <span>Total Value</span>
                    </div>
                    <div className="text-lg font-semibold">
                        {tx.value} BTC
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                        Sum of all outputs
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Scale className="h-4 w-4" />
                        <span>Fee</span>
                    </div>
                    <div className="text-lg font-semibold">
                        {tx.fee} BTC
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                        Transaction fee
                    </div>
                </div>

                <div className="rounded-xl border bg-card p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Hash className="h-4 w-4" />
                        <span>Size / Weight</span>
                    </div>
                    <div className="text-lg font-semibold">
                        {tx.size} B
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                        {tx.weight} WU
                    </div>
                </div>
            </div>

            {/* Inputs and Outputs */}
            <div className="space-y-6">
                <h2 className="text-xl font-bold">In- & Outputs</h2>

                <div className="grid gap-6 lg:grid-cols-[1fr,auto,1fr]">
                    {/* Inputs */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Inputs ({tx.inputs.length})</h3>
                        <div className="space-y-2">
                            {tx.inputs.map((input, i) => (
                                <div key={i} className="rounded-lg border bg-card p-3 shadow-sm">
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-1.5 mb-1">
                                                <span className="text-xs font-mono text-muted-foreground">PREV TX:</span>
                                                <Link
                                                    to={`/tx/${input.prevOut.hash}`}
                                                    className="text-xs font-mono text-bitcoin hover:underline truncate block max-w-full"
                                                >
                                                    {input.prevOut.hash}
                                                </Link>
                                            </div>
                                            <div className="text-sm font-mono break-all leading-tight">
                                                {input.prevOut.addr || "Unknown / Coinbase"}
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="text-sm font-semibold">{input.prevOut.value.toFixed(8)}</div>
                                            <div className="text-[10px] text-muted-foreground uppercase">BTC</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Arrow (Desktop only) */}
                    <div className="hidden lg:flex items-center justify-center self-center pt-8">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-bitcoin/5">
                            <ArrowRight className="h-6 w-6 text-bitcoin" />
                        </div>
                    </div>

                    {/* Outputs */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Outputs ({tx.outputs.length})</h3>
                        <div className="space-y-2">
                            {tx.outputs.map((output, i) => (
                                <div key={i} className="rounded-lg border bg-card p-3 shadow-sm">
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="min-w-0 flex-1">
                                            <div className="text-sm font-mono break-all leading-tight mb-1">
                                                {output.addr || "OpReturn / Script"}
                                            </div>
                                            <div className="text-[10px] text-muted-foreground font-mono truncate">
                                                {output.script.substring(0, 60)}...
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="text-sm font-semibold">{output.value.toFixed(8)}</div>
                                            <div className="text-[10px] text-muted-foreground uppercase">BTC</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Details */}
            <div className="mt-12 rounded-xl border bg-card overflow-hidden shadow-sm">
                <div className="border-b bg-muted/30 px-6 py-4">
                    <h3 className="font-bold">Summary Details</h3>
                </div>
                <div className="divide-y">
                    <div className="grid grid-cols-1 sm:grid-cols-3 px-6 py-4">
                        <div className="text-sm font-medium text-muted-foreground">Included in Block</div>
                        <div className="sm:col-span-2 text-sm font-mono">
                            {tx.confirmations > 0 ? "Confirmed" : "Mempool / Pending"}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 px-6 py-4">
                        <div className="text-sm font-medium text-muted-foreground">Timestamp</div>
                        <div className="sm:col-span-2 text-sm">
                            {new Date(tx.timestamp).toLocaleString()} ({formatDistanceToNow(new Date(tx.timestamp))} ago)
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 px-6 py-4">
                        <div className="text-sm font-medium text-muted-foreground">Virtual Size</div>
                        <div className="sm:col-span-2 text-sm">{Math.round(tx.weight / 4)} vB</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
