import { Link } from 'react-router-dom';
import { Shield, FileText, Search, UserX, User, ArrowRight } from 'lucide-react';
import { PublicLayout } from '@/components/PublicLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="h-4 w-4" />
              Confidential & Secure
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              University Grievance Management System
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Submit your complaints securely and confidentially. You can choose to remain 
              anonymous or provide your identity for personalized follow-up. 
              <strong className="text-foreground"> No login required.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/track">
                <Button variant="outline" size="lg" className="gap-2">
                  <Search className="h-5 w-5" />
                  Track Complaint Status
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Submission Options */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Choose How to Submit</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Select the submission method that works best for you. Both options ensure your 
              complaint is reviewed with equal priority.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Anonymous Option */}
            <Card className="card-institutional hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserX className="h-8 w-8 text-accent" />
                </div>
                <CardTitle className="text-xl">Anonymous Complaint</CardTitle>
                <CardDescription className="text-base">
                  Submit without revealing your identity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">✓</span>
                    Complete privacy protection
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">✓</span>
                    No personal information required
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent mt-1">✓</span>
                    Track status using Complaint ID only
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground/60 mt-1">–</span>
                    <span className="text-muted-foreground/80">Cannot receive personalized updates</span>
                  </li>
                </ul>
                
                <Link to="/submit/anonymous" className="block">
                  <Button className="w-full gap-2" size="lg">
                    Submit Anonymously
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            {/* Identified Option */}
            <Card className="card-institutional hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Complaint With Identity</CardTitle>
                <CardDescription className="text-base">
                  Provide details for better follow-up
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    Personalized follow-up possible
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    Direct communication if needed
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    Track status using Complaint ID
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    Information kept confidential
                  </li>
                </ul>
                
                <Link to="/submit/identified" className="block">
                  <Button variant="outline" className="w-full gap-2" size="lg">
                    Submit With Identity
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">How It Works</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Submit Complaint</h3>
              <p className="text-sm text-muted-foreground">
                Describe your grievance and optionally attach supporting documents
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Get Complaint ID</h3>
              <p className="text-sm text-muted-foreground">
                Receive a unique tracking ID to monitor your complaint's progress
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Track Resolution</h3>
              <p className="text-sm text-muted-foreground">
                Check status anytime using your Complaint ID—no login needed
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trust Indicators */}
      <section className="py-12 bg-background border-t">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-accent" />
              End-to-end encrypted
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-accent" />
              All complaints reviewed within 48 hours
            </div>
            <div className="flex items-center gap-2">
              <UserX className="h-5 w-5 text-accent" />
              Anonymous submissions protected
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
