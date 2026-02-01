// Mock Complaint Service - Replace with actual API calls to Express backend

import { 
  Complaint, 
  ComplaintSubmission, 
  TrackingResult, 
  DashboardMetrics,
  ComplaintStatus,
  ComplaintCategory,
  ComplaintPriority
} from '@/types/complaint';
import { mockComplaints, generateComplaintId } from './mockData';

// Simulated database storage
let complaints: Complaint[] = [...mockComplaints];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate mock ML output (simulating external ML service response)
function generateMLOutput(text: string): Complaint['mlOutput'] {
  const categories: ComplaintCategory[] = [
    'academic', 'administrative', 'infrastructure', 'harassment', 
    'safety', 'financial', 'hostel', 'library', 'transport', 'other'
  ];
  
  // Simple keyword-based category detection (mock ML)
  let category: ComplaintCategory = 'other';
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('class') || lowerText.includes('exam') || lowerText.includes('grade')) {
    category = 'academic';
  } else if (lowerText.includes('hostel') || lowerText.includes('room') || lowerText.includes('warden')) {
    category = 'hostel';
  } else if (lowerText.includes('safety') || lowerText.includes('danger') || lowerText.includes('hazard')) {
    category = 'safety';
  } else if (lowerText.includes('library') || lowerText.includes('book')) {
    category = 'library';
  } else if (lowerText.includes('bus') || lowerText.includes('transport')) {
    category = 'transport';
  } else if (lowerText.includes('fee') || lowerText.includes('payment') || lowerText.includes('refund')) {
    category = 'financial';
  }
  
  // Simple priority detection
  let priority: ComplaintPriority = 'medium';
  if (lowerText.includes('urgent') || lowerText.includes('emergency') || lowerText.includes('critical')) {
    priority = 'critical';
  } else if (lowerText.includes('safety') || lowerText.includes('harassment')) {
    priority = 'high';
  }
  
  return {
    category,
    priority,
    sentiment: 'negative',
    keywords: text.split(' ').slice(0, 5).filter(w => w.length > 4),
    flags: {
      urgent: priority === 'critical' || priority === 'high',
      safety: category === 'safety',
      duplicate: false,
    },
    confidence: 0.75 + Math.random() * 0.2,
  };
}

export const complaintService = {
  // Submit a new complaint
  async submitComplaint(submission: ComplaintSubmission): Promise<{ complaintId: string; success: boolean }> {
    await delay(800);
    
    const complaintId = generateComplaintId();
    const mlOutput = generateMLOutput(submission.complaintText);
    
    const newComplaint: Complaint = {
      complaintId,
      isAnonymous: submission.isAnonymous,
      identity: submission.isAnonymous ? null : submission.identity || null,
      complaintText: submission.complaintText,
      category: submission.category || mlOutput.category,
      files: [], // In real app, upload files and store URLs
      mlOutput,
      normalizedOutput: submission.complaintText,
      status: 'submitted',
      auditLog: [
        {
          timestamp: new Date().toISOString(),
          action: 'Complaint submitted',
          performedBy: 'System',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    complaints.unshift(newComplaint);
    
    return { complaintId, success: true };
  },
  
  // Track complaint status
  async trackComplaint(complaintId: string): Promise<TrackingResult | null> {
    await delay(500);
    
    const complaint = complaints.find(c => c.complaintId.toLowerCase() === complaintId.toLowerCase());
    
    if (!complaint) {
      return null;
    }
    
    return {
      complaintId: complaint.complaintId,
      status: complaint.status,
      lastUpdated: complaint.updatedAt,
      adminRemarks: complaint.adminRemarks,
    };
  },
  
  // Get all complaints (admin only)
  async getAllComplaints(filters?: {
    status?: ComplaintStatus;
    category?: ComplaintCategory;
    priority?: ComplaintPriority;
    page?: number;
    limit?: number;
  }): Promise<{ complaints: Complaint[]; total: number }> {
    await delay(600);
    
    let filtered = [...complaints];
    
    if (filters?.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    if (filters?.category) {
      filtered = filtered.filter(c => c.category === filters.category);
    }
    if (filters?.priority) {
      filtered = filtered.filter(c => c.mlOutput?.priority === filters.priority);
    }
    
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const start = (page - 1) * limit;
    const paginated = filtered.slice(start, start + limit);
    
    return { complaints: paginated, total: filtered.length };
  },
  
  // Get single complaint (admin only)
  async getComplaint(complaintId: string): Promise<Complaint | null> {
    await delay(400);
    return complaints.find(c => c.complaintId === complaintId) || null;
  },
  
  // Update complaint status (admin only)
  async updateComplaintStatus(
    complaintId: string, 
    status: ComplaintStatus, 
    remarks?: string,
    adminName?: string
  ): Promise<boolean> {
    await delay(500);
    
    const index = complaints.findIndex(c => c.complaintId === complaintId);
    if (index === -1) return false;
    
    complaints[index] = {
      ...complaints[index],
      status,
      adminRemarks: remarks || complaints[index].adminRemarks,
      updatedAt: new Date().toISOString(),
      auditLog: [
        ...complaints[index].auditLog,
        {
          timestamp: new Date().toISOString(),
          action: `Status changed to ${status}`,
          performedBy: adminName || 'Admin',
          details: remarks,
        },
      ],
    };
    
    return true;
  },
  
  // Get dashboard metrics (admin only)
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    await delay(400);
    
    const statusBreakdown: Record<ComplaintStatus, number> = {
      submitted: 0,
      in_review: 0,
      resolved: 0,
      rejected: 0,
    };
    
    let highPriorityCount = 0;
    let safetyRelatedCount = 0;
    let anonymousCount = 0;
    let identifiedCount = 0;
    
    complaints.forEach(c => {
      statusBreakdown[c.status]++;
      if (c.mlOutput?.priority === 'high' || c.mlOutput?.priority === 'critical') {
        highPriorityCount++;
      }
      if (c.mlOutput?.flags.safety || c.category === 'safety') {
        safetyRelatedCount++;
      }
      if (c.isAnonymous) {
        anonymousCount++;
      } else {
        identifiedCount++;
      }
    });
    
    return {
      totalComplaints: complaints.length,
      highPriorityCount,
      safetyRelatedCount,
      anonymousCount,
      identifiedCount,
      statusBreakdown,
    };
  },
};
