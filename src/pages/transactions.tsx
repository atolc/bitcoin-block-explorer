import { TransactionTable } from "@/components/bitcoin/transaction-table"
import { useLatestTransactions } from "@/hooks/use-api"
import { ArrowRightLeft } from "lucide-react"

function Skeleton({ className = "" }: { className?: string }) {
    return (
        <div className={`animate-pulse rounded-md bg-muted ${className}`} />
    )
}

export default function TransactionsPage() {
    const { data: transactions, loading } = useLatestTransactions(20)

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bitcoin/10">
                        <ArrowRightLeft className="h-5 w-5 text-bitcoin" />
                    </div>
                    <div>
                        <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
                            Latest Transactions
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Unconfirmed transactions from the Bitcoin mempool
                        </p>
                    </div>
                </div>
            </div>

            {/* Transactions Table */}
            {loading ? (
                <div className="space-y-2">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <Skeleton key={i} className="h-12" />
                    ))}
                </div>
            ) : transactions && transactions.length > 0 ? (
                <TransactionTable data={transactions} pageSize={10} />
            ) : (
                <p className="text-center text-muted-foreground py-16">
                    No transactions available.
                </p>
            )}
        </div>
    )
}
