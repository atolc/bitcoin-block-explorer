import { blockchainService } from './blockchain.service.js';
import type { BlockSummary, BlockDetail, PaginatedResponse, TransactionSummary } from '../types/index.js';

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

export async function getPaginatedBlocks(
    page = 1,
    limit = 10
): Promise<PaginatedResponse<BlockSummary>> {

    // 1. Get chain info
    const chainInfo = await blockchainService.get<ChainInfo>('/chaininfo');
    const totalBlocks = chainInfo.blocks;

    const totalPages = Math.ceil(totalBlocks / limit);

    if (page < 1 || page > totalPages) {
        return {
            data: [],
            total: totalBlocks,
            page,
            limit,
            totalPages
        };
    }

    // 2. Calculate starting height
    const startHeight = totalBlocks - ((page - 1) * limit);

    // 3. Generate heights (descending)
    const heights = Array.from({ length: limit }, (_, i) => startHeight - i)
        .filter(h => h >= 0);

    // 4. Fetch hashes in parallel
    const hashes = await Promise.all(
        heights.map(height =>
            blockchainService.get<{ blockhash: string }>(`/blockhashbyheight/${height}`)
        )
    );

    // 5. Fetch blocks in parallel
    const blocks = await Promise.all(
        hashes.map(async ({ blockhash }) => {

            const block = await blockchainService.get<BlockResponse>(
                `/block/notxdetails/${blockhash}`
            );

            const coinbaseText = await getCoinbaseText(blockhash);

            return {
                height: block.height,
                hash: block.hash,
                timestamp: new Date(block.time * 1000),
                txCount: block.nTx,
                size: block.size,
                miner: identifyMiner(coinbaseText),
                confirmations: block.confirmations
            } as BlockSummary;
        })
    );

    return {
        data: blocks,
        total: totalBlocks,
        page,
        limit,
        totalPages
    };
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

export async function getBlockTransactionsPaginated(
    identifier: string,
    page = 1,
    limit = 10
): Promise<PaginatedResponse<TransactionSummary>> {
    let blockHash: string;

    if (/^\d+$/.test(identifier)) {
        const hashResponse = await blockchainService.get<{ blockhash: string }>(
            `/blockhashbyheight/${identifier}`
        );
        blockHash = hashResponse.blockhash;
    } else {
        blockHash = identifier;
    }

    // Fetch full block with tx details
    const block = await blockchainService.get<{
        time: number;
        confirmations: number;
        tx: Array<{
            txid: string;
            vin: Array<{ coinbase?: string; txid?: string }>;
            vout: Array<{ value: number; scriptPubKey?: { address?: string } }>;
        }>;
    }>(`/block/${blockHash}`);

    const totalTxs = block.tx.length;
    const totalPages = Math.ceil(totalTxs / limit) || 1;

    if (page < 1 || page > totalPages) {
        return { data: [], total: totalTxs, page, limit, totalPages };
    }

    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(startIndex + limit, totalTxs);
    const paginatedTxs = block.tx.slice(startIndex, endIndex);

    const txSummaries: TransactionSummary[] = paginatedTxs.map((tx) => {
        let totalValue = 0;
        for (const out of tx.vout) {
            totalValue += out.value || 0;
        }

        const isCoinbase = tx.vin.length > 0 && !!tx.vin[0].coinbase;
        const from = isCoinbase ? 'Coinbase' : (tx.vin[0]?.txid || 'Unknown');
        const to = tx.vout[0]?.scriptPubKey?.address || 'Multiple Outputs / Unknown';

        return {
            hash: tx.txid,
            from,
            to,
            value: totalValue.toFixed(8),
            fee: isCoinbase ? '0.00000000' : 'Unknown', // Estimating fees requires full UTXO lookups which is expensive without an indexer like Electrs
            confirmations: block.confirmations,
            timestamp: new Date(block.time * 1000).toISOString(),
        };
    });

    return {
        data: txSummaries,
        total: totalTxs,
        page,
        limit,
        totalPages
    };
}
