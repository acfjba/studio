// src/lib/data.ts
// This file contains "seed" data for the application, acting as a mock database
// for components that are not yet connected to Firestore.
// In a real-world scenario, this data would be fetched from a live database.

import type { StaffMember } from './schemas/staff';

export const schoolData = [
  { id: 'SCH-001', name: 'Suva Grammar School', address: 'Suva, Fiji' },
  { id: 'SCH-002', name: 'Natabua High School', address: 'Lautoka, Fiji' },
  { id: 'SCH-003', name: 'Adi Cakobau School', address: 'Sawani, Fiji' },
];

export const staffData: StaffMember[] = [
  { id: 'STF-001', staffId: 'T001', name: 'Dr. Evelyn Reed', role: 'Head Teacher', position: 'Administration', department: 'Senior Leadership', status: 'Active', schoolId: 'SCH-001', email: 'e.reed@suvagrammar.ac.fj', phone: '+679 123 4567', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'STF-002', staffId: 'T002', name: 'Mr. Samuel Greene', role: 'Teacher', position: 'Mathematics Teacher', department: 'Academics', status: 'Active', schoolId: 'SCH-001', email: 's.greene@suvagrammar.ac.fj', phone: '+679 123 4568', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'STF-003', staffId: 'T003', name: 'Ms. Clara Bell', role: 'Teacher', position: 'Counselor', department: 'Student Support', status: 'On Leave', schoolId: 'SCH-002', email: 'c.bell@natabuahigh.ac.fj', phone: '+679 234 5678', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'STF-004', staffId: 'T004', name: 'Mr. David Chen', role: 'Librarian', position: 'Librarian', department: 'Academics', status: 'Active', schoolId: 'SCH-003', email: 'd.chen@adiscakobau.ac.fj', phone: '+679 345 6789', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'STF-005', staffId: 'T005', name: 'Mrs. Helen Chu', role: 'Teacher', position: 'Science Teacher', department: 'Academics', status: 'Active', schoolId: 'SCH-002', email: 'h.chu@natabuahigh.ac.fj', phone: '+679 234 5679', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'STF-006', staffId: 'T006', name: 'Mr. Johnathan Lee', role: 'Teacher', position: 'Physical Education', department: 'Sports', status: 'Active', schoolId: 'SCH-001', email: 'j.lee@suvagrammar.ac.fj', phone: '+679 123 4569', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'STF-007', staffId: 'T007', name: 'Ms. Aisha Khan', role: 'Teacher', position: 'Art Teacher', department: 'Arts', status: 'Terminated', schoolId: 'SCH-003', email: 'a.khan@adiscakobau.ac.fj', phone: '+679 345 6780', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'STF-008', staffId: 'T008', name: 'SENIROSI LEDUA', role: 'Teacher', position: 'English Teacher', department: 'Academics', status: 'Active', schoolId: 'SCH-001', email: 's.ledua@suvagrammar.ac.fj', phone: '+679 123 1111', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'STF-009', staffId: 'T009', name: 'GAYLESHNI GAYETRI DEV', role: 'Teacher', position: 'Social Studies Teacher', department: 'Academics', status: 'Active', schoolId: 'SCH-001', email: 'g.dev@suvagrammar.ac.fj', phone: '+679 123 2222', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'STF-010', staffId: 'T010', name: 'SHIVAM MELVIN RAJ', role: 'Teacher', position: 'Industrial Arts', department: 'Vocational', status: 'Active', schoolId: 'SCH-002', email: 's.raj@natabuahigh.ac.fj', phone: '+679 234 3333', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'STF-011', staffId: 'T011', name: 'SEEMA SHARMA', role: 'Teacher', position: 'Home Economics', department: 'Vocational', status: 'Active', schoolId: 'SCH-002', email: 's.sharma@natabuahigh.ac.fj', phone: '+679 234 4444', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'STF-012', staffId: 'T012', name: 'GRACE WILSON', role: 'Teacher', position: 'Music Teacher', department: 'Arts', status: 'Active', schoolId: 'SCH-003', email: 'g.wilson@adiscakobau.ac.fj', phone: '+679 345 5555', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

export const inventoryData = [
  { id: 'INV-001', item: 'Laptops', quantity: 50, unitCost: 800, usageRate: 5, reorderPoint: 10, status: 'In Stock' },
  { id: 'INV-002', item: 'Projectors', quantity: 15, unitCost: 350, usageRate: 2, reorderPoint: 5, status: 'In Stock' },
  { id: 'INV-003', item: 'Textbooks - Grade 10 Math', quantity: 150, unitCost: 75, usageRate: 20, reorderPoint: 30, status: 'In Stock' },
  { id: 'INV-004', item: 'Whiteboard Markers', quantity: 200, unitCost: 1, usageRate: 50, reorderPoint: 100, status: 'Low Stock' },
  { id: 'INV-005', item: 'Lab Coats', quantity: 40, unitCost: 25, usageRate: 10, reorderPoint: 20, status: 'In Stock' },
  { id: 'INV-006', item: 'Microscopes', quantity: 8, unitCost: 1200, usageRate: 1, reorderPoint: 2, status: 'Out of Stock' },
  { id: 'INV-007', item: 'Soccer Balls', quantity: 30, unitCost: 20, usageRate: 5, reorderPoint: 10, status: 'In Stock' },
];

export const sampleExamResultsData = [
    {
      id: 'ER-001',
      studentId: 'S12345',
      studentName: 'John Doe',
      studentYear: '5',
      examType: 'Mid-Term',
      subject: 'Mathematics',
      score: 85,
      grade: 'A',
      examDate: '2023-05-15',
      term: '2',
      year: '2023',
      comments: 'Excellent understanding of calculus.',
      recordedByUserId: 'USR-001',
      schoolId: 'SCH-001',
      createdAt: '2023-05-16T10:00:00Z',
      updatedAt: '2023-05-16T10:00:00Z',
    },
    {
      id: 'ER-002',
      studentId: 'S67890',
      studentName: 'Jane Smith',
      studentYear: '7',
      examType: 'Final',
      subject: 'English Literature',
      score: 92,
      grade: 'A+',
      examDate: '2023-11-20',
      term: '4',
      year: '2023',
      comments: 'Outstanding analysis in the final essay.',
      recordedByUserId: 'USR-002',
      schoolId: 'SCH-002',
      createdAt: '2023-11-21T14:30:00Z',
      updatedAt: '2023-11-21T14:30:00Z',
    },
];

export const overviewChartData = [
  { name: 'Jan', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Feb', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Apr', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'May', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Jun', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Jul', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Aug', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Sep', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Oct', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Nov', total: Math.floor(Math.random() * 5000) + 1000 },
  { name: 'Dec', total: Math.floor(Math.random() * 5000) + 1000 },
];

export const inventoryChartData = inventoryData.map(item => ({ name: item.item, value: item.quantity * item.unitCost}));

export const bookData = [
    { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic', status: 'Available' },
    { id: '2', title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Classic', status: 'Checked Out' },
    { id: '3', title: '1984', author: 'George Orwell', genre: 'Dystopian', status: 'Available' },
    { id: '4', title: 'The Catcher in the Rye', author: 'J.D. Salinger', genre: 'Classic', status: 'Overdue' },
    { id: '5', title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', genre: 'Fantasy', status: 'Available' },
];