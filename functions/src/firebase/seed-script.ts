#!/usr/bin/env ts-node

import { seedDatabase } from './seed';

seedDatabase()
  .then(report => {
    console.log('✅ Database seeded successfully:');
    console.table(report);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  });
