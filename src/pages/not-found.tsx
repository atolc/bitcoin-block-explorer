import { Link } from "react-router"
import { SearchX } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-6">
            <div className="mx-auto max-w-md text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-bitcoin/10">
                    <SearchX className="h-8 w-8 text-bitcoin" />
                </div>
                <h1 className="font-heading text-4xl font-bold tracking-tight mb-3">
                    404
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                    The block, transaction, or page you're looking for doesn't
                    exist on the blockchain.
                </p>
                <Button asChild>
                    <Link to="/">
                        Back to Explorer
                    </Link>
                </Button>
            </div>
        </div>
    )
}
