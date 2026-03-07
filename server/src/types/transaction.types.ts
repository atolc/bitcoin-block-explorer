// ─── Transaction Types ─────────────────────────────────────────

export interface TransactionInput {
    prevOut: {
        hash: string;
        value: number;
        addr?: string;
    };
}

export interface TransactionOutput {
    value: number;
    addr?: string;
    script: string;
}

export interface Transaction {
    hash: string;
    from: string;
    to: string;
    value: string;
    fee: string;
    confirmations: number;
    timestamp: string;
    size: number;
    weight: number;
    inputs: TransactionInput[];
    outputs: TransactionOutput[];
}

export interface TransactionSummary {
    hash: string;
    from: string;
    to: string;
    value: string;
    fee: string;
    confirmations: number;
    timestamp: string;
}
