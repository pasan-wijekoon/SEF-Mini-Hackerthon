/**
 * Central API configuration.
 * All fetch/axios calls in the frontend should import `API_BASE_URL` from here.
 *
 * The value comes from the VITE_API_BASE_URL environment variable.
 * - Local dev: set in frontend/.env
 * - Production (Vercel): set as an Environment Variable in the Vercel dashboard.
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000';
