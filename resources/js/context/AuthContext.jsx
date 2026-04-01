import { createContext, useContext, useMemo } from "react"
import { usePage } from "@inertiajs/react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { auth } = usePage().props

  const value = useMemo(() => ({
    user: auth?.user ?? null,
  }), [auth])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }

  return context
}
