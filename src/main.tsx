import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import { ThemeProvider } from "@/providers/theme-provider"
import App from "./App.tsx"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="btc-explorer-theme">
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
