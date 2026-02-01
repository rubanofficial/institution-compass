// Mock data for development and testing

import { Complaint, Admin, ComplaintCategory, ComplaintStatus, ComplaintPriority } from '@/types/complaint';

const categories: ComplaintCategory[] = [
  'academic', 'administrative', 'infrastructure', 'harassment', 
  'safety', 'financial', 'hostel', 'library', 'transport', 'other'
];

const statuses: ComplaintStatus[] = ['submitted', 'in_review', 'resolved', 'rejected'];
const priorities: ComplaintPriority[] = ['low', 'medium', 'high', 'critical'];

const departments = [
  'Computer Science', 'Electrical Engineering', 'Mechanical Engineering',
  'Civil Engineering', 'Business Administration', 'Arts & Humanities'
];

const sampleComplaints: string[] = [
  'The air conditioning in Building A classroom 101 has not been working for two weeks.',
  'Library resources are outdated and we need more recent publications.',
  'There is a safety hazard near the parking lot due to poor lighting.',
  'The online portal is frequently down during peak hours.',
  'Hostel water supply is inconsistent during morning hours.',
  'Lab equipment in Chemistry department needs urgent maintenance.',
  'Bus schedule does not align with class timings.',
  'Cafeteria food quality has declined significantly.',
];

function generateComplaintId(): string {
  const prefix = 'GRV';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function generateMockComplaint(index: number): Complaint {
  const isAnonymous = Math.random() > 0.6;
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const priority = priorities[Math.floor(Math.random() * priorities.length)];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const createdDate = randomDate(new Date(2024, 0, 1), new Date());
  
  return {
    complaintId: generateComplaintId(),
    isAnonymous,
    identity: isAnonymous ? null : {
      fullName: `Student ${index + 1}`,
      rollNumber: `2024${String(index + 100).padStart(4, '0')}`,
      department: departments[Math.floor(Math.random() * departments.length)],
      contact: Math.random() > 0.5 ? `student${index}@university.edu` : undefined,
    },
    complaintText: sampleComplaints[index % sampleComplaints.length],
    category,
    files: [],
    mlOutput: {
      category,
      priority,
      sentiment: 'negative',
      keywords: ['maintenance', 'urgent', 'issue'],
      flags: {
        urgent: priority === 'critical' || priority === 'high',
        safety: category === 'safety',
        duplicate: Math.random() > 0.9,
      },
      confidence: 0.75 + Math.random() * 0.2,
    },
    normalizedOutput: sampleComplaints[index % sampleComplaints.length],
    status,
    adminRemarks: status === 'resolved' ? 'Issue has been addressed and resolved.' : 
                  status === 'rejected' ? 'Duplicate complaint or insufficient details.' : undefined,
    auditLog: [
      {
        timestamp: createdDate.toISOString(),
        action: 'Complaint submitted',
        performedBy: 'System',
      },
      ...(status !== 'submitted' ? [{
        timestamp: new Date(createdDate.getTime() + 86400000).toISOString(),
        action: `Status changed to ${status}`,
        performedBy: 'Admin',
      }] : []),
    ],
    createdAt: createdDate.toISOString(),
    updatedAt: new Date(createdDate.getTime() + 86400000 * Math.floor(Math.random() * 5)).toISOString(),
  };
}

export const mockComplaints: Complaint[] = Array.from({ length: 25 }, (_, i) => generateMockComplaint(i));

export const mockAdmins: Admin[] = [
  { id: '1', name: 'Dr. Admin User', email: 'admin@university.edu', role: 'admin' },
  { id: '2', name: 'Staff Member', email: 'staff@university.edu', role: 'staff' },
];

export { generateComplaintId };
