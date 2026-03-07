import { blockchainService } from './blockchain.service.js';
import type { BlockSummary } from '../types/index.js';

// ─── Blockchain.info API response types ────────────────────────

interface BlockchainBlockResponse {
    height: number;
    hash: string;
    time: number;
    n_tx: number;
    size: number;
    block_index: number;
    main_chain: boolean;
    prev_block: string;
    mrkl_root: string;
    bits: number;
    nonce: number;
    tx: Array<{ hash: string }>;
}

interface LatestBlockResponse {
    hash: string;
    height: number;
    time: number;
    block_index: number;
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

function identifyMiner(_coinbaseText: string): string {
    for (const [key, name] of Object.entries(KNOWN_POOLS)) {
        if (_coinbaseText.includes(key)) return name;
    }
    return 'Unknown';
}

// ─── Service ───────────────────────────────────────────────────

export async function getLatestBlocks(count = 5): Promise<BlockSummary[]> {
    // Get the latest block hash
    const latestBlock = await blockchainService.get<LatestBlockResponse>(
        '/latestblock'
    );

    // Get block details for the latest block
    const block = await blockchainService.get<BlockchainBlockResponse>(
        `/rawblock/${latestBlock.hash}`
    );

    // Build the list starting from the latest block
    const blocks: BlockSummary[] = [];
    let currentBlock = block;

    for (let i = 0; i < count; i++) {
        blocks.push({
            height: currentBlock.height,
            hash: currentBlock.hash,
            timestamp: new Date(currentBlock.time * 1000),
            txCount: currentBlock.n_tx,
            size: currentBlock.size,
            miner: identifyMiner(''), // Coinbase not available in raw block
            confirmations: latestBlock.height - currentBlock.height + 1,
        });

        if (i < count - 1 && currentBlock.prev_block) {
            currentBlock = await blockchainService.get<BlockchainBlockResponse>(
                `/rawblock/${currentBlock.prev_block}`
            );
        }
    }

    return blocks;
}

export async function getBlockByHashOrHeight(
    identifier: string
): Promise<BlockSummary> {
    // If it looks like a height (numeric), convert to hash first
    const endpoint = /^\d+$/.test(identifier)
        ? `/block-height/${identifier}?format=json`
        : `/rawblock/${identifier}`;

    const block = await blockchainService.get<BlockchainBlockResponse>(endpoint);

    const latestBlock = await blockchainService.get<LatestBlockResponse>(
        '/latestblock'
    );

    return {
        height: block.height,
        hash: block.hash,
        timestamp: new Date(block.time * 1000),
        txCount: block.n_tx,
        size: block.size,
        miner: identifyMiner(''),
        confirmations: latestBlock.height - block.height + 1,
    };
}
