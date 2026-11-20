/**
 * Vercel Function entry. `vercel.json` rewrites every `/api/*` path here and Hono routes it.
 * Uses the Web-standard handler signature supported by Vercel's Node.js runtime.
 */
import { app } from '../src/server/app.js';

export const GET = (request: Request): Response | Promise<Response> => app.fetch(request);
export const HEAD = GET;
