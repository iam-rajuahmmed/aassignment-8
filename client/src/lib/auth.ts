/**
 * BookNook Authentication Configuration
 * Tech Stack Requirement:
 * - BetterAuth
 * - MongoDB Adapter
 * - JWT Authorization
 */

export interface BetterAuthUser {
  id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BetterAuthSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * MongoDB Adapter Schema for BetterAuth
 * Stores users and sessions in 'users' and 'sessions' collections in booknook_db
 */
export const betterAuthConfig = {
  appName: 'BookNook',
  database: {
    provider: 'mongodb',
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/booknook_db',
    collections: {
      user: 'users',
      session: 'sessions',
      account: 'accounts',
      verification: 'verifications',
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Per prompt: "Don’t implement email verification or forget password method"
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || 'booknook-google-client-id.apps.googleusercontent.com',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'booknook-google-client-secret',
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'booknook_super_secure_secret_key_2026',
    expiresIn: '7d',
  },
};

export default betterAuthConfig;
