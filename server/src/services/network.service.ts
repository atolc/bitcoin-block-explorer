import { blockchainService } from './blockchain.service.js';
import type { NetworkStats } from '../types/index.js';

// ─── Bitcoin Core REST response types ──────────────────────────

interface ChainInfo {
    chain: string;
    blocks: number;
    bestblockhash: string;
    difficulty: number;
}

interface MempoolInfo {
    loaded: boolean;
    size: number;       // tx count
    bytes: number;
    usage: number;
    total_fee: number;
    maxmempool: number;
    mempoolminfee: number;
    minrelaytxfee: number;
    unbroadcastcount: number;
}

// ─── Helpers ───────────────────────────────────────────────────

/**
 * Estimate hashrate from difficulty.
 * hashrate ≈ difficulty × 2^32 / block_time
 * Block time = 600 seconds for Bitcoin.
 */
function estimateHashrate(difficulty: number): string {
    const hashesPerBlock = difficulty * Math.pow(2, 32);
    const hashesPerSecond = hashesPerBlock / 600;

    if (hashesPerSecond >= 1e18) {
        return `${(hashesPerSecond / 1e18).toFixed(1)} EH/s`;
    } else if (hashesPerSecond >= 1e15) {
        return `${(hashesPerSecond / 1e15).toFixed(1)} PH/s`;
    } else if (hashesPerSecond >= 1e12) {
        return `${(hashesPerSecond / 1e12).toFixed(1)} TH/s`;
    } else if (hashesPerSecond >= 1e9) {
        return `${(hashesPerSecond / 1e9).toFixed(1)} GH/s`;
    } else if (hashesPerSecond >= 1e6) {
        return `${(hashesPerSecond / 1e6).toFixed(1)} MH/s`;
    }
    return `${hashesPerSecond.toFixed(0)} H/s`;
}

function formatDifficulty(difficulty: number): string {
    if (difficulty >= 1e12) return `${(difficulty / 1e12).toFixed(2)}T`;
    if (difficulty >= 1e9) return `${(difficulty / 1e9).toFixed(2)}G`;
    if (difficulty >= 1e6) return `${(difficulty / 1e6).toFixed(2)}M`;
    if (difficulty >= 1e3) return `${(difficulty / 1e3).toFixed(2)}K`;
    return difficulty.toFixed(2);
}

/**
 * Fetch BTC price from CoinGecko (free, no API key).
 */
async function fetchBtcPrice(): Promise<number> {
    try {
        const res = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'
        );
        if (!res.ok) return 0;
        const data = await res.json() as { bitcoin?: { usd?: number } };
        return Math.round(data.bitcoin?.usd ?? 0);
    } catch {
        return 0;
    }
}

// ─── Service ───────────────────────────────────────────────────

export async function getNetworkStats(): Promise<NetworkStats> {
    const [chainInfo, mempoolInfo, btcPrice] = await Promise.all([
        blockchainService.get<ChainInfo>('/chaininfo'),
        blockchainService.get<MempoolInfo>('/mempool/info'),
        fetchBtcPrice(),
    ]);

    return {
        hashrate: estimateHashrate(chainInfo.difficulty),
        difficulty: formatDifficulty(chainInfo.difficulty),
        mempoolSize: mempoolInfo.size,
        btcPrice,
        blockHeight: chainInfo.blocks,
        unconfirmedTxs: mempoolInfo.size,
    };
}
