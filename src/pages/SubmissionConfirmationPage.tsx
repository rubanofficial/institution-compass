import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Copy, Search } from 'lucide-react';
import { PublicLayout } from '@/components/PublicLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';

export default function SubmissionConfirmationPage() {
  const { complaintId } = useParams<{ complaintId: string }>();
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    if (complaintId) {
      await navigator.clipboard.writeText(complaintId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  return (
    <PublicLayout>
      <div className="py-16 bg-muted/30 min-h-[calc(100vh-200px)]">
        <div className="container mx-auto px-6 max-w-xl">
          <Card className="card-institutional text-center">
            <CardHeader className="pb-4">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-success" />
              </div>
              <CardTitle className="text-2xl text-success">
                Complaint Submitted Successfully
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                Your complaint has been received and will be reviewed by our team. 
                Use the Complaint ID below to track the status of your submission.
              </p>
              
              {/* Complaint ID Display */}
              <div className="bg-muted rounded-lg p-6">
                <p className="text-sm text-muted-foreground mb-2">Your Complaint ID</p>
                <div className="flex items-center justify-center gap-3">
                  <code className="text-2xl font-mono font-bold text-primary">
                    {complaintId}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-8 w-8 p-0"
                  >
                    <Copy className={`h-4 w-4 ${copied ? 'text-success' : ''}`} />
                  </Button>
                </div>
                {copied && (
                  <p className="text-xs text-success mt-2">Copied to clipboard!</p>
                )}
              </div>
              
              {/* Warning */}
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 text-left">
                <p className="text-sm text-warning font-medium mb-1">
                  ⚠️ Important: Save This ID
                </p>
                <p className="text-xs text-muted-foreground">
                  This Complaint ID is the only way to track your submission. 
                  Please save it securely. We cannot retrieve it later.
                </p>
              </div>
              
              {/* Next Steps */}
              <div className="text-left bg-muted/50 rounded-lg p-4">
                <h3 className="font-medium mb-2">What happens next?</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">1.</span>
                    Your complaint will be reviewed within 48 hours
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">2.</span>
                    It will be assigned to the appropriate department
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">3.</span>
                    Track status anytime using your Complaint ID
                  </li>
                </ul>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to={`/track?id=${complaintId}`} className="flex-1">
                  <Button className="w-full gap-2">
                    <Search className="h-4 w-4" />
                    Track Status
                  </Button>
                </Link>
                <Link to="/" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Return Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
