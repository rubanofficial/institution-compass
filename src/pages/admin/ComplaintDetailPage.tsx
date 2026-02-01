import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, UserX, User, AlertTriangle, Shield, 
  Clock, Loader2, Save, Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { StatusBadge, PriorityBadge } from '@/components/StatusBadge';
import { complaintService } from '@/services/complaintService';
import { authService } from '@/services/authService';
import { Complaint, ComplaintStatus } from '@/types/complaint';

const statusOptions: { value: ComplaintStatus; label: string }[] = [
  { value: 'submitted', label: 'Submitted' },
  { value: 'in_review', label: 'In Review' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'rejected', label: 'Rejected' },
];

export default function ComplaintDetailPage() {
  const { complaintId } = useParams<{ complaintId: string }>();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('submitted');
  const [remarks, setRemarks] = useState('');
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    if (complaintId) {
      loadComplaint();
    }
  }, [complaintId]);
  
  const loadComplaint = async () => {
    try {
      const data = await complaintService.getComplaint(complaintId!);
      if (data) {
        setComplaint(data);
        setNewStatus(data.status);
        setRemarks(data.adminRemarks || '');
      } else {
        navigate('/admin/complaints');
      }
    } catch (error) {
      console.error('Failed to load complaint:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSave = async () => {
    if (!complaint) return;
    
    setIsSaving(true);
    try {
      const admin = await authService.getCurrentAdmin();
      const success = await complaintService.updateComplaintStatus(
        complaint.complaintId,
        newStatus,
        remarks,
        admin?.name
      );
      
      if (success) {
        await loadComplaint();
      }
    } catch (error) {
      console.error('Failed to update:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCopy = async () => {
    if (complaint) {
      await navigator.clipboard.writeText(complaint.complaintId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (!complaint) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Complaint not found</p>
        <Link to="/admin/complaints">
          <Button variant="link">Back to list</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/admin/complaints">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold font-mono">{complaint.complaintId}</h1>
            <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2">
              <Copy className={`h-3.5 w-3.5 ${copied ? 'text-success' : ''}`} />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Submitted on {formatDate(complaint.createdAt)}
          </p>
        </div>
        <StatusBadge status={complaint.status} />
      </div>
      
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Complaint Text */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Complaint Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {complaint.category && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Category:</span>
                  <span className="capitalize font-medium">{complaint.category}</span>
                  {complaint.category === 'safety' && (
                    <Shield className="h-4 w-4 text-warning" />
                  )}
                </div>
              )}
              
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {complaint.complaintText}
                </p>
              </div>
              
              {complaint.files.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Attachments:</p>
                  <ul className="text-sm space-y-1">
                    {complaint.files.map((file, index) => (
                      <li key={index} className="text-primary hover:underline cursor-pointer">
                        {file}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Identity (if provided) */}
          {!complaint.isAnonymous && complaint.identity && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Complainant Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{complaint.identity.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Roll Number</p>
                    <p className="font-medium">{complaint.identity.rollNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium">{complaint.identity.department}</p>
                  </div>
                  {complaint.identity.contact && (
                    <div>
                      <p className="text-sm text-muted-foreground">Contact</p>
                      <p className="font-medium">{complaint.identity.contact}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
          
          {complaint.isAnonymous && (
            <Card className="bg-muted/30">
              <CardContent className="py-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <UserX className="h-5 w-5" />
                  <span className="text-sm">This is an anonymous complaint. No identity information available.</span>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* ML Output */}
          {complaint.mlOutput && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Priority</p>
                    <div className="flex items-center gap-2 mt-1">
                      {(complaint.mlOutput.priority === 'high' || complaint.mlOutput.priority === 'critical') && (
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      )}
                      <PriorityBadge priority={complaint.mlOutput.priority} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Confidence</p>
                    <p className="font-medium mt-1">
                      {Math.round(complaint.mlOutput.confidence * 100)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sentiment</p>
                    <p className="font-medium capitalize mt-1">{complaint.mlOutput.sentiment}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Flags</p>
                  <div className="flex flex-wrap gap-2">
                    {complaint.mlOutput.flags.urgent && (
                      <span className="px-2 py-1 bg-destructive/10 text-destructive text-xs rounded-full font-medium">
                        Urgent
                      </span>
                    )}
                    {complaint.mlOutput.flags.safety && (
                      <span className="px-2 py-1 bg-warning/10 text-warning text-xs rounded-full font-medium">
                        Safety Related
                      </span>
                    )}
                    {complaint.mlOutput.flags.duplicate && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full font-medium">
                        Possible Duplicate
                      </span>
                    )}
                    {!complaint.mlOutput.flags.urgent && !complaint.mlOutput.flags.safety && !complaint.mlOutput.flags.duplicate && (
                      <span className="text-sm text-muted-foreground">No special flags</span>
                    )}
                  </div>
                </div>
                
                {complaint.mlOutput.keywords.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {complaint.mlOutput.keywords.map((keyword, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Update */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={newStatus} onValueChange={(v) => setNewStatus(v as ComplaintStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((s) => (
                      <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Admin Remarks</Label>
                <Textarea
                  placeholder="Add notes or remarks..."
                  rows={4}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                />
              </div>
              
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="w-full gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
          
          {/* Audit Log */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Audit Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complaint.auditLog.map((entry, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="mt-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{entry.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {entry.performedBy} • {formatDate(entry.timestamp)}
                      </p>
                      {entry.details && (
                        <p className="text-xs text-muted-foreground mt-1">{entry.details}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
