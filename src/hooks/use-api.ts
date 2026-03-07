import { useState, useEffect, useCallback } from "react"
import {
    fetchNetworkStats,
    fetchLatestBlocks,
    fetchLatestTransactions,
} from "@/services/api"
import type {
    NetworkStats,
    BlockSummary,
    TransactionSummary,
} from "@/types"

// ─── Generic hook state ────────────────────────────────────────

interface UseApiState<T> {
    data: T | null
    loading: boolean
    error: string | null
}

function usePolling<T>(
    fetcher: () => Promise<T>,
    intervalMs: number,
    deps: unknown[] = []
): UseApiState<T> & { refetch: () => void } {
    const [state, setState] = useState<UseApiState<T>>({
        data: null,
        loading: true,
        error: null,
    })

    const load = useCallback(async () => {
        try {
            const data = await fetcher()
            setState({ data, loading: false, error: null })
        } catch (err) {
            setState((prev) => ({
                data: prev.data,
                loading: false,
                error: err instanceof Error ? err.message : "Unknown error",
            }))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)

    useEffect(() => {
        load()
        const id = setInterval(load, intervalMs)
        return () => clearInterval(id)
    }, [load, intervalMs])

    return { ...state, refetch: load }
}

// ─── Hooks ─────────────────────────────────────────────────────

export function useNetworkStats() {
    return usePolling<NetworkStats>(fetchNetworkStats, 30_000)
}

export function useLatestBlocks(count = 4) {
    return usePolling<BlockSummary[]>(
        () => fetchLatestBlocks(count),
        60_000,
        [count]
    )
}

export function useLatestTransactions(count = 10) {
    return usePolling<TransactionSummary[]>(
        () => fetchLatestTransactions(count),
        15_000,
        [count]
    )
}
