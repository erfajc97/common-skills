// Auth Store Pattern (Zustand + Persistence)
// Complementa feature-implementation.md y auth-login-modal.md. Ubicación: src/app/store/auth/authStore.ts

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import secureStorage from '@/app/helpers/secureStorage' // Usar el helper seguro

export interface AuthState {
    token: string | null
    refreshToken: string | null
    tokenExpiration: number | null
    roles: string
    keepSession: boolean

    // Actions
    setToken: (token: string, refreshToken: string, expiration: number) => void
    removeToken: () => void
    setRoles: (roles: string) => void
    setKeepSession: (keep: boolean) => void

    // Getters (útiles para lecturas fuera de hooks)
    getToken: () => string | null
    getRefreshToken: () => string | null
    getTokenExpiration: () => number | null
}

export const useAuthStore = create(
    persist<AuthState>(
        (set, get) => ({
            token: null,
            refreshToken: null,
            tokenExpiration: null,
            keepSession: false,
            roles: '',

            setRoles: (roles) => {
                secureStorage.setItem('roles', JSON.stringify(roles))
                set({ roles })
            },

            setToken: (token, refreshToken, expiration) => {
                secureStorage.setItem('token', token)
                secureStorage.setItem('refreshToken', refreshToken)
                secureStorage.setItem('tokenExpiration', String(expiration))
                set({ token, refreshToken, tokenExpiration: expiration })
            },

            removeToken: () => {
                // Limpiar storage seguro
                secureStorage.removeItem('token')
                secureStorage.removeItem('refreshToken')
                secureStorage.removeItem('roles')
                // Reset state
                set({ token: null, refreshToken: null, roles: '', keepSession: false })
            },

            setKeepSession: (keep) => {
                secureStorage.setItem('keepSession', String(keep))
                set({ keepSession: keep })
            },

            getToken: () => get().token,
            getRefreshToken: () => get().refreshToken,
            getTokenExpiration: () => get().tokenExpiration,
        }),
        {
            name: 'auth-store',
            storage: createJSONStorage(() => secureStorage), // Persistencia encriptada
        },
    ),
)
