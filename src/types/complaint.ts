// Complaint Types and Interfaces

export type ComplaintStatus = 'submitted' | 'in_review' | 'resolved' | 'rejected';

export type ComplaintPriority = 'low' | 'medium' | 'high' | 'critical';

export type ComplaintCategory = 
  | 'academic'
  | 'administrative'
  | 'infrastructure'
  | 'harassment'
  | 'safety'
  | 'financial'
  | 'hostel'
  | 'library'
  | 'transport'
  | 'other';

export interface Identity {
  fullName: string;
  rollNumber: string;
  department: string;
  contact?: string;
}

export interface MLOutput {
  category: ComplaintCategory;
  priority: ComplaintPriority;
  sentiment: 'negative' | 'neutral' | 'positive';
  keywords: string[];
  flags: {
    urgent: boolean;
    safety: boolean;
    duplicate: boolean;
  };
  confidence: number;
}

export interface AuditLogEntry {
  timestamp: string;
  action: string;
  performedBy: string;
  details?: string;
}

export interface Complaint {
  complaintId: string;
  isAnonymous: boolean;
  identity: Identity | null;
  complaintText: string;
  category?: ComplaintCategory;
  files: string[];
  mlOutput: MLOutput | null;
  normalizedOutput?: string;
  status: ComplaintStatus;
  adminRemarks?: string;
  auditLog: AuditLogEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'staff' | 'admin';
}

export interface ComplaintSubmission {
  isAnonymous: boolean;
  identity?: Identity;
  complaintText: string;
  category?: ComplaintCategory;
  files?: File[];
}

export interface TrackingResult {
  complaintId: string;
  status: ComplaintStatus;
  lastUpdated: string;
  adminRemarks?: string;
}

export interface DashboardMetrics {
  totalComplaints: number;
  highPriorityCount: number;
  safetyRelatedCount: number;
  anonymousCount: number;
  identifiedCount: number;
  statusBreakdown: Record<ComplaintStatus, number>;
}
