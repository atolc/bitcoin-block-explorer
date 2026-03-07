// ─── Block Types ───────────────────────────────────────────────

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface BlockDetail {
    height: number;
    hash: string;
    timestamp: Date;
    txCount: number;
    size: number;
    weight: number;
    miner: string;
    confirmations: number;
    previousHash?: string;
    merkleRoot: string;
    bits: string;
    nonce: number;
    mediantime: Date;
    difficulty: number;
}

export interface BlockSummary {
    height: number;
    hash: string;
    timestamp: Date;
    txCount: number;
    size: number;
    miner: string;
    confirmations: number;
}
