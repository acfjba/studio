
// src/lib/seed-data.ts
// ------------------------------------------------------------------
// Only the data we want to insert into Firestore in the seed step.
// ------------------------------------------------------------------

export const schoolsSeedData = [
  { id: 'SCH-001', name: 'Suva Grammar School', address: 'Suva, Fiji' },
  { id: 'SCH-002', name: 'Natabua High School', address: 'Lautoka, Fiji' },
  { id: 'SCH-003', name: 'Adi Cakobau School', address: 'Sawani, Fiji' },
];

export const usersSeedData = [
    { id: 'uid-sysadmin', displayName: 'System Admin', email: 'sysadmin@system.com', role: 'system-admin', schoolId: null, name: 'System Admin', password: 'password123', phone: 'N/A' },
    { id: 'uid-head-teacher-1', displayName: 'Dr. Evelyn Reed', email: 'e.reed@suvagrammar.ac.fj', role: 'head-teacher', schoolId: 'SCH-001', name: 'Dr. Evelyn Reed', password: 'password123', phone: '+679 123 4567' },
    { id: 'uid-asst-head-teacher-1', displayName: 'Mr. Johnathan Lee', email: 'j.lee@suvagrammar.ac.fj', role: 'assistant-head-teacher', schoolId: 'SCH-001', name: 'Mr. Johnathan Lee', password: 'password123', phone: '+679 123 4569' },
    { id: 'uid-primary-admin-1', displayName: 'Ms. Clara Bell', email: 'c.bell@natabuahigh.ac.fj', role: 'primary-admin', schoolId: 'SCH-002', name: 'Ms. Clara Bell', password: 'password123', phone: '+679 234 5678' },
    { id: 'uid-teacher-1', displayName: 'Mr. Samuel Greene', email: 's.greene@suvagrammar.ac.fj', role: 'teacher', schoolId: 'SCH-001', name: 'Mr. Samuel Greene', password: 'password123', phone: '+679 123 4568' },
    { id: 'uid-teacher-2', displayName: 'Mrs. Helen Chu', email: 'h.chu@natabuahigh.ac.fj', role: 'teacher', schoolId: 'SCH-002', name: 'Mrs. Helen Chu', password: 'password123', phone: '+679 234 5679' },
    { id: 'uid-librarian-1', displayName: 'Mr. David Chen', email: 'd.chen@adiscakobau.ac.fj', role: 'librarian', schoolId: 'SCH-003', name: 'Mr. David Chen', password: 'password123', phone: '+679 345 6789' },
    { id: 'uid-kinder-1', displayName: 'Ms. Kinder Teacher', email: 'kinder@suvagrammar.ac.fj', role: 'kindergarten', schoolId: 'SCH-001', name: 'Ms. Kinder Teacher', password: 'password123', phone: '+679 111 2222' }
];

export const staffSeedData = [
  { id: 'staff-001', name: 'Dr. Evelyn Reed', role: 'head-teacher', position: 'Administration', status: 'Active', schoolId: 'SCH-001', email: 'e.reed@suvagrammar.ac.fj', phone: '+679 123 4567', staffId: 'T001' },
  { id: 'staff-002', name: 'Mr. Samuel Greene', role: 'teacher', position: 'Academics', status: 'Active', schoolId: 'SCH-001', email: 's.greene@suvagrammar.ac.fj', phone: '+679 123 4568', staffId: 'T002' },
  { id: 'staff-003', name: 'Ms. Clara Bell', role: 'primary-admin', position: 'Administration', status: 'On Leave', schoolId: 'SCH-002', email: 'c.bell@natabuahigh.ac.fj', phone: '+679 234 5678', staffId: 'T003' },
  { id: 'staff-004', name: 'Mr. David Chen', role: 'librarian', position: 'Academics', status: 'Active', schoolId: 'SCH-003', email: 'd.chen@adiscakobau.ac.fj', phone: '+679 345 6789', staffId: 'T004' },
  { id: 'staff-005', name: 'Mrs. Helen Chu', role: 'teacher', position: 'Academics', status: 'Active', schoolId: 'SCH-002', email: 'h.chu@natabuahigh.ac.fj', phone: '+679 234 5679', staffId: 'T005' },
  { id: 'staff-006', name: 'Mr. Johnathan Lee', role: 'assistant-head-teacher', position: 'Administration', status: 'Active', schoolId: 'SCH-001', email: 'j.lee@suvagrammar.ac.fj', phone: '+679 123 4569', staffId: 'T006' },
];

export const libraryBooksSeedData = [
  {
    id: 'book-001',
    title: 'The Coral Islands',
    author: 'R. M. Ballantyne',
    schoolId: 'SCH-001',
    category: 'Adventure',
    isbn: '978-1503270389',
    totalCopies: 5,
    availableCopies: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'book-002',
    title: 'A History of Fiji',
    author: 'I. C. Campbell',
    schoolId: 'SCH-002',
    category: 'History',
    isbn: '978-9820108610',
    totalCopies: 3,
    availableCopies: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

export const examResultsSeedData = [
  {
    id: 'exam-001',
    studentId: 'stu-001',
    studentName: 'Ratu Penaia',
    studentYear: '8',
    schoolId: 'SCH-001',
    subject: 'Math',
    score: '88',
    grade: 'A+',
    examType: 'Final',
    otherExamTypeName: '',
    examDate: '2024-11-15',
    term: '4',
    year: '2024',
    comments: 'Excellent work!',
    recordedByUserId: 'uid-teacher-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const disciplinaryRecordsSeedData = [
  {
    id: 'disc-001',
    incidentDate: '2024-05-12',
    studentName: 'Adi Litia',
    studentId: 'stu-002',
    studentDob: '2010-02-20',
    studentYear: '7',
    issues: ['Absent' as const],
    drugType: '',
    otherIssue: '',
    comments: 'Student was late for morning assembly.',
    raisedBy: 'Mr. Smith',
    parentsInformed: 'Yes' as const,
    actionComments: 'Verbal warning given.',
    schoolId: 'SCH-002',
    userId: 'uid-teacher-2',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const counsellingRecordsSeedData = [
    {
        id: 'counselling-001',
        sessionDate: '2024-05-10',
        studentName: 'Sereana Vula',
        studentId: 'stu-003',
        studentDob: '2011-08-15',
        studentYear: '6',
        counsellingType: 'Academic' as const,
        otherCounsellingType: '',
        sessionDetails: 'Discussed exam anxiety and study strategies. Student is worried about upcoming math exam.',
        actionPlan: 'Scheduled follow-up session. Provided with breathing exercises and a study timetable template.',
        parentsContacted: 'Yes' as const,
        counsellorName: 'Mrs. Davis',
        userId: 'uid-head-teacher-1',
        schoolId: 'SCH-001',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];

export const ohsRecordsSeedData = [
    {
        id: 'ohs-001',
        incidentDate: '2024-04-22',
        reportedBy: 'Mr. Kumar',
        compiledBy: 'Mr. Kumar',
        notifiedTo: ['Ministry of Health'],
        ambulanceCalled: false,
        headReport: 'Student slipped on a wet floor near the library. Minor bruise on the knee.',
        actionTaken: 'Applied first aid. Placed "wet floor" sign. Janitor reminded to use signs.',
        parentsNotified: 'Yes',
        schoolId: 'SCH-001',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
];
