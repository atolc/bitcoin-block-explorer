import {
    createContext,
    useContext,
    useState,
    useEffect,
    type ReactNode,
} from "react"
import { isThrottledApi } from "@/config/rate-limit.config"
import { fetchApiConfig } from "@/services/api"

// ─── Context ───────────────────────────────────────────────────

interface ApiConfigContextValue {
    /** true while the config is being loaded */
    loading: boolean
    /** true when the backend API URL is in the throttled list */
    isThrottled: boolean
    /** the raw API URL returned by the server */
    apiUrl: string
}

const ApiConfigContext = createContext<ApiConfigContextValue>({
    loading: true,
    isThrottled: false,
    apiUrl: "",
})

export function useApiConfig() {
    return useContext(ApiConfigContext)
}

// ─── Provider ──────────────────────────────────────────────────

export function ApiConfigProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<ApiConfigContextValue>({
        loading: true,
        isThrottled: false,
        apiUrl: "",
    })

    useEffect(() => {
        fetchApiConfig()
            .then(({ apiUrl }) => {
                setState({
                    loading: false,
                    isThrottled: isThrottledApi(apiUrl),
                    apiUrl,
                })
            })
            .catch(() => {
                // If config fails to load, default to throttled for safety
                setState({
                    loading: false,
                    isThrottled: true,
                    apiUrl: "",
                })
            })
    }, [])

    return (
        <ApiConfigContext.Provider value={state}>
            {children}
        </ApiConfigContext.Provider>
    )
}
