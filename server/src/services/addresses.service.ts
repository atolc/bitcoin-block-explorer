import type { TransactionSummary } from '../types/index.js';

interface AddressInfo {
    address: string;
    chain_stats: {
        funded_txo_count: number;
        funded_txo_sum: number;
        spent_txo_count: number;
        spent_txo_sum: number;
        tx_count: number;
    };
    mempool_stats: {
        funded_txo_count: number;
        funded_txo_sum: number;
        spent_txo_count: number;
        spent_txo_sum: number;
        tx_count: number;
    };
}

export interface AddressResponse {
    address: string;
    balance: number;
    received: number;
    sent: number;
    txCount: number;
    unconfirmedBalance: number;
    unconfirmedTxCount: number;
}

const MEMPOOL_API = 'https://mempool.space/testnet4/api';

export async function getAddressInfo(address: string): Promise<AddressResponse> {
    const res = await fetch(`${MEMPOOL_API}/address/${address}`);
    if (!res.ok) {
        throw new Error(`Failed to fetch address info from mempool.space: ${res.statusText}`);
    }
    const data = await res.json() as AddressInfo;

    const balance = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
    const unconfirmedBalance = data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum;

    return {
        address: data.address,
        balance: balance / 100_000_000,
        received: data.chain_stats.funded_txo_sum / 100_000_000,
        sent: data.chain_stats.spent_txo_sum / 100_000_000,
        txCount: data.chain_stats.tx_count,
        unconfirmedBalance: unconfirmedBalance / 100_000_000,
        unconfirmedTxCount: data.mempool_stats.tx_count,
    };
}

export async function getAddressTransactions(address: string): Promise<TransactionSummary[]> {
    const res = await fetch(`${MEMPOOL_API}/address/${address}/txs`);
    if (!res.ok) {
        throw new Error(`Failed to fetch address transactions from mempool.space: ${res.statusText}`);
    }
    const txs = await res.json() as any[];

    return txs.map(tx => {
        const totalOutput = tx.vout.reduce((sum: number, v: any) => sum + v.value, 0);
        return {
            hash: tx.txid,
            from: "Multiple Inputs", // Simplified
            to: "Multiple Outputs", // Simplified
            value: (totalOutput / 100_000_000).toFixed(8),
            fee: (tx.fee / 100_000_000).toFixed(8),
            confirmations: tx.status.confirmed ? 1 : 0, // Placeholder, usually we'd calculate from tip
            timestamp: tx.status.block_time
                ? new Date(tx.status.block_time * 1000).toISOString()
                : new Date().toISOString(),
        };
    });
}
