
import type { Book } from './schemas/library';
import type { UserWithPassword } from './schemas/user';

export const sampleUsersSeedData: UserWithPassword[] = [
    { uid: 'STF-001', displayName: 'Dr. Evelyn Reed', email: 'e.reed@suvagrammar.ac.fj', role: 'head-teacher', schoolId: 'SCH-001', name: 'Dr. Evelyn Reed', password: 'password123', phone: '+679 123 4567' },
    { uid: 'STF-002', displayName: 'Mr. Samuel Greene', email: 's.greene@suvagrammar.ac.fj', role: 'teacher', schoolId: 'SCH-001', name: 'Mr. Samuel Greene', password: 'password123', phone: '+679 123 4568' },
    { uid: 'STF-003', displayName: 'Ms. Clara Bell', email: 'c.bell@natabuahigh.ac.fj', role: 'teacher', schoolId: 'SCH-002', name: 'Ms. Clara Bell', password: 'password123', phone: '+679 234 5678' },
    { uid: 'STF-004', displayName: 'Mr. David Chen', email: 'd.chen@adiscakobau.ac.fj', role: 'librarian', schoolId: 'SCH-003', name: 'Mr. David Chen', password: 'password123', phone: '+679 345 6789' },
    { uid: 'STF-005', displayName: 'Mrs. Helen Chu', email: 'h.chu@natabuahigh.ac.fj', role: 'teacher', schoolId: 'SCH-002', name: 'Mrs. Helen Chu', password: 'password123', phone: '+679 234 5679' },
    { uid: 'STF-006', displayName: 'Mr. Johnathan Lee', email: 'j.lee@suvagrammar.ac.fj', role: 'teacher', schoolId: 'SCH-001', name: 'Mr. Johnathan Lee', password: 'password123', phone: '+679 123 4569' },
    { uid: 'STF-007', displayName: 'Ms. Aisha Khan', email: 'a.khan@adiscakobau.ac.fj', role: 'teacher', schoolId: 'SCH-003', name: 'Ms. Aisha Khan', password: 'password123', phone: '+679 345 6780' },
    { uid: 'STF-008', displayName: 'SENIROSI LEDUA', email: 's.ledua@suvagrammar.ac.fj', role: 'teacher', schoolId: 'SCH-001', name: 'SENIROSI LEDUA', password: 'password123', phone: '+679 123 1111' },
    { uid: 'STF-009', displayName: 'GAYLESHNI GAYETRI DEV', email: 'g.dev@suvagrammar.ac.fj', role: 'teacher', schoolId: 'SCH-001', name: 'GAYLESHNI GAYETRI DEV', password: 'password123', phone: '+679 123 2222' },
    { uid: 'STF-010', displayName: 'SHIVAM MELVIN RAJ', email: 's.raj@natabuahigh.ac.fj', role: 'teacher', schoolId: 'SCH-002', name: 'SHIVAM MELVIN RAJ', password: 'password123', phone: '+679 234 3333' },
    { uid: 'STF-011', displayName: 'SEEMA SHARMA', email: 's.sharma@natabuahigh.ac.fj', role: 'teacher', schoolId: 'SCH-002', name: 'SEEMA SHARMA', password: 'password123', phone: '+679 234 4444' },
    { uid: 'STF-012', displayName: 'GRACE WILSON', email: 'g.wilson@adiscakobau.ac.fj', role: 'teacher', schoolId: 'SCH-003', name: 'GRACE WILSON', password: 'password123', phone: '+679 345 5555' },
    { uid: 'SYS-001', displayName: 'System Administrator', email: 'sysadmin@system.com', role: 'system-admin', schoolId: '', name: 'System Administrator', password: 'adminpass', phone: 'N/A' },
    { uid: 'KND-001', displayName: 'Kindergarten Teacher', email: 'kinder@suvagrammar.ac.fj', role: 'kindergarten', schoolId: 'SCH-001', name: 'Kindergarten Teacher', password: 'password123', phone: '+679 123 7777' },
];

export const sampleLibraryBooksData: Book[] = [
  {
    id: 'book_1',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    category: 'Fiction',
    isbn: '978-0-06-112008-4',
    totalCopies: 5,
    availableCopies: 3,
    createdAt: '2023-01-10T00:00:00Z',
    updatedAt: '2023-01-10T00:00:00Z',
  },
  {
    id: 'book_2',
    title: '1984',
    author: 'George Orwell',
    category: 'Dystopian',
    isbn: '978-0-452-28423-4',
    totalCopies: 3,
    availableCopies: 0,
    createdAt: '2023-01-11T00:00:00Z',
    updatedAt: '2023-01-11T00:00:00Z',
  },
  {
    id: 'book_3',
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    category: 'Science',
    isbn: '978-0-553-38016-3',
    totalCopies: 4,
    availableCopies: 4,
    createdAt: '2023-01-12T00:00:00Z',
    updatedAt: '2023-01-12T00:00:00Z',
  },
   {
    id: 'book_4',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Fiction',
    isbn: '978-0-7432-7356-5',
    totalCopies: 6,
    availableCopies: 5,
    createdAt: '2023-01-13T00:00:00Z',
    updatedAt: '2023-01-13T00:00:00Z',
  },
];
