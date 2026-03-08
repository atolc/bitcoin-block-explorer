import { useParams, Link } from "react-router"
import { useTransaction } from "@/hooks/use-api"
import { HashDisplay } from "@/components/bitcoin/hash-display"
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
                    <div className="space-y-3 min-w-0">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Inputs ({tx.inputs.length})</h3>
                        <div className="space-y-3">
                            {tx.inputs.map((input, i) => (
                                <div key={i} className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:border-bitcoin/30">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                        <div className="min-w-0 flex-1 space-y-2">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase tracking-wider">Prev TX</span>
                                                <Link
                                                    to={`/tx/${input.prevOut.hash}`}
                                                    className="block max-w-full"
                                                >
                                                    <HashDisplay
                                                        hash={input.prevOut.hash}
                                                        variant="truncated"
                                                        size="sm"
                                                        className="text-bitcoin hover:text-bitcoin/80"
                                                    />
                                                </Link>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {input.prevOut.addr ? (
                                                    <Link to={`/address/${input.prevOut.addr}`} className="hover:text-bitcoin transition-colors">
                                                        <HashDisplay
                                                            hash={input.prevOut.addr}
                                                            variant="full"
                                                            size="md"
                                                        />
                                                    </Link>
                                                ) : (
                                                    <HashDisplay
                                                        hash="Coinbase"
                                                        variant="full"
                                                        size="md"
                                                        className="text-muted-foreground italic"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
                                            <span className="text-xs text-muted-foreground sm:hidden font-medium uppercase tracking-wider">Amount</span>
                                            <div className="text-right">
                                                <div className="text-base font-bold text-foreground">{input.prevOut.value.toFixed(8)}</div>
                                                <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest text-right">BTC</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Arrow (Desktop only) */}
                    <div className="hidden lg:flex items-center justify-center self-center pt-8">
                        <div className="h-12 w-12 flex items-center justify-center rounded-full bg-bitcoin/5 border border-bitcoin/10 shadow-inner">
                            <ArrowRight className="h-6 w-6 text-bitcoin" />
                        </div>
                    </div>

                    {/* Outputs */}
                    <div className="space-y-3 min-w-0">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Outputs ({tx.outputs.length})</h3>
                        <div className="space-y-3">
                            {tx.outputs.map((output, i) => (
                                <div key={i} className="rounded-xl border bg-card p-4 shadow-sm transition-all hover:border-bitcoin/30">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                        <div className="min-w-0 flex-1 space-y-2">
                                            <div className="flex items-center gap-2">
                                                {output.addr ? (
                                                    <Link to={`/address/${output.addr}`} className="hover:text-bitcoin transition-colors">
                                                        <HashDisplay
                                                            hash={output.addr}
                                                            variant="full"
                                                            size="md"
                                                        />
                                                    </Link>
                                                ) : (
                                                    <HashDisplay
                                                        hash="Script / OP_RETURN"
                                                        variant="full"
                                                        size="md"
                                                        className="text-muted-foreground italic"
                                                    />
                                                )}
                                            </div>
                                            <div className="bg-muted/30 p-2 rounded-md border border-border/50">
                                                <div className="text-[10px] text-muted-foreground font-mono truncate uppercase mb-1">Script PubKey</div>
                                                <div className="text-[10px] font-mono break-all line-clamp-2 text-muted-foreground">
                                                    {output.script}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
                                            <span className="text-xs text-muted-foreground sm:hidden font-medium uppercase tracking-wider">Amount</span>
                                            <div className="text-right">
                                                <div className="text-base font-bold text-success">{output.value.toFixed(8)}</div>
                                                <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest text-right">BTC</div>
                                            </div>
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
                    <div className="grid grid-cols-1 sm:grid-cols-3 px-6 py-4 gap-2">
                        <div className="text-sm font-medium text-muted-foreground">Included in Block</div>
                        <div className="sm:col-span-2 text-sm">
                            {tx.confirmations > 0 ? (
                                <span className="inline-flex items-center rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500">
                                    Confirmed
                                </span>
                            ) : (
                                <span className="inline-flex items-center rounded-full bg-bitcoin/10 px-2.5 py-0.5 text-xs font-medium text-bitcoin">
                                    Mempool / Pending
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 px-6 py-4 gap-2">
                        <div className="text-sm font-medium text-muted-foreground">Timestamp</div>
                        <div className="sm:col-span-2 text-sm">
                            <span className="font-mono text-muted-foreground">
                                {new Date(tx.timestamp).toLocaleString()}
                            </span>
                            <span className="ml-2 text-muted-foreground hidden sm:inline">
                                ({formatDistanceToNow(new Date(tx.timestamp))} ago)
                            </span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 px-6 py-4 gap-2">
                        <div className="text-sm font-medium text-muted-foreground">Virtual Size</div>
                        <div className="sm:col-span-2 text-sm font-mono">{Math.round(tx.weight / 4)} vB</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 px-6 py-4 gap-2">
                        <div className="text-sm font-medium text-muted-foreground">Raw Size</div>
                        <div className="sm:col-span-2 text-sm font-mono">{tx.size} B</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 px-6 py-4 gap-2">
                        <div className="text-sm font-medium text-muted-foreground">Weight</div>
                        <div className="sm:col-span-2 text-sm font-mono">{tx.weight} WU</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
