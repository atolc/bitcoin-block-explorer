import type {
    ApiResponse,
    BlockSummary,
    TransactionSummary,
    NetworkStats,
} from "@/types"

// ─── Base Fetch ────────────────────────────────────────────────

const API_BASE = "/api"

async function apiFetch<T>(endpoint: string): Promise<T> {
    const res = await fetch(`${API_BASE}${endpoint}`)

    if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`)
    }

    const json: ApiResponse<T> = await res.json()

    if (!json.success) {
        throw new Error(json.error?.message ?? "Unknown API error")
    }

    return json.data
}

// ─── Endpoints ─────────────────────────────────────────────────

export async function fetchNetworkStats(): Promise<NetworkStats> {
    return apiFetch<NetworkStats>("/network/stats")
}

export async function fetchLatestBlocks(
    count = 5
): Promise<BlockSummary[]> {
    return apiFetch<BlockSummary[]>(`/blocks/latest?count=${count}`)
}

export async function fetchLatestTransactions(
    count = 10
): Promise<TransactionSummary[]> {
    return apiFetch<TransactionSummary[]>(
        `/transactions/latest?count=${count}`
    )
}

// ─── Config ────────────────────────────────────────────────────

export interface ApiConfig {
    apiUrl: string
}

export async function fetchApiConfig(): Promise<ApiConfig> {
    return apiFetch<ApiConfig>("/config")
}

