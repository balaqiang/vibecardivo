/** Maximum lengths/counts for card fields. Shared by the parser and the web builder. */
export const LIMITS = {
  name: 60,
  description: 240,
  role: 60,
  location: 48,
  site: 80,
  handle: 48,
  skills: 8,
  skill: 24,
  socials: 8,
} as const;
