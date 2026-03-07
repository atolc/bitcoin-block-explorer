import { Routes, Route } from "react-router"
import RootLayout from "@/layouts/root-layout"
import HomePage from "@/pages/home"
import BlocksPage from "@/pages/blocks"
import TransactionsPage from "@/pages/transactions"
import StatsPage from "@/pages/stats"
import NotFoundPage from "@/pages/not-found"

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="blocks" element={<BlocksPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route path="stats" element={<StatsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
