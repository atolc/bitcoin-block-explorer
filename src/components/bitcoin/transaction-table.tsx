import * as React from "react"
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    useReactTable,
    type SortingState,
    type VisibilityState,
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
import { Badge } from "@/components/ui/badge"
import { HashDisplay } from "./hash-display"
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react"

export interface TransactionData {
    hash: string
    from: string
    to: string
    value: string
    fee: string
    confirmations: number
    timestamp: string | Date
}

function ConfirmationBadge({ confirmations }: { confirmations: number }) {
    if (confirmations === 0) {
        return (
            <Badge
                variant="outline"
                className="border-warning/30 bg-warning/10 text-warning animate-pulse"
            >
                Unconfirmed
            </Badge>
        )
    }
    if (confirmations < 6) {
        return (
            <Badge
                variant="outline"
                className="border-warning/30 bg-warning/10 text-warning"
            >
                {confirmations}/6
            </Badge>
        )
    }
    return (
        <Badge
            variant="outline"
            className="border-success/30 bg-success/10 text-success"
        >
            {confirmations.toLocaleString()}
        </Badge>
    )
}

const defaultColumns: ColumnDef<TransactionData>[] = [
    {
        accessorKey: "hash",
        header: "TX Hash",
        cell: ({ row }) => (
            <HashDisplay
                hash={row.getValue("hash")}
                variant="truncated"
                size="sm"
                startChars={6}
                endChars={6}
            />
        ),
    },
    {
        accessorKey: "from",
        header: "From",
        cell: ({ row }) => (
            <HashDisplay
                hash={row.getValue("from")}
                variant="short"
                size="sm"
                copyable
            />
        ),
    },
    {
        accessorKey: "to",
        header: "To",
        cell: ({ row }) => (
            <HashDisplay
                hash={row.getValue("to")}
                variant="short"
                size="sm"
                copyable
            />
        ),
    },
    {
        accessorKey: "value",
        header: ({ column }) => (
            <Button
                variant="ghost"
                size="sm"
                className="-ml-3 h-8 font-medium"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Value (BTC)
                <ArrowUpDown className="ml-1 h-3 w-3" />
            </Button>
        ),
        cell: ({ row }) => (
            <span className="font-mono text-sm font-medium text-bitcoin">
                {row.getValue("value")}
            </span>
        ),
    },
    {
        accessorKey: "fee",
        header: "Fee",
        cell: ({ row }) => (
            <span className="font-mono text-xs text-muted-foreground">
                {row.getValue("fee")}
            </span>
        ),
    },
    {
        accessorKey: "confirmations",
        header: "Status",
        cell: ({ row }) => (
            <ConfirmationBadge confirmations={row.getValue("confirmations")} />
        ),
    },
]

export interface TransactionTableProps
    extends React.HTMLAttributes<HTMLDivElement> {
    data: TransactionData[]
    columns?: ColumnDef<TransactionData>[]
    pageSize?: number
    showPagination?: boolean
}

const TransactionTable = React.forwardRef<HTMLDivElement, TransactionTableProps>(
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
        const [columnVisibility, setColumnVisibility] =
            React.useState<VisibilityState>({})

        const table = useReactTable({
            data,
            columns,
            getCoreRowModel: getCoreRowModel(),
            getSortedRowModel: getSortedRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            onSortingChange: setSorting,
            onColumnVisibilityChange: setColumnVisibility,
            state: {
                sorting,
                columnVisibility,
            },
            initialState: {
                pagination: {
                    pageSize,
                },
            },
        })

        return (
            <div ref={ref} className={cn("space-y-3", className)} {...props}>
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
                                        No transactions found.
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
                                    data.length
                                )}
                            </span>{" "}
                            of{" "}
                            <span className="font-medium text-foreground">
                                {data.length.toLocaleString()}
                            </span>{" "}
                            transactions
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
                                {table.getPageCount()}
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
TransactionTable.displayName = "TransactionTable"

export { TransactionTable }
