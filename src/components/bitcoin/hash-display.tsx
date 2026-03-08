import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Copy, Check, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

const hashDisplayVariants = cva(
    "inline-flex items-center gap-1.5 font-mono transition-colors",
    {
        variants: {
            variant: {
                full: "text-sm break-all",
                truncated: "text-sm",
                short: "text-xs",
            },
            size: {
                sm: "text-xs",
                md: "text-sm",
                lg: "text-base",
            },
        },
        defaultVariants: {
            variant: "truncated",
            size: "md",
        },
    }
)

function truncateHash(hash: string | undefined | null, startChars = 8, endChars = 8): string {
    if (!hash) return ""
    if (hash.length <= startChars + endChars + 3) return hash
    return `${hash.slice(0, startChars)}...${hash.slice(-endChars)}`
}

export interface HashDisplayProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof hashDisplayVariants> {
    hash?: string | null
    copyable?: boolean
    linkTo?: string
    startChars?: number
    endChars?: number
}

const HashDisplay = React.forwardRef<HTMLSpanElement, HashDisplayProps>(
    (
        {
            className,
            variant,
            size,
            hash,
            copyable = true,
            linkTo,
            startChars = 8,
            endChars = 8,
            ...props
        },
        ref
    ) => {
        const [copied, setCopied] = React.useState(false)

        const displayHash =
            variant === "full"
                ? hash
                : variant === "short"
                    ? truncateHash(hash, 4, 4)
                    : truncateHash(hash, startChars, endChars)

        const handleCopy = async (e: React.MouseEvent) => {
            if (!hash) return
            e.preventDefault()
            e.stopPropagation()
            await navigator.clipboard.writeText(hash)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }

        return (
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span
                            ref={ref}
                            className={cn(
                                hashDisplayVariants({ variant, size }),
                                "group cursor-default hover:text-bitcoin",
                                className
                            )}
                            {...props}
                        >
                            <span className="select-all">{displayHash}</span>

                            {copyable && (
                                <button
                                    onClick={handleCopy}
                                    className="inline-flex h-5 w-5 items-center justify-center rounded opacity-0 transition-opacity group-hover:opacity-100 hover:bg-accent"
                                    aria-label="Copy hash"
                                >
                                    {copied ? (
                                        <Check className="h-3 w-3 text-success" />
                                    ) : (
                                        <Copy className="h-3 w-3 text-muted-foreground" />
                                    )}
                                </button>
                            )}

                            {linkTo && (
                                <a
                                    href={linkTo}
                                    className="inline-flex h-5 w-5 items-center justify-center rounded opacity-0 transition-opacity group-hover:opacity-100 hover:bg-accent"
                                    aria-label="View details"
                                >
                                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                </a>
                            )}
                        </span>
                    </TooltipTrigger>
                    {variant !== "full" && hash && (
                        <TooltipContent
                            side="top"
                            className="max-w-[400px] break-all font-mono text-xs"
                        >
                            {hash}
                        </TooltipContent>
                    )}
                </Tooltip>
            </TooltipProvider>
        )
    }
)
HashDisplay.displayName = "HashDisplay"

export { HashDisplay, hashDisplayVariants }
