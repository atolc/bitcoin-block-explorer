import * as React from "react"
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    useReactTable,
    type SortingState,
    type VisibilityState,
    type ColumnFiltersState,
} from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { HashDisplay } from "./hash-display"
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react"
import type { BlockSummary } from "@/types"
import { Link } from "react-router"

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

const defaultColumns: ColumnDef<BlockSummary>[] = [
    {
        accessorKey: "height",
        header: "Height",
        cell: ({ row }) => (
            <Link to={`/block/${row.original.hash}`} className="font-heading text-sm font-bold text-foreground hover:text-bitcoin transition-colors">
                #{row.getValue<number>("height").toLocaleString()}
            </Link>
        ),
    },
    {
        accessorKey: "hash",
        header: "Block Hash",
        cell: ({ row }) => (
            <Link to={`/block/${row.getValue("hash")}`} className="hover:text-bitcoin transition-colors block">
                <HashDisplay
                    hash={row.getValue("hash")}
                    variant="truncated"
                    size="sm"
                    startChars={8}
                    endChars={8}
                />
            </Link>
        ),
    },
    {
        accessorKey: "timestamp",
        header: "Time",
        cell: ({ row }) => (
            <span className="text-muted-foreground text-sm">
                {formatTime(row.getValue("timestamp"))}
            </span>
        ),
    },
    {
        accessorKey: "txCount",
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 font-medium"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Transactions
                <ArrowUpDown className="ml-1 h-3 w-3" />
            </Button>
        ),
        cell: ({ row }) => (
            <span className="font-mono text-sm text-foreground">
                {row.getValue<number>("txCount").toLocaleString()}
            </span>
        ),
    },
    {
        accessorKey: "size",
        header: "Size",
        cell: ({ row }) => (
            <span className="font-mono text-xs text-muted-foreground">
                {formatSize(row.getValue("size"))}
            </span>
        ),
    },
    {
        accessorKey: "miner",
        header: "Miner",
        cell: ({ row }) => {
            const miner = row.getValue<string>("miner")
            return (
                <span className={cn("text-xs", miner !== "Unknown" ? "text-bitcoin" : "text-muted-foreground")}>
                    {miner !== "Unknown" ? `⛏ ${miner}` : miner}
                </span>
            )
        },
    },
]

export interface BlockTableProps extends React.HTMLAttributes<HTMLDivElement> {
    data: BlockSummary[]
    columns?: ColumnDef<BlockSummary>[]
    pageSize?: number
    showPagination?: boolean
}

const BlockTable = React.forwardRef<HTMLDivElement, BlockTableProps>(
    (
        {
            className,
            data,
            columns = defaultColumns,
            pageSize = 10,
            showPagination = true,
            ...props
        },
        ref
    ) => {
        const [sorting, setSorting] = React.useState<SortingState>([])
        const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
        const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
        const [globalFilter, setGlobalFilter] = React.useState("")

        const table = useReactTable({
            data,
            columns,
            getCoreRowModel: getCoreRowModel(),
            getSortedRowModel: getSortedRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            getFilteredRowModel: getFilteredRowModel(),
            onSortingChange: setSorting,
            onColumnFiltersChange: setColumnFilters,
            onGlobalFilterChange: setGlobalFilter,
            onColumnVisibilityChange: setColumnVisibility,
            state: {
                sorting,
                columnFilters,
                globalFilter,
                columnVisibility,
            },
            initialState: {
                pagination: {
                    pageSize,
                },
            },
        })

        return (
            <div ref={ref} className={cn("space-y-4", className)} {...props}>
                <div className="flex items-center justify-between">
                    <div className="relative w-full max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Filter by hash, miner or height..."
                            value={globalFilter ?? ""}
                            onChange={(event) => setGlobalFilter(event.target.value)}
                            className="pl-9 h-9"
                        />
                    </div>
                </div>

                <div className="rounded-lg border overflow-hidden">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    key={headerGroup.id}
                                    className="bg-muted/50 hover:bg-muted/50"
                                >
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className="text-xs font-medium uppercase tracking-wider"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        className="transition-colors hover:bg-accent/30"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className="py-3">
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No blocks found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {showPagination && (
                    <div className="flex items-center justify-between px-1">
                        <p className="text-xs text-muted-foreground">
                            Showing{" "}
                            <span className="font-medium text-foreground">
                                {table.getState().pagination.pageIndex *
                                    table.getState().pagination.pageSize +
                                    1}
                            </span>
                            –
                            <span className="font-medium text-foreground">
                                {Math.min(
                                    (table.getState().pagination.pageIndex + 1) *
                                    table.getState().pagination.pageSize,
                                    table.getFilteredRowModel().rows.length
                                )}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium text-foreground">
                                {table.getFilteredRowModel().rows.length.toLocaleString()}
                            </span>{" "}
                            blocks
                        </p>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="px-2 text-xs text-muted-foreground">
                                Page {table.getState().pagination.pageIndex + 1} /{" "}
                                {table.getPageCount() || 1}
                            </span>
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        )
    }
)
BlockTable.displayName = "BlockTable"

export { BlockTable }
