import { useNavigate } from "react-router"
import { useCallback } from "react"
import type { SearchType } from "@/components/bitcoin/search-bar"

export function useSearch() {
    const navigate = useNavigate()

    const handleSearch = useCallback((query: string, type: SearchType) => {
        if (!query) return

        switch (type) {
            case "block":
                // If it's all digits, it's a height. If it's a hex string (handled by transaction type usually), it might be a hash.
                // The detectSearchType logic in SearchBar handles this.
                navigate(`/block/${query}`)
                break
            case "transaction":
                // This could be a block hash or a transaction hash.
                // In Bitcoin, both are 64-char hex strings.
                // Usually, the API or frontend needs to decide.
                // For now, we'll try tx first or just follow the route.
                // If the user entered a 64-char hex, the detectSearchType says "transaction".
                // But it could be a block hash.
                // Typically explorers try one and if it fails, try the other, or have a combined route.
                // Here we have /block/:hash and /tx/:hash.
                // For simplicity, we'll assume transaction if detectSearchType says so, 
                // but we might want to check if it's a block hash too.
                navigate(`/tx/${query}`)
                break
            case "address":
                navigate(`/address/${query}`)
                break
            case "unknown":
                // If unknown but looks like 64 chars, maybe it's a hash?
                if (query.length === 64) {
                    navigate(`/tx/${query}`)
                }
                break
            default:
                break
        }
    }, [navigate])

    return { handleSearch }
}
