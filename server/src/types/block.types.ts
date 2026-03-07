// ─── Block Types ───────────────────────────────────────────────

export interface Block {
    height: number;
    hash: string;
    timestamp: number;
    txCount: number;
    size: number;
    weight: number;
    miner: string;
    confirmations: number;
    previousHash: string;
    merkleRoot: string;
    bits: number;
    nonce: number;
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
