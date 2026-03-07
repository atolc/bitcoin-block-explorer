import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import { ThemeProvider } from "@/providers/theme-provider"
import { ApiConfigProvider } from "@/providers/api-config-provider"
import App from "./App.tsx"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="btc-explorer-theme">
        <ApiConfigProvider>
          <App />
        </ApiConfigProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)

