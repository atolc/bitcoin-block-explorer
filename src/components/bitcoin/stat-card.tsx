import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from "lucide-react"

const statCardVariants = cva(
    "relative overflow-hidden transition-all duration-300",
    {
        variants: {
            variant: {
                default: "hover:shadow-md",
                highlighted:
                    "border-bitcoin/30 bg-gradient-to-br from-bitcoin/5 to-transparent hover:border-bitcoin/50 hover:shadow-lg hover:shadow-bitcoin/5",
                compact: "border-0 bg-transparent shadow-none",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

type ChangeDirection = "up" | "down" | "neutral"

export interface StatCardProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
    title: string
    value: string | number
    icon?: LucideIcon
    change?: string
    changeDirection?: ChangeDirection
    description?: string
}

const changeConfig: Record<
    ChangeDirection,
    { icon: LucideIcon; color: string }
> = {
    up: { icon: TrendingUp, color: "text-success" },
    down: { icon: TrendingDown, color: "text-destructive" },
    neutral: { icon: Minus, color: "text-muted-foreground" },
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
    (
        {
            className,
            variant,
            title,
            value,
            icon: Icon,
            change,
            changeDirection = "neutral",
            description,
            ...props
        },
        ref
    ) => {
        const ChangeIcon = changeConfig[changeDirection].icon
        const changeColor = changeConfig[changeDirection].color

        return (
            <Card
                ref={ref}
                className={cn(statCardVariants({ variant }), className)}
                {...props}
            >
                <CardContent
                    className={cn(
                        "flex flex-col gap-2",
                        variant === "compact" ? "p-3" : "p-5"
                    )}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {title}
                        </span>
                        {Icon && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bitcoin/10">
                                <Icon className="h-4 w-4 text-bitcoin" />
                            </div>
                        )}
                    </div>

                    <div className="flex items-baseline gap-2">
                        <span
                            className={cn(
                                "font-heading font-bold tracking-tight",
                                variant === "compact" ? "text-xl" : "text-2xl"
                            )}
                        >
                            {value}
                        </span>

                        {change && (
                            <span
                                className={cn(
                                    "inline-flex items-center gap-0.5 text-xs font-medium",
                                    changeColor
                                )}
                            >
                                <ChangeIcon className="h-3 w-3" />
                                {change}
                            </span>
                        )}
                    </div>

                    {description && (
                        <p className="text-xs text-muted-foreground">{description}</p>
                    )}
                </CardContent>
            </Card>
        )
    }
)
StatCard.displayName = "StatCard"

export { StatCard, statCardVariants }
