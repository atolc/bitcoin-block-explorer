import { useState, useEffect, useCallback } from "react"
import {
    fetchNetworkStats,
    fetchLatestBlocks,
    fetchBlock,
    fetchLatestTransactions,
} from "@/services/api"
import { useApiConfig } from "@/providers/api-config-provider"
import { THROTTLED_INTERVAL_MS } from "@/config/rate-limit.config"
import type {
    NetworkStats,
    BlockSummary,
    BlockDetail,
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

// ─── Interval helper ───────────────────────────────────────────
// When the API is throttled, enforce a minimum polling interval.

function useThrottledInterval(baseMs: number): number {
    const { isThrottled } = useApiConfig()
    return isThrottled ? Math.max(baseMs, THROTTLED_INTERVAL_MS) : baseMs
}

// ─── Hooks ─────────────────────────────────────────────────────

export function useNetworkStats() {
    const interval = useThrottledInterval(30_000)
    return usePolling<NetworkStats>(fetchNetworkStats, interval)
}

export function useLatestBlocks(count = 4) {
    const interval = useThrottledInterval(60_000)
    return usePolling<BlockSummary[]>(
        () => fetchLatestBlocks(count),
        interval,
        [count]
    )
}

export function useBlock(hash?: string) {
    const [state, setState] = useState<UseApiState<BlockDetail>>({
        data: null,
        loading: true,
        error: null,
    })

    useEffect(() => {
        if (!hash) return

        let mounted = true
        setState((prev) => ({ ...prev, loading: true, error: null }))

        fetchBlock(hash)
            .then((data) => {
                if (mounted) setState({ data, loading: false, error: null })
            })
            .catch((err) => {
                if (mounted)
                    setState({
                        data: null,
                        loading: false,
                        error: err instanceof Error ? err.message : "Unknown error",
                    })
            })

        return () => {
            mounted = false
        }
    }, [hash])

    return state
}

export function useLatestTransactions(count = 10) {
    const interval = useThrottledInterval(15_000)
    return usePolling<TransactionSummary[]>(
        () => fetchLatestTransactions(count),
        interval,
        [count]
    )
}
