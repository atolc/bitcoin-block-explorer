// ─── Throttled API Configuration ───────────────────────────────
// APIs in this list will have their polling intervals capped to
// a minimum of THROTTLED_INTERVAL_MS to avoid rate-limit errors.

/**
 * List of API hostnames known to impose rate limits.
 * Add new entries when integrating with a rate-limited provider.
 */
export const THROTTLED_API_HOSTS: string[] = [
    "blockchain.info",
    "www.blockchain.info",
    "blockstream.info",
    "api.blockstream.space",
    "api.blockcypher.com",
]

/**
 * Minimum polling interval (in ms) when the configured API is rate-limited.
 * Default: 60 000 ms = 1 minute.
 */
export const THROTTLED_INTERVAL_MS = 60_000

/**
 * Check whether a full API URL belongs to a throttled provider.
 */
export function isThrottledApi(apiUrl: string): boolean {
    try {
        const { hostname } = new URL(apiUrl)
        return THROTTLED_API_HOSTS.some(
            (host) => hostname === host || hostname.endsWith(`.${host}`)
        )
    } catch {
        return false
    }
}
