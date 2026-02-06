// Ejemplo de estructura para src/app/api/endpoints.ts
// Complementa estructura-global.md y mutations-y-servicios.md. Mantén todos los endpoints centralizados aquí.

export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/auth/login',
    RENEW_TOKEN: '/auth/refresh-token',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    GOOGLE_AUTH: '/auth/google',
    GOOGLE_CALLBACK: '/auth/google/callback',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password/',
    CHANGE_PASSWORD: '/auth/change-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION_EMAIL: '/auth/resend-verification-email',
    VERIFY_RESET_PASSWORD_TOKEN: '/auth/verify-reset-password-token',

    // Users
    USER_INFO: '/users/me',
    USERS: '/users',
    UPDATE_USER: '/users',
    ADMIN_USERS: '/users/admin',

    // Categories & Products
    CATEGORIES: '/categories',
    CATEGORY: '/categories', // + ID
    SUBCATEGORIES: '/subcategories',
    PRODUCTS: '/products',
    PRODUCT: '/products', // + ID

    // Cart
    CART: '/cart',
    CART_ITEM: '/cart',

    // Addresses
    ADDRESSES: '/addresses',
    ADDRESS: '/addresses',
    SET_DEFAULT_ADDRESS: '/addresses/set-default',

    // Orders
    ORDERS: '/orders',
    ORDER: '/orders',
    MY_ORDERS: '/orders/my-orders',

    // Payments
    PAYMENTS: '/payments',
    CREATE_TRANSACTION: '/payments/create-transaction',
    PENDING_TRANSACTIONS: '/payments/my-pending-payments',
    UPDATE_TRANSACTION_STATUS: '/payments/update-status',
    VERIFY_MERCADOPAGO_PAYMENT: '/payments/verify-mercadopago-payment',

    // Dashboard
    DASHBOARD_STATS: '/dashboard/stats',

    // Profile
    PROFILE: '/profile',

    // Payment Methods
    PAYMENT_METHODS: '/payment-methods',
    PAYMENT_METHOD_BY_ID: '/payment-methods',
};
