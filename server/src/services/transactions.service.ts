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

interface BitcoinRestTx {
    txid: string;
    hash: string;
    version: number;
    size: number;
    vsize: number;
    weight: number;
    locktime: number;
    vin: Array<{
        txid: string;
        vout: number;
        scriptSig: { asm: string; hex: string };
        sequence: number;
        prevout?: {
            value: number;
            scriptPubKey: {
                asm: string;
                hex: string;
                address?: string;
                type: string;
            };
        };
    }>;
    vout: Array<{
        value: number;
        n: number;
        scriptPubKey: {
            asm: string;
            hex: string;
            address?: string;
            type: string;
        };
    }>;
    blockhash?: string;
    confirmations?: number;
    time?: number;
    blocktime?: number;
}

export async function getTransactionByHash(
    hash: string
): Promise<TransactionSummary | Transaction> {
    try {
        // Fetch full transaction data from Bitcoin REST API
        const tx = await blockchainService.get<BitcoinRestTx>(`/tx/${hash}`);

        // Calculate total input value (available if we have prevout info)
        let totalInput = 0;
        const inputs = tx.vin.map(vin => {
            const val = vin.prevout?.value || 0;
            totalInput += val;
            return {
                prevOut: {
                    hash: vin.txid,
                    value: val,
                    addr: vin.prevout?.scriptPubKey.address
                }
            };
        });

        // Calculate total output value
        let totalOutput = 0;
        const outputs = tx.vout.map(vout => {
            totalOutput += vout.value;
            return {
                value: vout.value,
                addr: vout.scriptPubKey.address,
                script: vout.scriptPubKey.asm
            };
        });

        // Fee is input - output (if input info is available)
        const fee = totalInput > 0 ? (totalInput - totalOutput) : 0;

        return {
            hash: tx.hash,
            from: totalInput > 0 ? totalInput.toFixed(8) : 'Unknown',
            to: totalOutput.toFixed(8),
            value: totalOutput.toFixed(8),
            fee: fee.toFixed(8),
            confirmations: tx.confirmations || 0,
            timestamp: tx.time ? new Date(tx.time * 1000).toISOString() : new Date().toISOString(),
            size: tx.size,
            weight: tx.weight,
            inputs,
            outputs
        };
    } catch (error) {
        // Fallback to mempool search if REST /tx/ fails or if preferred
        const contents = await blockchainService.get<MempoolContents>(
            '/mempool/contents'
        );

        const entry = contents[hash];

        if (!entry) {
            throw new Error(`Transaction ${hash} not found`);
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
}
