import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Upload, AlertTriangle, Loader2 } from 'lucide-react';
import { PublicLayout } from '@/components/PublicLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { complaintService } from '@/services/complaintService';
import { ComplaintCategory, Identity } from '@/types/complaint';

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

const departments = [
  'Computer Science & Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electronics & Communication',
  'Information Technology',
  'Business Administration',
  'Arts & Humanities',
  'Science & Mathematics',
  'Other',
];

export default function IdentifiedComplaintPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    rollNumber: '',
    department: '',
    contact: '',
    category: '' as ComplaintCategory | '',
    complaintText: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = 'Roll number is required';
    }
    
    if (!formData.department) {
      newErrors.department = 'Please select your department';
    }
    
    if (!formData.complaintText.trim()) {
      newErrors.complaintText = 'Please describe your complaint';
    } else if (formData.complaintText.trim().length < 20) {
      newErrors.complaintText = 'Please provide more details (at least 20 characters)';
    }
    
    // Optional email/phone validation
    if (formData.contact.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[+]?[\d\s-]{10,}$/;
      if (!emailRegex.test(formData.contact) && !phoneRegex.test(formData.contact)) {
        newErrors.contact = 'Please enter a valid email or phone number';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const identity: Identity = {
        fullName: formData.fullName.trim(),
        rollNumber: formData.rollNumber.trim(),
        department: formData.department,
        contact: formData.contact.trim() || undefined,
      };
      
      const result = await complaintService.submitComplaint({
        isAnonymous: false,
        identity,
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
    const validFiles = selectedFiles.filter(f => f.size <= 10 * 1024 * 1024).slice(0, 5);
    setFiles(validFiles);
  };
  
  return (
    <PublicLayout>
      <div className="py-12 bg-muted/30 min-h-[calc(100vh-200px)]">
        <div className="container mx-auto px-6 max-w-2xl">
          <Card className="card-institutional">
            <CardHeader className="text-center border-b pb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Complaint With Identity</CardTitle>
              <CardDescription className="text-base">
                Provide your details for personalized follow-up
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Identity Fields */}
                <div className="bg-muted/50 rounded-lg p-4 space-y-4">
                  <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                    Your Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">
                        Full Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={errors.fullName ? 'border-destructive' : ''}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-destructive">{errors.fullName}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="rollNumber">
                        Roll Number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="rollNumber"
                        placeholder="e.g., 2024CS1001"
                        value={formData.rollNumber}
                        onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                        className={errors.rollNumber ? 'border-destructive' : ''}
                      />
                      {errors.rollNumber && (
                        <p className="text-sm text-destructive">{errors.rollNumber}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="department">
                      Department <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData({ ...formData, department: value })}
                    >
                      <SelectTrigger className={errors.department ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select your department..." />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.department && (
                      <p className="text-sm text-destructive">{errors.department}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="contact">Contact (Email or Phone) - Optional</Label>
                    <Input
                      id="contact"
                      placeholder="email@university.edu or +91 9876543210"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className={errors.contact ? 'border-destructive' : ''}
                    />
                    {errors.contact && (
                      <p className="text-sm text-destructive">{errors.contact}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      We may contact you if additional information is needed
                    </p>
                  </div>
                </div>
                
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
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors">
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
                          <span className="text-primary">✓</span>
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                {/* Confidentiality Notice */}
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 text-sm text-muted-foreground">
                  <strong className="text-foreground">Confidentiality Notice:</strong> Your personal 
                  information will be kept strictly confidential and will only be used for complaint 
                  resolution purposes.
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
                    'Submit Complaint'
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
