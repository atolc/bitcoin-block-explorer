import * as React from "react"
import { Link, useLocation } from "react-router"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { SearchBar } from "@/components/bitcoin/search-bar"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Bitcoin, Menu, Blocks, ArrowRightLeft, BarChart3 } from "lucide-react"

interface NavItem {
    label: string
    href: string
    icon: React.ElementType
}

const defaultNavItems: NavItem[] = [
    { label: "Blocks", href: "/blocks", icon: Blocks },
    { label: "Transactions", href: "/transactions", icon: ArrowRightLeft },
    { label: "Stats", href: "/stats", icon: BarChart3 },
]

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
    navItems?: NavItem[]
    showSearch?: boolean
    onSearch?: (value: string) => void
}

const Header = React.forwardRef<HTMLElement, HeaderProps>(
    (
        { className, navItems = defaultNavItems, showSearch = true, onSearch, ...props },
        ref
    ) => {
        const [isOpen, setIsOpen] = React.useState(false)
        const location = useLocation()

        function isActive(href: string) {
            return location.pathname === href || location.pathname.startsWith(href + "/")
        }

        return (
            <header
                ref={ref}
                className={cn(
                    "sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg",
                    className
                )}
                {...props}
            >
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 shrink-0">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-bitcoin text-bitcoin-foreground">
                            <Bitcoin className="h-5 w-5" />
                        </div>
                        <div className="hidden sm:block">
                            <span className="font-heading text-lg font-bold tracking-tight">
                                BTC
                            </span>
                            <span className="font-heading text-lg font-light text-muted-foreground">
                                Explorer
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    isActive(item.href)
                                        ? "bg-accent text-accent-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Search + Actions */}
                    <div className="flex items-center gap-2 flex-1 max-w-sm justify-end">
                        {showSearch && (
                            <div className="hidden lg:block w-full">
                                <SearchBar
                                    variant="compact"
                                    onSearch={(val) => onSearch?.(val)}
                                />
                            </div>
                        )}
                        <ThemeToggle />

                        {/* Mobile Menu */}
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden h-9 w-9"
                                >
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-72">
                                <SheetTitle className="flex items-center gap-2 px-2 mb-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-bitcoin text-bitcoin-foreground">
                                        <Bitcoin className="h-4 w-4" />
                                    </div>
                                    <span className="font-heading font-bold">BTC Explorer</span>
                                </SheetTitle>

                                {showSearch && (
                                    <>
                                        <div className="px-2 mb-4">
                                            <SearchBar
                                                variant="default"
                                                onSearch={(val) => {
                                                    onSearch?.(val)
                                                    setIsOpen(false)
                                                }}
                                            />
                                        </div>
                                        <Separator className="mb-4" />
                                    </>
                                )}

                                <nav className="flex flex-col gap-1 px-2">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            to={item.href}
                                            className={cn(
                                                "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                                isActive(item.href)
                                                    ? "bg-accent text-accent-foreground"
                                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                            )}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <item.icon className="h-4 w-4" />
                                            {item.label}
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>
        )
    }
)
Header.displayName = "Header"

export { Header }
