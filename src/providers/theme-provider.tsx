import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

interface ThemeProviderProps {
    children: React.ReactNode
    defaultTheme?: Theme
    storageKey?: string
}

interface ThemeProviderState {
    theme: Theme
    setTheme: (theme: Theme) => void
    resolvedTheme: "dark" | "light"
}

const ThemeProviderContext = createContext<ThemeProviderState>({
    theme: "system",
    setTheme: () => null,
    resolvedTheme: "dark",
})

function getSystemTheme(): "dark" | "light" {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
}

export function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "btc-explorer-theme",
}: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(
        () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
    )

    const resolvedTheme = theme === "system" ? getSystemTheme() : theme

    useEffect(() => {
        const root = window.document.documentElement

        root.classList.remove("light", "dark")
        root.classList.add(resolvedTheme)
    }, [resolvedTheme])

    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
        const handleChange = () => {
            if (theme === "system") {
                const root = window.document.documentElement
                root.classList.remove("light", "dark")
                root.classList.add(getSystemTheme())
            }
        }

        mediaQuery.addEventListener("change", handleChange)
        return () => mediaQuery.removeEventListener("change", handleChange)
    }, [theme])

    const value = {
        theme,
        resolvedTheme,
        setTheme: (newTheme: Theme) => {
            localStorage.setItem(storageKey, newTheme)
            setTheme(newTheme)
        },
    }

    return (
        <ThemeProviderContext.Provider value={value}>
            {children}
        </ThemeProviderContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeProviderContext)
    if (context === undefined)
        throw new Error("useTheme must be used within a ThemeProvider")
    return context
}
