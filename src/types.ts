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

export interface Transaction extends TransactionSummary {
    size: number
    weight: number
    inputs: Array<{
        prevOut: {
            hash: string
            value: number
            addr?: string
        }
    }>
    outputs: Array<{
        value: number
        addr?: string
        script: string
    }>
}

export interface NetworkStats {
    hashrate: string
    difficulty: string
    mempoolSize: number
    btcPrice: number
    blockHeight: number
    unconfirmedTxs: number
}

export interface AddressDetails {
    address: string
    balance: number
    received: number
    sent: number
    txCount: number
    unconfirmedBalance: number
    unconfirmedTxCount: number
}

// ─── API Response Wrapper ──────────────────────────────────────

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}

export interface ApiResponse<T> {
    success: boolean
    data: T
    error?: { message: string }
}
