// ─── Network Types ─────────────────────────────────────────────

export interface NetworkStats {
    hashrate: string;
    difficulty: string;
    mempoolSize: number;
    btcPrice: number;
    blockHeight: number;
    unconfirmedTxs: number;
}
