import { Outlet } from "react-router"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { NetworkStatus } from "@/components/bitcoin/network-status"
import { useNetworkStats } from "@/hooks/use-api"
import { createContext, useContext } from "react"
import type { NetworkStats } from "@/types"

// ─── Network Stats Context ────────────────────────────────────
// Share network stats across all pages to avoid duplicate fetches

interface NetworkStatsContextValue {
    data: NetworkStats | null
    loading: boolean
    error: string | null
}

const NetworkStatsContext = createContext<NetworkStatsContextValue>({
    data: null,
    loading: true,
    error: null,
})

export function useSharedNetworkStats() {
    return useContext(NetworkStatsContext)
}

// ─── Root Layout ───────────────────────────────────────────────

export default function RootLayout() {
    const networkStats = useNetworkStats()

    const networkData = networkStats.data ?? {
        hashrate: "—",
        difficulty: "—",
        mempoolSize: 0,
        btcPrice: 0,
        blockHeight: 0,
        unconfirmedTxs: 0,
    }

    return (
        <NetworkStatsContext.Provider value={networkStats}>
            <div className="flex min-h-screen flex-col bg-background">
                {/* Network Banner */}
                <NetworkStatus
                    variant="banner"
                    data={networkData}
                    loading={networkStats.loading}
                />

                {/* Header */}
                <Header />

                {/* Page Content */}
                <main className="flex-1">
                    <Outlet />
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </NetworkStatsContext.Provider>
    )
}
