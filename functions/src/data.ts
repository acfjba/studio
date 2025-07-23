// functions/src/data.ts
// This file acts as a centralized module to import and export all mock/seed data
// from the /data directory for use in server-side functions.
import schoolData from '../../src/data/schools.json';
import staffData from '../../src/data/staff.json';
import usersSeedData from '../../src/data/users.json';
import inventoryData from '../../src/data/inventory.json';
import sampleExamResultsData from '../../src/data/exam-results.json';
import libraryBooksData from '../../src/data/library-books.json';
import disciplinaryRecordsData from '../../src/data/disciplinary-records.json';
import counsellingRecordsData from '../../src/data/counselling-records.json';
import ohsRecordsData from '../../src/data/ohs-records.json';

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
