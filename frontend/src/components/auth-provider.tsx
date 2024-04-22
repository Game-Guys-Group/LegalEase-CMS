import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from '@tanstack/react-router'


type AuthProviderProps = {
  children: React.ReactNode,
  storageKey: string
}

type AuthProviderState = {
  token: string,
  setToken: (token: string) => void
}

const initialState: AuthProviderState = {
  token: '',
  setToken: () => null
}


const AuthProviderContext = createContext<AuthProviderState>(initialState)

export function AuthProvider({ children, storageKey = "jwt-key", ...props }: AuthProviderProps) {
  const [token, setToken] = useState<string>('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem(storageKey)
    if (token) {
      setToken(token)
    }
    navigate('/login')
  }, [token])


  const value = {
    token,
    setToken: (token: string) => {
      setToken(token)
    },
  }

  return (
    <AuthProviderContext.Provider {...props} value={value}>
      {children}
    </AuthProviderContext.Provider>
  )

}

export function useAuth() {
  let context = useContext(AuthProviderContext)
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider')
  }
  return context
}
