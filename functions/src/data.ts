// functions/src/data.ts
// This file acts as a centralized module to import and export all mock/seed data
// from the /data directory for use in server-side functions.
import schoolData from '@/data/schools.json';
import staffData from '@/data/staff.json';
import usersSeedData from '@/data/users.json';
import inventoryData from '@/data/inventory.json';
import sampleExamResultsData from '@/data/exam-results.json';
import libraryBooksData from '@/data/library-books.json';
import disciplinaryRecordsData from '@/data/disciplinary-records.json';
import counsellingRecordsData from '@/data/counselling-records.json';
import ohsRecordsData from '@/data/ohs-records.json';

// Re-exporting all the data so it can be imported from a single, reliable source within functions.
export {
  schoolData,
  staffData,
  usersSeedData,
  inventoryData,
  sampleExamResultsData,
  libraryBooksData,
  disciplinaryRecordsData,
  counsellingRecordsData,
  ohsRecordsData,
};
