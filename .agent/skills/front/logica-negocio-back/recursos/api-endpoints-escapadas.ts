/**
 * Endpoints de la API Escapadas (backend).
 * Usar como referencia en el front: baseUrl + endpoint.
 * Base URL típica en dev: http://localhost:3001
 */

export const API_ENDPOINTS_ESCAPADAS = {
  // Auth
  AUTH_REGISTER: "/auth/register",
  AUTH_LOGIN: "/auth/login",
  AUTH_REFRESH: "/auth/refresh",
  AUTH_LOGOUT: "/auth/logout",
  AUTH_GOOGLE: "/auth/google",
  AUTH_GOOGLE_CALLBACK: "/auth/google/callback",
  AUTH_VERIFY_EMAIL: "/auth/verify-email",
  AUTH_RESEND_VERIFICATION: "/auth/resend-verification",
  AUTH_FORGOT_PASSWORD: "/auth/forgot-password",
  AUTH_RESET_PASSWORD: "/auth/reset-password",

  // Users
  USERS_ME: "/users/me",
  USERS_ME_ATTENDANCES: "/users/me/attendances",
  USERS: "/users",
  USERS_BY_ID: (id: string) => `/users/${id}`,
  USERS_DETAIL: (id: string) => `/users/${id}/detail`,

  // Attendances (compras de eventos)
  ATTENDANCES_ME: "/attendances/me",

  // Events
  EVENTS: "/events",
  EVENTS_MAP: "/events/map",
  EVENTS_BY_ID: (id: string) => `/events/${id}`,
  EVENTS_PRICING: (id: string) => `/events/${id}/pricing`,
  EVENTS_PURCHASE: (id: string) => `/events/${id}/purchase`,

  // Memberships
  MEMBERSHIPS: "/memberships",
  MEMBERSHIPS_MY: "/memberships/my-memberships",
  MEMBERSHIPS_BY_ID: (id: string) => `/memberships/${id}`,
  MEMBERSHIPS_PURCHASE: (id: string) => `/memberships/${id}/purchase`,

  // Statistics (ADMIN)
  STATISTICS: "/statistics",

  // Upload (ADMIN)
  UPLOAD: "/upload",

  // Health
  HEALTH: "/",
} as const;
