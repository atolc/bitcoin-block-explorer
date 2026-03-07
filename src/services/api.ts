import type {
    ApiResponse,
    BlockSummary,
    BlockDetail,
    TransactionSummary,
    NetworkStats,
    PaginatedResponse,
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

export async function fetchPaginatedBlocks(
    page = 1,
    limit = 10
): Promise<PaginatedResponse<BlockSummary>> {
    return apiFetch<PaginatedResponse<BlockSummary>>(`/blocks?page=${page}&limit=${limit}`)
}

export async function fetchBlock(hash: string): Promise<BlockDetail> {
    return apiFetch<BlockDetail>(`/blocks/${hash}`)
}

export async function fetchBlockTransactions(
    hash: string,
    page = 1,
    limit = 10
): Promise<PaginatedResponse<TransactionSummary>> {
    return apiFetch<PaginatedResponse<TransactionSummary>>(
        `/blocks/${hash}/transactions?page=${page}&limit=${limit}`
    )
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

