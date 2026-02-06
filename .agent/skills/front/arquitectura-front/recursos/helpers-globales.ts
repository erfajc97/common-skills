/* eslint-disable @typescript-eslint/no-explicit-any */
// Colección de Helpers Globales Estándar. Complementa estructura-features.md y mutations-y-servicios.md.

// 1. Sonner Response (Feedback UI)
// Ubicación: src/app/helpers/sonnerResponse.ts
import { toast } from 'sonner'

export const sonnerResponse = (
    message: string,
    type: 'success' | 'error' | 'loading',
) => {
    const defaultOptions = { duration: 3000, position: 'top-right' as const }
    switch (type) {
        case 'success': toast.success(message, defaultOptions); break
        case 'error': toast.error(message, defaultOptions); break
        case 'loading': toast.loading(message, { ...defaultOptions, duration: 2000 }); break
    }
}

// 2. Secure Storage (Encryption)
// Ubicación: src/app/helpers/secureStorage.ts
import SecureStorage from 'secure-web-storage'
import CryptoJS from 'crypto-js'

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY || 'default-secret-key'

export const secureStorage = new SecureStorage(localStorage, {
    hash: (key) => CryptoJS.SHA256(key, SECRET_KEY).toString(),
    encrypt: (data) => CryptoJS.AES.encrypt(data, SECRET_KEY).toString(),
    decrypt: (data) => CryptoJS.AES.decrypt(data, SECRET_KEY).toString(CryptoJS.enc.Utf8),
})

// 3. Data to FormData
// Ubicación: src/app/helpers/dataToFormData.ts
export const dataToFormData = (data: any) => {
    const formData = new FormData()
    for (const key in data) {
        if (data[key] !== undefined && data[key] !== null) {
            formData.append(key, data[key])
        }
    }
    return formData
}

// 4. Pagination Parser
// Ubicación: src/app/helpers/parsePaginatedResponse.ts
export interface PaginatedResponse<T> {
    content: Array<T>
    pagination: { page: number; limit: number; total: number; totalPages: number }
}

export const parsePaginatedResponse = <T>(data: any): Array<T> | PaginatedResponse<T> => {
    // Lógica para extraer content/users y pagination de respuestas backend
    // ... (ver implementación completa en chat history)
    if (Array.isArray(data)) return data
    if (data?.content && Array.isArray(data.content)) {
        return data.pagination ? { content: data.content, pagination: data.pagination } : data.content
    }
    return []
}
