import { blockchainService } from './blockchain.service.js';
import type { TransactionSummary } from '../types/index.js';

// ─── Blockchain.info API response types ────────────────────────

interface UnconfirmedTxResponse {
    txs: Array<{
        hash: string;
        time: number;
        fee: number;
        inputs: Array<{
            prev_out?: {
                addr?: string;
                value: number;
            };
        }>;
        out: Array<{
            addr?: string;
            value: number;
        }>;
    }>;
}

interface SingleTxResponse {
    hash: string;
    time: number;
    fee: number;
    block_height?: number;
    inputs: Array<{
        prev_out?: {
            addr?: string;
            value: number;
        };
    }>;
    out: Array<{
        addr?: string;
        value: number;
    }>;
}

// ─── Helper ────────────────────────────────────────────────────

function satoshisToBtc(satoshis: number): string {
    return (satoshis / 1e8).toFixed(8);
}

// ─── Service ───────────────────────────────────────────────────

export async function getLatestTransactions(
    count = 10
): Promise<TransactionSummary[]> {
    const data = await blockchainService.get<UnconfirmedTxResponse>(
        '/unconfirmed-transactions?format=json'
    );

    return data.txs.slice(0, count).map((tx) => {
        const fromAddr =
            tx.inputs[0]?.prev_out?.addr ?? 'Coinbase';
        const toAddr = tx.out[0]?.addr ?? 'Unknown';
        const totalOutput = tx.out.reduce((sum, out) => sum + out.value, 0);

        return {
            hash: tx.hash,
            from: fromAddr,
            to: toAddr,
            value: satoshisToBtc(totalOutput),
            fee: satoshisToBtc(tx.fee),
            confirmations: 0,
            timestamp: new Date(tx.time * 1000).toISOString(),
        };
    });
}

export async function getTransactionByHash(
    hash: string
): Promise<TransactionSummary> {
    const tx = await blockchainService.get<SingleTxResponse>(`/rawtx/${hash}`);

    const fromAddr =
        tx.inputs[0]?.prev_out?.addr ?? 'Coinbase';
    const toAddr = tx.out[0]?.addr ?? 'Unknown';
    const totalOutput = tx.out.reduce((sum, out) => sum + out.value, 0);

    return {
        hash: tx.hash,
        from: fromAddr,
        to: toAddr,
        value: satoshisToBtc(totalOutput),
        fee: satoshisToBtc(tx.fee),
        confirmations: tx.block_height ? 1 : 0, // Simplified
        timestamp: new Date(tx.time * 1000).toISOString(),
    };
}
