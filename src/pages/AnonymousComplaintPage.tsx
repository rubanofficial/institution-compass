import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserX, Upload, AlertTriangle, Loader2 } from 'lucide-react';
import { PublicLayout } from '@/components/PublicLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { complaintService } from '@/services/complaintService';
import { ComplaintCategory } from '@/types/complaint';

const categories: { value: ComplaintCategory; label: string }[] = [
  { value: 'academic', label: 'Academic Issues' },
  { value: 'administrative', label: 'Administrative Issues' },
  { value: 'infrastructure', label: 'Infrastructure & Facilities' },
  { value: 'harassment', label: 'Harassment / Discrimination' },
  { value: 'safety', label: 'Safety Concerns' },
  { value: 'financial', label: 'Financial / Fee Issues' },
  { value: 'hostel', label: 'Hostel Related' },
  { value: 'library', label: 'Library Services' },
  { value: 'transport', label: 'Transport Services' },
  { value: 'other', label: 'Other' },
];

export default function AnonymousComplaintPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [formData, setFormData] = useState({
    category: '' as ComplaintCategory | '',
    complaintText: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.complaintText.trim()) {
      newErrors.complaintText = 'Please describe your complaint';
    } else if (formData.complaintText.trim().length < 20) {
      newErrors.complaintText = 'Please provide more details (at least 20 characters)';
    }
    
    if (!acknowledged) {
      newErrors.acknowledged = 'Please acknowledge the anonymous submission terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await complaintService.submitComplaint({
        isAnonymous: true,
        complaintText: formData.complaintText,
        category: formData.category || undefined,
        files,
      });
      
      if (result.success) {
        navigate(`/submitted/${result.complaintId}`);
      }
    } catch (error) {
      setErrors({ submit: 'Failed to submit complaint. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    // Limit to 5 files, max 10MB each
    const validFiles = selectedFiles.filter(f => f.size <= 10 * 1024 * 1024).slice(0, 5);
    setFiles(validFiles);
  };
  
  return (
    <PublicLayout>
      <div className="py-12 bg-muted/30 min-h-[calc(100vh-200px)]">
        <div className="container mx-auto px-6 max-w-2xl">
          <Card className="card-institutional">
            <CardHeader className="text-center border-b pb-6">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserX className="h-8 w-8 text-accent" />
              </div>
              <CardTitle className="text-2xl">Anonymous Complaint</CardTitle>
              <CardDescription className="text-base">
                Your identity will remain completely confidential
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Selection */}
                <div className="space-y-2">
                  <Label htmlFor="category">Complaint Category (Optional)</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value as ComplaintCategory })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Helps route your complaint to the right department
                  </p>
                </div>
                
                {/* Complaint Description */}
                <div className="space-y-2">
                  <Label htmlFor="complaintText">
                    Complaint Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="complaintText"
                    placeholder="Please describe your grievance in detail. Include relevant dates, locations, and any other information that would help us address your concern..."
                    rows={6}
                    value={formData.complaintText}
                    onChange={(e) => setFormData({ ...formData, complaintText: e.target.value })}
                    className={errors.complaintText ? 'border-destructive' : ''}
                  />
                  {errors.complaintText && (
                    <p className="text-sm text-destructive">{errors.complaintText}</p>
                  )}
                  <p className="text-xs text-muted-foreground text-right">
                    {formData.complaintText.length} characters
                  </p>
                </div>
                
                {/* File Upload */}
                <div className="space-y-2">
                  <Label>Supporting Documents (Optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-accent transition-colors">
                    <input
                      type="file"
                      id="files"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="files" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PDF, Images, Word documents (max 10MB each, up to 5 files)
                      </p>
                    </label>
                  </div>
                  {files.length > 0 && (
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {files.map((file, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="text-accent">✓</span>
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                {/* Anonymous Acknowledgment */}
                <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="acknowledged"
                      checked={acknowledged}
                      onCheckedChange={(checked) => setAcknowledged(checked as boolean)}
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor="acknowledged" className="text-sm font-medium cursor-pointer">
                        I understand this complaint is anonymous
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        As an anonymous submission, we cannot follow up with you personally. 
                        You can track your complaint status using the Complaint ID provided after submission.
                      </p>
                    </div>
                  </div>
                  {errors.acknowledged && (
                    <p className="text-sm text-destructive mt-2">{errors.acknowledged}</p>
                  )}
                </div>
                
                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    {errors.submit}
                  </div>
                )}
                
                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Anonymous Complaint'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
