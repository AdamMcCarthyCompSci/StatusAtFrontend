import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link to="/home">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Agreement to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              These Terms of Service ("Terms") govern your use of StatusAt, a status tracking and 
              customer communication platform operated by Suber Oak Limited ("Company," "we," "our," or "us").
            </p>
            <p>
              By accessing or using our platform, you agree to be bound by these Terms. If you disagree 
              with any part of these terms, then you may not access the platform.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl">Description of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              StatusAt provides a platform that allows businesses to:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Create and manage customer status tracking flows</li>
              <li>Send automated communications to customers</li>
              <li>Track and monitor customer interactions</li>
              <li>Organize and manage customer data</li>
              <li>Generate reports and analytics</li>
            </ul>
            <p>
              We reserve the right to modify, suspend, or discontinue any part of our service 
              at any time with or without notice.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl">User Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              To access certain features of our platform, you must create an account. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>
            <p>
              We reserve the right to refuse service, terminate accounts, or remove content 
              at our sole discretion.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl">Acceptable Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>You agree not to use our platform to:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful or malicious code</li>
              <li>Spam or send unsolicited communications</li>
              <li>Impersonate any person or entity</li>
              <li>Interfere with the platform's operation</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use the platform for any illegal or unauthorized purpose</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl">Content and Data</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Content</h3>
              <p>
                You retain ownership of all content and data you upload to our platform. 
                By using our service, you grant us a limited license to use, store, and process 
                your content solely for the purpose of providing our services.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Customer Data</h3>
              <p>
                When you use our platform to communicate with customers, you are responsible for 
                ensuring you have proper consent and authorization to process their personal information. 
                You must comply with all applicable data protection laws.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Our Content</h3>
              <p>
                The platform, including its design, functionality, and content, is owned by us 
                and protected by intellectual property laws. You may not copy, modify, or distribute 
                our proprietary content without permission.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl">Payment Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you subscribe to a paid plan, you agree to pay all fees associated with your subscription. 
              Payment terms include:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Fees are billed in advance on a recurring basis</li>
              <li>All fees are non-refundable unless otherwise stated</li>
              <li>We may change pricing with 30 days' notice</li>
              <li>Failure to pay may result in service suspension</li>
              <li>You are responsible for all applicable taxes</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl">Privacy and Data Protection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Your privacy is important to us. Our collection and use of personal information 
              is governed by our Privacy Policy, which is incorporated into these Terms by reference.
            </p>
            <p>
              We implement appropriate security measures to protect your data, but you acknowledge 
              that no system is completely secure and we cannot guarantee absolute security.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl">Service Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We strive to maintain high service availability, but we do not guarantee uninterrupted 
              access to our platform. We may experience downtime for maintenance, updates, or 
              technical issues.
            </p>
            <p>
              We are not liable for any loss or damage resulting from service interruptions, 
              delays, or failures.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl">Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              To the maximum extent permitted by law, we shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages, including but not limited to:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Loss of profits, data, or business opportunities</li>
              <li>Service interruptions or failures</li>
              <li>Third-party actions or content</li>
              <li>Any damages arising from your use of the platform</li>
            </ul>
            <p>
              Our total liability shall not exceed the amount you paid us in the 12 months 
              preceding the claim.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl">Indemnification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              You agree to indemnify and hold harmless Suber Oak Limited and its officers, 
              directors, employees, and agents from any claims, damages, or expenses arising from:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Your use of the platform</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Any content you submit or transmit through the platform</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl">Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Either party may terminate this agreement at any time. Upon termination:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Your right to use the platform ceases immediately</li>
              <li>We may delete your account and data</li>
              <li>You remain liable for any outstanding fees</li>
              <li>Provisions that should survive termination will remain in effect</li>
            </ul>
            <p>
              We may suspend or terminate your account immediately if you violate these Terms 
              or engage in fraudulent or illegal activities.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl">Governing Law</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              These Terms shall be governed by and construed in accordance with the laws of 
              the jurisdiction where Suber Oak Limited is incorporated, without regard to 
              conflict of law principles.
            </p>
            <p>
              Any disputes arising from these Terms or your use of the platform shall be 
              resolved through binding arbitration or in the courts of competent jurisdiction.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl">Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We reserve the right to modify these Terms at any time. We will notify users 
              of material changes by email or through the platform. Your continued use of 
              the platform after changes constitutes acceptance of the new Terms.
            </p>
            <p>
              If you do not agree to the modified Terms, you must stop using the platform 
              and may terminate your account.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl">Miscellaneous</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Entire Agreement:</strong> These Terms constitute the entire agreement between you and us</li>
              <li><strong>Severability:</strong> If any provision is deemed invalid, the remaining provisions remain in effect</li>
              <li><strong>Waiver:</strong> Our failure to enforce any provision does not constitute a waiver</li>
              <li><strong>Assignment:</strong> You may not assign these Terms without our consent</li>
              <li><strong>Force Majeure:</strong> We are not liable for delays due to circumstances beyond our control</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <a href="mailto:hello@statusat.com" className="text-primary hover:underline">
                hello@statusat.com
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              Suber Oak Limited<br />
              StatusAt Platform
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
