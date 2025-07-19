export const schoolData = [
  { id: 'SCH-001', name: 'Suva Grammar School', address: 'Suva, Fiji' },
  { id: 'SCH-002', name: 'Natabua High School', address: 'Lautoka, Fiji' },
  { id: 'SCH-003', name: 'Adi Cakobau School', address: 'Sawani, Fiji' },
];

export const staffData = [
  { id: 'STF-001', name: 'Dr. Evelyn Reed', role: 'Principal', department: 'Administration', status: 'Active', schoolId: 'SCH-001', email: 'e.reed@suvagrammar.ac.fj', phone: '+679 123 4567' },
  { id: 'STF-002', name: 'Mr. Samuel Greene', role: 'Mathematics Teacher', department: 'Academics', status: 'Active', schoolId: 'SCH-001', email: 's.greene@suvagrammar.ac.fj', phone: '+679 123 4568' },
  { id: 'STF-003', name: 'Ms. Clara Bell', role: 'School Counselor', department: 'Student Support', status: 'On Leave', schoolId: 'SCH-002', email: 'c.bell@natabuahigh.ac.fj', phone: '+679 234 5678' },
  { id: 'STF-004', name: 'Mr. David Chen', role: 'Librarian', department: 'Academics', status: 'Active', schoolId: 'SCH-003', email: 'd.chen@adiscakobau.ac.fj', phone: '+679 345 6789' },
  { id: 'STF-005', name: 'Mrs. Helen Chu', role: 'Science Teacher', department: 'Academics', status: 'Active', schoolId: 'SCH-002', email: 'h.chu@natabuahigh.ac.fj', phone: '+679 234 5679' },
  { id: 'STF-006', name: 'Mr. Johnathan Lee', role: 'Physical Education', department: 'Sports', status: 'Active', schoolId: 'SCH-001', email: 'j.lee@suvagrammar.ac.fj', phone: '+679 123 4569' },
  { id: 'STF-007', name: 'Ms. Aisha Khan', role: 'Art Teacher', department: 'Arts', status: 'Terminated', schoolId: 'SCH-003', email: 'a.khan@adiscakobau.ac.fj', phone: '+679 345 6780' },
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

export const bookData = [
    { id: 'BK-001', title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', status: 'Available' },
    { id: 'BK-002', title: '1984', author: 'George Orwell', genre: 'Dystopian', status: 'Checked Out' },
    { id: 'BK-003', title: 'A Brief History of Time', author: 'Stephen Hawking', genre: 'Science', status: 'Available' },
    { id: 'BK-004', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Fiction', status: 'Overdue' },
    { id: 'BK-005', title: 'The Diary of a Young Girl', author: 'Anne Frank', genre: 'Biography', status: 'Available' },
    { id: 'BK-006', title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', genre: 'History', status: 'Checked Out' },
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

export const inventoryChartData = inventoryData.map(item => ({ name: item.item, value: item.quantity * item.unitCost }));
