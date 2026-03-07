// ─── Shared Frontend Types ─────────────────────────────────────

export interface BlockSummary {
    height: number
    hash: string
    timestamp: string
    txCount: number
    size: number
    miner: string
    confirmations: number
}

export interface BlockDetail extends BlockSummary {
    weight: number
    previousHash?: string
    merkleRoot: string
    bits: string
    nonce: number
    mediantime: string
    difficulty: number
}

export interface TransactionSummary {
    hash: string
    from: string
    to: string
    value: string
    fee: string
    confirmations: number
    timestamp: string
}

export interface NetworkStats {
    hashrate: string
    difficulty: string
    mempoolSize: number
    btcPrice: number
    blockHeight: number
    unconfirmedTxs: number
}

// ─── API Response Wrapper ──────────────────────────────────────

export interface ApiResponse<T> {
    success: boolean
    data: T
    error?: { message: string }
}
