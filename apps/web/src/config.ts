export const config = {
  api: {
    url: process.env.NEXT_PUBLIC_BACKEND_URL,
  },
  auth: {
    sessionCookieName: 'session',
    accessTokenExpiryMinutes: 1440,
    refreshTokenExpiryDays: 7,
  },
  app: {
    name: 'KwikDeals',
    url: process.env.NEXT_PUBLIC_FRONTEND_URL,
  },
} as const;

export type Config = typeof config;