import { blockchainService } from './blockchain.service.js';
import type { BlockSummary, BlockDetail } from '../types/index.js';

// ─── Bitcoin Core REST response types ──────────────────────────

interface ChainInfo {
    chain: string;
    blocks: number;
    bestblockhash: string;
    difficulty: number;
}

interface BlockResponse {
    hash: string;
    confirmations: number;
    height: number;
    version: number;
    merkleroot: string;
    time: number;
    mediantime: number;
    nonce: number;
    bits: string;
    difficulty: number;
    nTx: number;
    previousblockhash?: string;
    size: number;
    strippedsize: number;
    weight: number;
    tx: string[];  // tx hashes only (notxdetails)
}

// ─── Known mining pool identification ──────────────────────────

const KNOWN_POOLS: Record<string, string> = {
    'Foundry': 'Foundry USA',
    'AntPool': 'AntPool',
    'F2Pool': 'F2Pool',
    'ViaBTC': 'ViaBTC',
    'Binance': 'Binance Pool',
    'MARA': 'MARA Pool',
    'SlushPool': 'Braiins Pool',
};

function identifyMiner(coinbaseText: string): string {
    for (const [key, name] of Object.entries(KNOWN_POOLS)) {
        if (coinbaseText.includes(key)) return name;
    }
    return 'Unknown';
}

// ─── Helpers ───────────────────────────────────────────────────

/** Try to extract the coinbase text from the first tx of a block */
async function getCoinbaseText(blockHash: string): Promise<string> {
    try {
        // Fetch full block (with tx details) to get coinbase
        const url = `/block/${blockHash}`;
        const block = await blockchainService.get<{
            tx: Array<{ vin: Array<{ coinbase?: string }> }>;
        }>(url);

        const coinbaseHex = block.tx?.[0]?.vin?.[0]?.coinbase;
        if (!coinbaseHex) return '';

        // Decode hex to ASCII (best-effort)
        return Buffer.from(coinbaseHex, 'hex').toString('ascii');
    } catch {
        return '';
    }
}

// ─── Service ───────────────────────────────────────────────────

export async function getLatestBlocks(count = 5): Promise<BlockSummary[]> {
    // 1. Get the best block hash from chain info
    const chainInfo = await blockchainService.get<ChainInfo>('/chaininfo');

    // 2. Walk backwards from the tip
    const blocks: BlockSummary[] = [];
    let currentHash = chainInfo.bestblockhash;

    for (let i = 0; i < count; i++) {
        const block = await blockchainService.get<BlockResponse>(
            `/block/notxdetails/${currentHash}`
        );

        // Best-effort miner identification from coinbase
        const coinbaseText = await getCoinbaseText(currentHash);

        blocks.push({
            height: block.height,
            hash: block.hash,
            timestamp: new Date(block.time * 1000),
            txCount: block.nTx,
            size: block.size,
            miner: identifyMiner(coinbaseText),
            confirmations: block.confirmations,
        });

        if (!block.previousblockhash) break;
        currentHash = block.previousblockhash;
    }

    return blocks;
}

export async function getBlockByHashOrHeight(
    identifier: string
): Promise<BlockDetail> {
    let blockHash: string;

    if (/^\d+$/.test(identifier)) {
        // Height → fetch the hash first
        const hashResponse = await blockchainService.get<{ blockhash: string }>(
            `/blockhashbyheight/${identifier}`
        );
        blockHash = hashResponse.blockhash;
    } else {
        blockHash = identifier;
    }

    const block = await blockchainService.get<BlockResponse>(
        `/block/notxdetails/${blockHash}`
    );

    const coinbaseText = await getCoinbaseText(blockHash);

    return {
        height: block.height,
        hash: block.hash,
        timestamp: new Date(block.time * 1000),
        txCount: block.nTx,
        size: block.size,
        weight: block.weight,
        miner: identifyMiner(coinbaseText),
        confirmations: block.confirmations,
        previousHash: block.previousblockhash,
        merkleRoot: block.merkleroot,
        bits: block.bits,
        nonce: block.nonce,
        mediantime: new Date(block.mediantime * 1000),
        difficulty: block.difficulty,
    };
}
