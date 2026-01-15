'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface UserData {
    id: string
    name: string
    email: string
    usn: string
    collegeName: string
    age: string
    phone: string
    idCardUrl?: string
    profileCode: string
    hasPaid: boolean
    registeredEvents: { id: string, teamName: string }[]
    avatar: string
    studentType: 'internal' | 'external'
    password?: string
}

interface Event {
    id: string
    title: string
    type: 'Technical' | 'Cultural' | 'Gaming'
    fee: number
    visual: string
}

interface AppContextType {
    cart: Event[]
    addToCart: (event: Event) => void
    removeFromCart: (id: string) => void
    clearCart: () => void
    totalAmount: number
    isLoggedIn: boolean
    userData: UserData | null
    login: (email: string, password?: string) => void
    logout: () => void
    registerUser: (data: Omit<UserData, 'id' | 'profileCode' | 'hasPaid' | 'registeredEvents' | 'avatar' | 'studentType'>) => void
    markAsPaid: () => void
    updateRegisteredEvents: (events: { id: string, teamName: string }[]) => void
    updateAvatar: (avatarUrl: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<Event[]>([])
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userData, setUserData] = useState<UserData | null>(null)


    const addToCart = (event: Event) => {
        if (!cart.find(item => item.id === event.id)) {
            setCart([...cart, event])
        }
    }

    const removeFromCart = (id: string) => {
        setCart(cart.filter(item => item.id !== id))
    }

    const clearCart = () => setCart([])

    const totalAmount = cart.reduce((total, item) => total + item.fee, 0)

    const login = (email: string, password?: string) => {
        // Backend Integration Point: authentication logic will go here
        // For now, we'll just allow setting the state if the user wants to test UI
        console.log('Login attempt:', { email })
    }

    const logout = () => {
        setIsLoggedIn(false)
        setUserData(null)
    }

    const registerUser = (data: any) => {
        // Backend Integration Point: registration logic will go here
        console.log('Register attempt:', data)
        setUserData({ ...data, id: 'temp-id', hasPaid: false, registeredEvents: [], avatar: '', studentType: 'external', profileCode: 'TEMP' })
        setIsLoggedIn(true)
    }

    const markAsPaid = () => {
        if (userData) {
            setUserData({ ...userData, hasPaid: true })
        }
    }

    const updateRegisteredEvents = (events: { id: string, teamName: string }[]) => {
        if (userData) {
            const existing = userData.registeredEvents || []
            const newEvents = events.filter(ne => !existing.find(ee => ee.id === ne.id))
            setUserData({
                ...userData,
                registeredEvents: [...existing, ...newEvents]
            })
        }
    }

    const updateAvatar = (avatarUrl: string) => {
        if (userData) {
            setUserData({ ...userData, avatar: avatarUrl })
        }
    }

    return (
        <AppContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            totalAmount,
            isLoggedIn,
            userData,
            login,
            logout,
            registerUser,
            markAsPaid,
            updateRegisteredEvents,
            updateAvatar
        }}>
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    const context = useContext(AppContext)
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider')
    }
    return context
}
