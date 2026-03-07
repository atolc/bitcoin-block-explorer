import * as React from "react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import { Bitcoin, Github, Heart } from "lucide-react"

export interface FooterProps extends React.HTMLAttributes<HTMLElement> { }

const Footer = React.forwardRef<HTMLElement, FooterProps>(
    ({ className, ...props }, ref) => {
        return (
            <footer
                ref={ref}
                className={cn("border-t bg-card/50", className)}
                {...props}
            >
                <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                        {/* Brand */}
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-bitcoin/10">
                                <Bitcoin className="h-3.5 w-3.5 text-bitcoin" />
                            </div>
                            <span className="text-sm text-muted-foreground">
                                <span className="font-heading font-semibold text-foreground">
                                    BTC
                                </span>{" "}
                                Explorer
                            </span>
                        </div>

                        {/* Links */}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 transition-colors hover:text-foreground"
                            >
                                <Github className="h-3.5 w-3.5" />
                                GitHub
                            </a>
                            <Separator orientation="vertical" className="h-3" />
                            <span className="flex items-center gap-1">
                                Made with <Heart className="h-3 w-3 text-bitcoin" /> &amp; ₿
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        )
    }
)
Footer.displayName = "Footer"

export { Footer }
