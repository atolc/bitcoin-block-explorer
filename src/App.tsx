import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { SearchBar } from "@/components/bitcoin/search-bar"
import { StatCard } from "@/components/bitcoin/stat-card"
import { BlockCard } from "@/components/bitcoin/block-card"
import { TransactionTable } from "@/components/bitcoin/transaction-table"
import { NetworkStatus } from "@/components/bitcoin/network-status"
import { HashDisplay } from "@/components/bitcoin/hash-display"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Blocks,
  ArrowRightLeft,
  Activity,
  TrendingUp,
  Cpu,
  Wallet,
} from "lucide-react"

// ─── Mock Data ─────────────────────────────────────────────────
const mockNetworkData = {
  hashrate: "512.3 EH/s",
  difficulty: "92.05T",
  mempoolSize: 14523,
  btcPrice: 97842,
  blockHeight: 889421,
  unconfirmedTxs: 14523,
}

const mockBlocks = [
  {
    height: 889421,
    hash: "00000000000000000002a7c4c1e48d76c5a37902165a270156b7a8d72728a054",
    timestamp: new Date(Date.now() - 3 * 60 * 1000),
    txCount: 3427,
    size: 1_523_847,
    miner: "Foundry USA",
    confirmations: 1,
  },
  {
    height: 889420,
    hash: "000000000000000000014c2e0a5e7b3a4d8f6c9e2b1a0d3f5e7c9b8a6d4f2e1c",
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    txCount: 2891,
    size: 1_398_234,
    miner: "AntPool",
    confirmations: 2,
  },
  {
    height: 889419,
    hash: "00000000000000000003f8e2d4c6b8a0e2d4c6b8a0f2e4d6c8b0a2e4d6c8b0a2",
    timestamp: new Date(Date.now() - 23 * 60 * 1000),
    txCount: 4102,
    size: 1_987_654,
    miner: "F2Pool",
    confirmations: 3,
  },
  {
    height: 889418,
    hash: "000000000000000000028a4c6e8b0d2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b",
    timestamp: new Date(Date.now() - 35 * 60 * 1000),
    txCount: 1876,
    size: 987_321,
    miner: "ViaBTC",
    confirmations: 8,
  },
]

const mockTransactions = [
  {
    hash: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
    from: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    to: "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
    value: "0.54210000",
    fee: "0.00012340",
    confirmations: 6,
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    hash: "b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3",
    from: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
    to: "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4",
    value: "1.23456789",
    fee: "0.00008900",
    confirmations: 3,
    timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
  },
  {
    hash: "c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4",
    from: "1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2",
    to: "1CounterpartyXXXXXXXXXXXXXXXUWLpVr",
    value: "0.00150000",
    fee: "0.00005670",
    confirmations: 0,
    timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
  },
  {
    hash: "d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5",
    from: "3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5",
    to: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    value: "2.10000000",
    fee: "0.00015000",
    confirmations: 142,
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
  },
  {
    hash: "e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6",
    from: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    to: "bc1q34aq5drpuwy3n643dn64s3lgk2drf5um3p7w5s",
    value: "0.08765432",
    fee: "0.00003210",
    confirmations: 15,
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    hash: "f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7",
    from: "1BoatSLRHtKNngkdXEeobR76b53LETtpyT",
    to: "3Kzh9qAqVWQhEsfQz7zEQL1EuSx5tyNLNS",
    value: "5.67890000",
    fee: "0.00021000",
    confirmations: 87,
    timestamp: new Date(Date.now() - 200 * 60 * 1000).toISOString(),
  },
]

// ─── App ───────────────────────────────────────────────────────
function App() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Network Banner */}
      <NetworkStatus variant="banner" data={mockNetworkData} />

      {/* Header */}
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b bg-gradient-to-b from-bitcoin/5 via-transparent to-transparent">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-bitcoin/10 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Explore the{" "}
                <span className="bg-gradient-to-r from-bitcoin to-amber-600 bg-clip-text text-transparent">
                  Bitcoin
                </span>{" "}
                Blockchain
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                Search blocks, transactions, and addresses on the Bitcoin
                network in real-time.
              </p>
              <div className="mt-8">
                <SearchBar variant="hero" />
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          {/* Stats Grid */}
          <section className="mb-8">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
              <StatCard
                title="Block Height"
                value="#889,421"
                icon={Blocks}
                change="+1"
                changeDirection="up"
                variant="highlighted"
              />
              <StatCard
                title="Transactions (24h)"
                value="342,891"
                icon={ArrowRightLeft}
                change="+5.2%"
                changeDirection="up"
              />
              <StatCard
                title="Hashrate"
                value="512 EH/s"
                icon={Cpu}
                change="-1.3%"
                changeDirection="down"
              />
              <StatCard
                title="Avg Fee"
                value="$2.34"
                icon={Wallet}
                change="+12%"
                changeDirection="up"
                description="12 sat/vB"
              />
            </div>
          </section>

          <Separator className="mb-8" />

          {/* Tabs Section */}
          <Tabs defaultValue="blocks" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger
                  value="blocks"
                  className="flex items-center gap-1.5"
                >
                  <Blocks className="h-4 w-4" />
                  Latest Blocks
                </TabsTrigger>
                <TabsTrigger
                  value="transactions"
                  className="flex items-center gap-1.5"
                >
                  <ArrowRightLeft className="h-4 w-4" />
                  Transactions
                </TabsTrigger>
                <TabsTrigger
                  value="network"
                  className="flex items-center gap-1.5"
                >
                  <Activity className="h-4 w-4" />
                  Network
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Blocks Tab */}
            <TabsContent value="blocks" className="space-y-3">
              <BlockCard block={mockBlocks[0]} variant="featured" />
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {mockBlocks.slice(1).map((block) => (
                  <BlockCard key={block.height} block={block} />
                ))}
              </div>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions">
              <TransactionTable data={mockTransactions} pageSize={5} />
            </TabsContent>

            {/* Network Tab */}
            <TabsContent value="network" className="space-y-4">
              <NetworkStatus variant="card" data={mockNetworkData} />
              <div className="grid gap-4 md:grid-cols-2">
                <StatCard
                  title="Difficulty"
                  value="92.05T"
                  icon={TrendingUp}
                  change="+3.6%"
                  changeDirection="up"
                  description="Next adjustment in ~12 days"
                  variant="highlighted"
                />
                <StatCard
                  title="Unconfirmed TXs"
                  value="14,523"
                  icon={Activity}
                  change="-8.1%"
                  changeDirection="down"
                  description="Mempool is clearing"
                />
              </div>

              {/* HashDisplay demo */}
              <div className="rounded-lg border p-4">
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                  Latest Block Hash
                </h3>
                <HashDisplay
                  hash="00000000000000000002a7c4c1e48d76c5a37902165a270156b7a8d72728a054"
                  variant="full"
                  size="sm"
                  copyable
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default App
