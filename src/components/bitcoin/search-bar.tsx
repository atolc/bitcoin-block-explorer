import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

const searchBarVariants = cva("relative w-full", {
    variants: {
        variant: {
            default: "",
            hero: "",
            compact: "",
        },
    },
    defaultVariants: {
        variant: "default",
    },
})

const inputVariants = cva(
    "w-full font-mono transition-all duration-200 placeholder:font-sans",
    {
        variants: {
            variant: {
                default: "h-10 pl-10 pr-10 text-sm",
                hero: "h-14 rounded-xl pl-12 pr-14 text-base shadow-lg shadow-bitcoin/5 focus:shadow-xl focus:shadow-bitcoin/10 border-2 focus:border-bitcoin/50",
                compact: "h-8 pl-8 pr-8 text-xs rounded-md",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

type SearchType = "block" | "transaction" | "address" | "unknown"

function detectSearchType(query: string): SearchType {
    const trimmed = query.trim()
    if (/^\d+$/.test(trimmed)) return "block"
    // Mainnet & Testnet Legacy/P2SH (1, 3, m, n, 2)
    if (/^[13mn2][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(trimmed)) return "address"
    // Mainnet & Testnet Bech32 (bc1, tb1)
    if (/^(bc1|tb1)[a-zA-HJ-NP-Z0-9]{25,89}$/.test(trimmed)) return "address"
    if (/^[0-9a-fA-F]{64}$/.test(trimmed)) return "transaction"
    return "unknown"
}

const searchTypeLabels: Record<SearchType, string> = {
    block: "Block Height",
    transaction: "TX / Block Hash",
    address: "Address",
    unknown: "Search",
}

export interface SearchBarProps
    extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof searchBarVariants> {
    value?: string
    onValueChange?: (value: string) => void
    onSearch?: (value: string, type: SearchType) => void
    placeholder?: string
}

const SearchBar = React.forwardRef<HTMLDivElement, SearchBarProps>(
    (
        {
            className,
            variant,
            value: controlledValue,
            onValueChange,
            onSearch,
            placeholder,
            ...props
        },
        ref
    ) => {
        const [internalValue, setInternalValue] = React.useState("")
        const value = controlledValue ?? internalValue
        const searchType = detectSearchType(value)

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value
            setInternalValue(newValue)
            onValueChange?.(newValue)
        }

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault()
            if (value.trim()) {
                onSearch?.(value.trim(), searchType)
            }
        }

        const handleClear = () => {
            setInternalValue("")
            onValueChange?.("")
        }

        const iconSize = variant === "hero" ? "h-5 w-5" : variant === "compact" ? "h-3 w-3" : "h-4 w-4"
        const iconPosition = variant === "hero" ? "left-4" : variant === "compact" ? "left-2.5" : "left-3"

        return (
            <div
                ref={ref}
                className={cn(searchBarVariants({ variant }), className)}
                {...props}
            >
                <form onSubmit={handleSubmit} className="relative">
                    <Search
                        className={cn(
                            "absolute top-1/2 -translate-y-1/2 text-muted-foreground",
                            iconSize,
                            iconPosition
                        )}
                    />
                    <Input
                        type="text"
                        value={value}
                        onChange={handleChange}
                        placeholder={
                            placeholder ??
                            "Search by block height, tx hash, or address..."
                        }
                        className={cn(inputVariants({ variant }))}
                    />

                    {value && (
                        <div className={cn(
                            "absolute top-1/2 -translate-y-1/2 flex items-center gap-1",
                            variant === "hero" ? "right-3" : variant === "compact" ? "right-1.5" : "right-2"
                        )}>
                            {value.length > 2 && searchType !== "unknown" && (
                                <span className="rounded bg-bitcoin/10 px-1.5 py-0.5 text-[10px] font-medium text-bitcoin">
                                    {searchTypeLabels[searchType]}
                                </span>
                            )}
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={handleClear}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </div>
                    )}
                </form>
            </div>
        )
    }
)
SearchBar.displayName = "SearchBar"

export { SearchBar, searchBarVariants, detectSearchType }
export type { SearchType }
