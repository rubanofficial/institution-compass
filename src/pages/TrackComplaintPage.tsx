import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader2, AlertCircle, Clock, CheckCircle, XCircle, FileSearch } from 'lucide-react';
import { PublicLayout } from '@/components/PublicLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StatusBadge } from '@/components/StatusBadge';
import { complaintService } from '@/services/complaintService';
import { TrackingResult, ComplaintStatus } from '@/types/complaint';

const statusIcons: Record<ComplaintStatus, React.ReactNode> = {
  submitted: <Clock className="h-8 w-8 text-info" />,
  in_review: <FileSearch className="h-8 w-8 text-warning" />,
  resolved: <CheckCircle className="h-8 w-8 text-success" />,
  rejected: <XCircle className="h-8 w-8 text-destructive" />,
};

const statusDescriptions: Record<ComplaintStatus, string> = {
  submitted: 'Your complaint has been received and is awaiting review.',
  in_review: 'Your complaint is currently being reviewed by our team.',
  resolved: 'Your complaint has been successfully resolved.',
  rejected: 'Your complaint could not be processed. See remarks for details.',
};

export default function TrackComplaintPage() {
  const [searchParams] = useSearchParams();
  const [complaintId, setComplaintId] = useState(searchParams.get('id') || '');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setComplaintId(id);
      handleSearch(id);
    }
  }, [searchParams]);
  
  const handleSearch = async (id?: string) => {
    const searchId = id || complaintId.trim();
    
    if (!searchId) {
      setError('Please enter a Complaint ID');
      return;
    }
    
    setIsSearching(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const trackingResult = await complaintService.trackComplaint(searchId);
      
      if (trackingResult) {
        setResult(trackingResult);
      } else {
        setResult(null);
        setError('No complaint found with this ID. Please check and try again.');
      }
    } catch (err) {
      setError('Failed to retrieve complaint status. Please try again.');
      setResult(null);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };
  
  return (
    <PublicLayout>
      <div className="py-12 bg-muted/30 min-h-[calc(100vh-200px)]">
        <div className="container mx-auto px-6 max-w-xl">
          {/* Search Form */}
          <Card className="card-institutional mb-8">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Track Complaint Status</CardTitle>
              <CardDescription>
                Enter your Complaint ID to check the current status
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="complaintId">Complaint ID</Label>
                  <Input
                    id="complaintId"
                    placeholder="e.g., GRV-ABC123-XYZ"
                    value={complaintId}
                    onChange={(e) => setComplaintId(e.target.value.toUpperCase())}
                    className="text-center font-mono text-lg"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Track Status
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {/* Error Message */}
          {error && hasSearched && (
            <Card className="card-institutional border-destructive/20 bg-destructive/5">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-destructive">
                  <AlertCircle className="h-6 w-6 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Complaint Not Found</p>
                    <p className="text-sm text-destructive/80">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Result Display */}
          {result && (
            <Card className="card-institutional">
              <CardHeader className="text-center border-b pb-6">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  {statusIcons[result.status]}
                </div>
                <div className="space-y-2">
                  <StatusBadge status={result.status} className="text-base px-4 py-1.5" />
                  <p className="text-sm text-muted-foreground">
                    {statusDescriptions[result.status]}
                  </p>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6 space-y-4">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Complaint ID</p>
                  <code className="text-lg font-mono font-bold text-primary">
                    {result.complaintId}
                  </code>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-sm text-muted-foreground">Last Updated</span>
                  <span className="text-sm font-medium">{formatDate(result.lastUpdated)}</span>
                </div>
                
                {result.adminRemarks && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Admin Remarks</h4>
                    <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground">
                      {result.adminRemarks}
                    </div>
                  </div>
                )}
                
                {/* Status Timeline */}
                <div className="pt-4">
                  <h4 className="text-sm font-medium mb-3">Status Timeline</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        ['submitted', 'in_review', 'resolved', 'rejected'].includes(result.status) 
                          ? 'bg-success' : 'bg-muted'
                      }`} />
                      <span className="text-sm">Submitted</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        ['in_review', 'resolved', 'rejected'].includes(result.status) 
                          ? 'bg-success' : 'bg-muted'
                      }`} />
                      <span className="text-sm">In Review</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        result.status === 'resolved' ? 'bg-success' : 
                        result.status === 'rejected' ? 'bg-destructive' : 'bg-muted'
                      }`} />
                      <span className="text-sm">
                        {result.status === 'rejected' ? 'Rejected' : 'Resolved'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
