import { useParams, Link } from "react-router"
import { useBlock } from "@/hooks/use-api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HashDisplay } from "@/components/bitcoin/hash-display"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Layers, ShieldCheck, Box } from "lucide-react"

export default function BlockDetailPage() {
    const { hash } = useParams<{ hash: string }>()
    const { data: block, loading, error } = useBlock(hash)

    if (loading) {
        return (
            <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 animate-pulse">
                <div className="h-8 w-32 bg-muted rounded mb-8"></div>
                <div className="h-64 bg-muted rounded-xl"></div>
            </div>
        )
    }

    if (error || !block) {
        return (
            <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 text-center">
                <h1 className="text-2xl font-bold mb-4">Block Not Found</h1>
                <p className="text-muted-foreground mb-8">{error || "The requested block could not be found."}</p>
                <Link to="/blocks" className="text-bitcoin hover:underline">
                    &larr; Back to Blocks
                </Link>
            </div>
        )
    }

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    }

    return (
        <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
            <Link to="/blocks" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blocks
            </Link>

            <div className="mb-8 flex flex-col gap-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-bitcoin/10 text-bitcoin">
                        <Box className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="font-heading text-3xl font-bold tracking-tight">
                            Block #{block.height.toLocaleString()}
                        </h1>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-muted/30 p-4 rounded-lg border border-border/50">
                    <span className="text-sm font-medium text-muted-foreground">Hash:</span>
                    <HashDisplay hash={block.hash} variant="full" />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Layers className="h-5 w-5 text-bitcoin" />
                            Summary
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="flex justify-between items-center py-3 border-b border-border/50">
                            <span className="text-muted-foreground">Transactions</span>
                            <span className="font-medium font-mono">{block.txCount.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-border/50">
                            <span className="text-muted-foreground">Confirmations</span>
                            <Badge variant={block.confirmations > 6 ? "default" : "secondary"}>
                                {block.confirmations > 6 ? "Confirmed" : `${block.confirmations} confirms`}
                            </Badge>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-border/50">
                            <span className="text-muted-foreground">Size</span>
                            <span className="font-medium font-mono">{formatSize(block.size)}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-border/50">
                            <span className="text-muted-foreground">Weight</span>
                            <span className="font-medium font-mono">{block.weight.toLocaleString()} WU</span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span className="text-muted-foreground">Miner</span>
                            <span className="font-medium">{block.miner}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <ShieldCheck className="h-5 w-5 text-bitcoin" />
                            Technical Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1">
                        <div className="flex justify-between py-3 border-b border-border/50 flex-col sm:flex-row sm:items-center gap-1">
                            <span className="text-muted-foreground">Timestamp</span>
                            <span className="font-medium text-right sm:text-left">{new Date(block.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-border/50 flex-col sm:flex-row sm:items-center gap-1">
                            <span className="text-muted-foreground">Difficulty</span>
                            <span className="font-medium font-mono text-right sm:text-left">{block.difficulty.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-border/50 flex-col sm:flex-row sm:items-center gap-1">
                            <span className="text-muted-foreground">Nonce</span>
                            <span className="font-medium font-mono text-right sm:text-left">{block.nonce.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-3 border-b border-border/50 flex-col sm:flex-row sm:items-center gap-1">
                            <span className="text-muted-foreground">Bits</span>
                            <span className="font-medium font-mono text-right sm:text-left">{block.bits}</span>
                        </div>
                        {block.previousHash && (
                            <div className="flex flex-col justify-center py-3 gap-1 border-b border-border/50">
                                <span className="text-muted-foreground text-sm">Previous Block</span>
                                <Link to={`/block/${block.previousHash}`} className="hover:text-bitcoin transition-colors block">
                                    <HashDisplay hash={block.previousHash} variant="full" size="sm" />
                                </Link>
                            </div>
                        )}
                        <div className="flex flex-col justify-center py-3 gap-1">
                            <span className="text-muted-foreground text-sm">Merkle Root</span>
                            <div className="block">
                                <HashDisplay hash={block.merkleRoot} variant="full" size="sm" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
