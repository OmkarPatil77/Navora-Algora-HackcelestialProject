import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const DEMO_CREDENTIALS = {
  TRAVELER: {
    email: 'traveler@demo.com',
    password: 'Traveler@123',
    role: 'TRAVELER',
    name: 'Anish Sharma',
    avatar: 'AS',
    subtitle: 'Traveler • Goa Explorer'
  },
  OPERATOR: {
    email: 'operator@demo.com',
    password: 'Operator@123',
    role: 'OPERATOR',
    name: 'Devendra Verma',
    avatar: 'DV',
    subtitle: 'Lead Tour Operator • Goa Dispatch Hub'
  }
}

const STORAGE_KEY = 'navora_auth_user'
const REGISTERED_USERS_KEY = 'navora_registered_users'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch (e) {
      console.error('Failed to parse auth user from storage', e)
      return null
    }
  })

  // Sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  const getRegisteredUsers = () => {
    try {
      const saved = localStorage.getItem(REGISTERED_USERS_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  }

  const login = (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase()
    const cleanPass = (password || '').trim()

    // 1. Check Demo Traveler
    if (
      cleanEmail === DEMO_CREDENTIALS.TRAVELER.email.toLowerCase() &&
      cleanPass === DEMO_CREDENTIALS.TRAVELER.password
    ) {
      const loggedUser = {
        id: 'demo-traveler-1',
        ...DEMO_CREDENTIALS.TRAVELER
      }
      setUser(loggedUser)
      return { success: true, user: loggedUser }
    }

    // 2. Check Demo Operator
    if (
      cleanEmail === DEMO_CREDENTIALS.OPERATOR.email.toLowerCase() &&
      cleanPass === DEMO_CREDENTIALS.OPERATOR.password
    ) {
      const loggedUser = {
        id: 'demo-operator-1',
        ...DEMO_CREDENTIALS.OPERATOR
      }
      setUser(loggedUser)
      return { success: true, user: loggedUser }
    }

    // 3. Check registered users
    const registered = getRegisteredUsers()
    const found = registered.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.password === cleanPass
    )

    if (found) {
      const { password: _, ...safeUser } = found
      setUser(safeUser)
      return { success: true, user: safeUser }
    }

    return {
      success: false,
      error: 'Invalid credentials. Please check your email and password or use the demo buttons.'
    }
  }

  const loginAs = (role) => {
    const targetRole = role.toUpperCase()
    if (targetRole === 'TRAVELER') {
      const loggedUser = {
        id: 'demo-traveler-1',
        ...DEMO_CREDENTIALS.TRAVELER
      }
      setUser(loggedUser)
      return loggedUser
    } else if (targetRole === 'OPERATOR') {
      const loggedUser = {
        id: 'demo-operator-1',
        ...DEMO_CREDENTIALS.OPERATOR
      }
      setUser(loggedUser)
      return loggedUser
    }
    return null
  }

  const signup = ({ name, email, password, role }) => {
    const cleanEmail = (email || '').trim().toLowerCase()
    const cleanName = (name || '').trim()
    const cleanRole = (role || 'TRAVELER').toUpperCase()

    if (!cleanName || !cleanEmail || !password) {
      return { success: false, error: 'Please fill in all required fields.' }
    }

    // Check if email conflicts with demo accounts
    if (
      cleanEmail === DEMO_CREDENTIALS.TRAVELER.email.toLowerCase() ||
      cleanEmail === DEMO_CREDENTIALS.OPERATOR.email.toLowerCase()
    ) {
      return { success: false, error: 'This email is reserved for demo accounts. Please log in directly.' }
    }

    const registered = getRegisteredUsers()
    if (registered.some((u) => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'An account with this email already exists.' }
    }

    const initials = cleanName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'U'

    const newUser = {
      id: `user-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      password,
      role: cleanRole,
      avatar: initials,
      subtitle: cleanRole === 'OPERATOR' ? 'Tour Operator' : 'Traveler'
    }

    // Save to registered list
    localStorage.setItem(
      REGISTERED_USERS_KEY,
      JSON.stringify([...registered, newUser])
    )

    // Log the user in
    const { password: _, ...safeUser } = newUser
    setUser(safeUser)
    return { success: true, user: safeUser }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem('navora_is_trip_booked')
    localStorage.removeItem('navora_booked_trip')
  }

  const value = {
    user,
    role: user?.role || null,
    isAuthenticated: Boolean(user),
    isTraveler: user?.role === 'TRAVELER',
    isOperator: user?.role === 'OPERATOR',
    login,
    loginAs,
    signup,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
