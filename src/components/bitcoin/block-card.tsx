import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { HashDisplay } from "./hash-display"
import { Clock, Layers, ArrowRightLeft, HardDrive } from "lucide-react"

const blockCardVariants = cva(
    "group relative overflow-hidden transition-all duration-300 cursor-pointer",
    {
        variants: {
            variant: {
                default: "hover:shadow-md hover:border-bitcoin/30",
                compact: "hover:bg-accent/50",
                featured:
                    "border-bitcoin/20 bg-gradient-to-br from-bitcoin/5 via-transparent to-transparent hover:border-bitcoin/40 hover:shadow-lg hover:shadow-bitcoin/5",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BlockData {
    height: number
    hash: string
    timestamp: string | Date
    txCount: number
    size: number
    miner?: string
    confirmations?: number
}

export interface BlockCardProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "children">,
    VariantProps<typeof blockCardVariants> {
    block: BlockData
}

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function formatTime(timestamp: string | Date): string {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return date.toLocaleDateString()
}

const BlockCard = React.forwardRef<HTMLDivElement, BlockCardProps>(
    ({ className, variant, block, ...props }, ref) => {
        return (
            <Card
                ref={ref}
                className={cn(blockCardVariants({ variant }), className)}
                {...props}
            >
                {variant === "featured" && (
                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-bitcoin/5 transition-transform duration-500 group-hover:scale-150" />
                )}

                <CardHeader
                    className={cn(
                        "flex flex-row items-center justify-between",
                        variant === "compact" ? "p-3 pb-1" : "p-5 pb-2"
                    )}
                >
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bitcoin/10 font-heading text-sm font-bold text-bitcoin">
                            <Layers className="h-4 w-4" />
                        </div>
                        <div>
                            <span className="font-heading text-lg font-bold">
                                #{block.height.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {block.confirmations !== undefined && (
                            <Badge
                                variant={block.confirmations > 6 ? "default" : "secondary"}
                                className={cn(
                                    block.confirmations > 6
                                        ? "bg-success/10 text-success hover:bg-success/20"
                                        : "bg-warning/10 text-warning hover:bg-warning/20"
                                )}
                            >
                                {block.confirmations > 6
                                    ? "Confirmed"
                                    : `${block.confirmations} confirms`}
                            </Badge>
                        )}
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatTime(block.timestamp)}
                        </span>
                    </div>
                </CardHeader>

                <CardContent
                    className={cn(variant === "compact" ? "p-3 pt-1" : "p-5 pt-2")}
                >
                    <div className="mb-3">
                        <HashDisplay
                            hash={block.hash}
                            variant={variant === "compact" ? "short" : "truncated"}
                            size="sm"
                            className="text-muted-foreground"
                        />
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <ArrowRightLeft className="h-3 w-3" />
                            <span className="font-medium text-foreground">
                                {block.txCount.toLocaleString()}
                            </span>{" "}
                            txs
                        </span>
                        <span className="flex items-center gap-1">
                            <HardDrive className="h-3 w-3" />
                            <span className="font-medium text-foreground">
                                {formatSize(block.size)}
                            </span>
                        </span>
                        {block.miner && (
                            <span className="ml-auto truncate max-w-[120px]">
                                ⛏ {block.miner}
                            </span>
                        )}
                    </div>
                </CardContent>
            </Card>
        )
    }
)
BlockCard.displayName = "BlockCard"

export { BlockCard, blockCardVariants }
