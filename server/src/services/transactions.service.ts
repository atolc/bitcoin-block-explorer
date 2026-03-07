import { blockchainService } from './blockchain.service.js';
import type { TransactionSummary, PaginatedResponse } from '../types/index.js';

// ─── Bitcoin Core REST response types ──────────────────────────

interface MempoolEntry {
    vsize: number;
    weight: number;
    time: number;
    height: number;
    fees: {
        base: number;      // BTC
        modified: number;
        ancestor: number;
        descendant: number;
    };
    depends: string[];
    spentby: string[];
    'bip125-replaceable': boolean;
}

type MempoolContents = Record<string, MempoolEntry>;

// ─── Service ───────────────────────────────────────────────────

export async function getLatestTransactions(
    count = 10
): Promise<TransactionSummary[]> {
    const contents = await blockchainService.get<MempoolContents>(
        '/mempool/contents'
    );

    // Convert the object to an array and sort by time (most recent first)
    const entries = Object.entries(contents)
        .map(([hash, entry]) => ({ hash, ...entry }))
        .sort((a, b) => b.time - a.time)
        .slice(0, count);

    return entries.map((entry) => ({
        hash: entry.hash,
        from: `${entry.vsize} vB`,
        to: entry['bip125-replaceable'] ? 'RBF' : 'Non-RBF',
        value: entry.fees.base.toFixed(8),
        fee: entry.fees.base.toFixed(8),
        confirmations: 0,
        timestamp: new Date(entry.time * 1000).toISOString(),
    }));
}

export async function getPaginatedTransactions(
    page = 1,
    limit = 10
): Promise<PaginatedResponse<TransactionSummary>> {
    const contents = await blockchainService.get<MempoolContents>(
        '/mempool/contents'
    );

    const sortedHashes = Object.entries(contents)
        .map(([hash, entry]) => ({ hash, ...entry }))
        .sort((a, b) => b.time - a.time);

    const total = sortedHashes.length;
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const entries = sortedHashes.slice(offset, offset + limit);

    const data = entries.map((entry) => ({
        hash: entry.hash,
        from: `${entry.vsize} vB`,
        to: entry['bip125-replaceable'] ? 'RBF' : 'Non-RBF',
        value: entry.fees.base.toFixed(8),
        fee: entry.fees.base.toFixed(8),
        confirmations: 0,
        timestamp: new Date(entry.time * 1000).toISOString(),
    }));

    return {
        data,
        total,
        page,
        limit,
        totalPages,
    };
}

export async function getTransactionByHash(
    hash: string
): Promise<TransactionSummary> {
    // Try to find the tx in mempool contents
    const contents = await blockchainService.get<MempoolContents>(
        '/mempool/contents'
    );

    const entry = contents[hash];

    if (!entry) {
        throw new Error(`Transaction ${hash} not found in mempool`);
    }

    return {
        hash,
        from: `${entry.vsize} vB`,
        to: entry['bip125-replaceable'] ? 'RBF' : 'Non-RBF',
        value: entry.fees.base.toFixed(8),
        fee: entry.fees.base.toFixed(8),
        confirmations: 0,
        timestamp: new Date(entry.time * 1000).toISOString(),
    };
}
