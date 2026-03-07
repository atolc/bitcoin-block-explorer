import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Activity, Gauge, Inbox, DollarSign } from "lucide-react"

const networkStatusVariants = cva("w-full", {
    variants: {
        variant: {
            banner:
                "border-b border-border bg-card/80 backdrop-blur-sm",
            card: "rounded-lg border",
            minimal: "border-0 bg-transparent shadow-none",
        },
    },
    defaultVariants: {
        variant: "banner",
    },
})

export interface NetworkData {
    hashrate?: string
    difficulty?: string
    mempoolSize?: number
    btcPrice?: number
    blockHeight?: number
    avgBlockTime?: string
    unconfirmedTxs?: number
}

export interface NetworkStatusProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof networkStatusVariants> {
    data: NetworkData
    loading?: boolean
}

interface StatItemProps {
    icon: React.ElementType
    label: string
    value: string | number | undefined
    minimal?: boolean
}

function StatItem({ icon: Icon, label, value, minimal }: StatItemProps) {
    if (value === undefined) return null

    return (
        <div className={cn("flex items-center gap-2", minimal ? "gap-1.5" : "gap-2")}>
            <Icon
                className={cn(
                    "text-bitcoin shrink-0",
                    minimal ? "h-3 w-3" : "h-3.5 w-3.5"
                )}
            />
            <div className="flex items-center gap-1.5">
                <span
                    className={cn(
                        "text-muted-foreground whitespace-nowrap",
                        minimal ? "text-[10px]" : "text-xs"
                    )}
                >
                    {label}
                </span>
                <span
                    className={cn(
                        "font-mono font-medium whitespace-nowrap",
                        minimal ? "text-[10px]" : "text-xs"
                    )}
                >
                    {typeof value === "number" ? value.toLocaleString() : value}
                </span>
            </div>
        </div>
    )
}

const NetworkStatus = React.forwardRef<HTMLDivElement, NetworkStatusProps>(
    ({ className, variant, data, loading = false, ...props }, ref) => {
        const isMinimal = variant === "minimal"

        const stats = [
            { icon: Activity, label: "Hashrate", value: data.hashrate },
            { icon: Gauge, label: "Difficulty", value: data.difficulty },
            {
                icon: Inbox,
                label: "Mempool",
                value: data.mempoolSize !== undefined ? `${data.mempoolSize.toLocaleString()} txs` : undefined,
            },
            {
                icon: DollarSign,
                label: "BTC",
                value: data.btcPrice !== undefined ? `$${data.btcPrice.toLocaleString()}` : undefined,
            },
        ]

        const content = (
            <div
                className={cn(
                    "flex items-center flex-wrap",
                    variant === "banner"
                        ? "gap-4 px-4 py-2 md:gap-6"
                        : variant === "card"
                            ? "gap-4 p-4"
                            : "gap-3"
                )}
            >
                {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-4 w-24 animate-pulse rounded bg-muted"
                        />
                    ))
                    : stats.map(
                        (stat) =>
                            stat.value && (
                                <StatItem
                                    key={stat.label}
                                    icon={stat.icon}
                                    label={stat.label}
                                    value={stat.value}
                                    minimal={isMinimal}
                                />
                            )
                    )}
            </div>
        )

        if (variant === "card") {
            return (
                <Card
                    ref={ref}
                    className={cn(networkStatusVariants({ variant }), className)}
                    {...props}
                >
                    <CardContent className="p-0">{content}</CardContent>
                </Card>
            )
        }

        return (
            <div
                ref={ref}
                className={cn(networkStatusVariants({ variant }), className)}
                {...props}
            >
                {content}
            </div>
        )
    }
)
NetworkStatus.displayName = "NetworkStatus"

export { NetworkStatus, networkStatusVariants }
