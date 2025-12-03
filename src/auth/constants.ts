export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'fallback_secret_key_DO_NOT_USE_IN_PROD', // In production, use env var
};

