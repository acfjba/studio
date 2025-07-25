// src/lib/data.ts
// This file acts as a centralized module to import and export all mock/seed data
// from the /data directory. This avoids import resolution issues in client components.

import usersSeedData from '@/data/users.json';


// Re-exporting all the data so it can be imported from a single, reliable source.
export {
  usersSeedData,
};
