import { blockchainService } from './blockchain.service.js';
import type { NetworkStats } from '../types/index.js';

// ─── Blockchain.info API response types ────────────────────────

interface StatsResponse {
    market_price_usd: number;
    hash_rate: number;       // GH/s
    difficulty: number;
    n_blocks_total: number;
    minutes_between_blocks: number;
    totalbc: number;
    n_tx: number;
    n_blocks_mined: number;
}

interface MempoolInfoResponse {
    count: number;
    vsize: number;
    total_fee: number;
}

// ─── Helpers ───────────────────────────────────────────────────

function formatHashrate(ghPerSec: number): string {
    const ehPerSec = ghPerSec / 1e9;
    return `${ehPerSec.toFixed(1)} EH/s`;
}

function formatDifficulty(difficulty: number): string {
    const trillions = difficulty / 1e12;
    return `${trillions.toFixed(2)}T`;
}

// ─── Service ───────────────────────────────────────────────────

export async function getNetworkStats(): Promise<NetworkStats> {
    // Fetch stats and mempool info in parallel
    const [stats, latestBlock] = await Promise.all([
        blockchainService.get<StatsResponse>('/stats?format=json'),
        blockchainService.get<{ height: number }>('/latestblock'),
    ]);

    // Try to get mempool count; fall back gracefully
    let mempoolCount = 0;
    try {
        const mempool = await blockchainService.get<MempoolInfoResponse>(
            '/q/unconfirmedcount'
        );
        // The endpoint returns a plain number, handle both cases
        mempoolCount = typeof mempool === 'number' ? mempool : mempool.count ?? 0;
    } catch {
        mempoolCount = 0;
    }

    return {
        hashrate: formatHashrate(stats.hash_rate),
        difficulty: formatDifficulty(stats.difficulty),
        mempoolSize: mempoolCount,
        btcPrice: Math.round(stats.market_price_usd),
        blockHeight: latestBlock.height,
        unconfirmedTxs: mempoolCount,
    };
}
