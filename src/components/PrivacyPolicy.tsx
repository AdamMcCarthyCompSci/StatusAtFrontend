import { ArrowLeft, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SEO from '@/components/seo/SEO';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Privacy Policy"
        description="Status At Privacy Policy. Learn how we collect, use, and protect your personal information on our status tracking platform."
        url="https://statusat.com/privacy"
        keywords="privacy policy, data protection, GDPR, personal information, data security"
        type="article"
      />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link to="/home">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <h1 className="mb-2 text-4xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              StatusAt ("we," "our," or "us") is operated by Suber Oak Limited
              and is committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your
              information when you use our status tracking and customer
              communication platform.
            </p>
            <p>
              Please read this Privacy Policy carefully. If you do not agree
              with the terms of this Privacy Policy, please do not access the
              application.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl">Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold">
                Personal Information
              </h3>
              <p>
                We may collect personal information that you voluntarily provide
                to us when you:
              </p>
              <ul className="ml-4 mt-2 list-inside list-disc space-y-1">
                <li>Register for an account</li>
                <li>Create or manage flows and status updates</li>
                <li>Communicate with us via email or other channels</li>
                <li>Participate in surveys or feedback forms</li>
              </ul>
              <p className="mt-2">
                This information may include your name, email address, phone
                number, company information, and any other information you
                choose to provide.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">Usage Information</h3>
              <p>
                We automatically collect certain information about your use of
                our platform, including:
              </p>
              <ul className="ml-4 mt-2 list-inside list-disc space-y-1">
                <li>Device information and IP address</li>
                <li>Browser type and version</li>
                <li>Pages visited and time spent on our platform</li>
                <li>Features used and interactions with our services</li>
                <li>Log files and analytics data</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">Customer Data</h3>
              <p>
                When you use our platform to track customer statuses and send
                communications, we may process information about your customers,
                including their contact details and status information. This
                data is processed on your behalf as part of our services.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl">
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>We use the information we collect to:</p>
            <ul className="ml-4 list-inside list-disc space-y-1">
              <li>Provide, operate, and maintain our platform</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Improve our services and develop new features</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Detect, prevent, and address technical issues</li>
              <li>Comply with legal obligations</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl">
              Information Sharing and Disclosure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We do not sell, trade, or otherwise transfer your personal
              information to third parties without your consent, except in the
              following circumstances:
            </p>
            <ul className="ml-4 list-inside list-disc space-y-1">
              <li>
                <strong>Service Providers:</strong> We may share information
                with trusted third-party service providers who assist us in
                operating our platform
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose information
                when required by law or to protect our rights and safety
              </li>
              <li>
                <strong>Business Transfers:</strong> In the event of a merger,
                acquisition, or sale of assets, your information may be
                transferred
              </li>
              <li>
                <strong>Consent:</strong> We may share information with your
                explicit consent
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl">Data Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We implement appropriate technical and organizational security
              measures to protect your personal information against unauthorized
              access, alteration, disclosure, or destruction. However, no method
              of transmission over the internet or electronic storage is 100%
              secure.
            </p>
            <p>
              We use industry-standard encryption, secure servers, and regular
              security audits to safeguard your data. Access to personal
              information is restricted to authorized personnel only.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl">Your Rights and Choices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Depending on your location, you may have the following rights
              regarding your personal information:
            </p>
            <ul className="ml-4 list-inside list-disc space-y-1">
              <li>
                <strong>Access:</strong> Request access to your personal
                information
              </li>
              <li>
                <strong>Correction:</strong> Request correction of inaccurate or
                incomplete information
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your personal
                information
              </li>
              <li>
                <strong>Portability:</strong> Request a copy of your data in a
                portable format
              </li>
              <li>
                <strong>Objection:</strong> Object to certain processing of your
                information
              </li>
              <li>
                <strong>Withdrawal:</strong> Withdraw consent where processing
                is based on consent
              </li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information
              provided below.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl">Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We retain your personal information for as long as necessary to
              fulfill the purposes outlined in this Privacy Policy, unless a
              longer retention period is required or permitted by law. When we
              no longer need your information, we will securely delete or
              anonymize it.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl">
              Cookies and Tracking Technologies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We use cookies and similar tracking technologies to enhance your
              experience on our platform. These technologies help us understand
              how you use our services and improve functionality.
            </p>

            <div>
              <h3 className="mb-2 text-lg font-semibold">Google Analytics</h3>
              <p>
                We use Google Analytics 4, a web analytics service provided by
                Google LLC ("Google"), to analyze how users interact with our
                platform. Google Analytics uses cookies to collect information
                about your use of our website.
              </p>
              <p className="mt-2">
                <strong>Cookies set by Google Analytics:</strong>
              </p>
              <ul className="ml-4 mt-2 list-inside list-disc space-y-1">
                <li>
                  <strong>_ga:</strong> Used to distinguish unique visitors
                  (expires after 2 years)
                </li>
                <li>
                  <strong>_ga_*:</strong> Used to maintain session state
                  (expires after 2 years)
                </li>
                <li>
                  <strong>_gid:</strong> Used to distinguish users (expires
                  after 24 hours)
                </li>
              </ul>
              <p className="mt-2">
                <strong>Information collected includes:</strong>
              </p>
              <ul className="ml-4 mt-2 list-inside list-disc space-y-1">
                <li>Pages visited and time spent on each page</li>
                <li>How you arrived at our website (referral source)</li>
                <li>Your device type, browser, and operating system</li>
                <li>Your approximate location (city/country level)</li>
                <li>Interactions with buttons and features</li>
              </ul>
              <p className="mt-2">
                This information is used to improve our services, understand
                user behavior, and optimize our marketing efforts. Google
                Analytics data is processed in accordance with Google's Privacy
                Policy.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">
                Google Ads & Remarketing
              </h3>
              <p>
                We use Google Ads to promote our services through online
                advertising. When you accept cookies, we may collect information
                about your interactions with our website to:
              </p>
              <ul className="ml-4 mt-2 list-inside list-disc space-y-1">
                <li>
                  <strong>Measure ad campaign effectiveness:</strong> Track
                  which ads lead to visits and conversions
                </li>
                <li>
                  <strong>Remarketing:</strong> Show relevant ads to users who
                  have previously visited our website
                </li>
                <li>
                  <strong>Build custom audiences:</strong> Create targeted ad
                  audiences based on website behavior
                </li>
                <li>
                  <strong>Personalize advertising:</strong> Deliver more
                  relevant ads based on your interests
                </li>
              </ul>
              <p className="mt-2">
                <strong>Advertising cookies may include:</strong>
              </p>
              <ul className="ml-4 mt-2 list-inside list-disc space-y-1">
                <li>
                  <strong>_gcl_*:</strong> Google Click Identifier cookies for
                  ad click tracking
                </li>
                <li>
                  <strong>IDE, ANID:</strong> Used by Google DoubleClick for
                  remarketing
                </li>
              </ul>
              <p className="mt-2">
                You can opt out of personalized advertising by visiting{' '}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:no-underline"
                >
                  Google Ads Settings
                </a>{' '}
                or by declining cookies in our cookie consent banner.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">Cookie Consent</h3>
              <p>
                When you first visit our website, you will see a cookie consent
                banner. We only set analytics and advertising cookies after you
                explicitly accept them. You have the option to:
              </p>
              <ul className="ml-4 mt-2 list-inside list-disc space-y-1">
                <li>
                  <strong>Accept:</strong> Allow analytics and advertising
                  cookies to be set
                </li>
                <li>
                  <strong>Decline:</strong> Prevent analytics and advertising
                  cookies from being set
                </li>
              </ul>
              <p className="mt-2">
                Your choice is stored in a cookie named{' '}
                <code className="rounded bg-muted px-1 py-0.5">
                  statusat_cookie_consent
                </code>{' '}
                for 365 days. You can change your preference at any time by
                clearing your browser cookies and revisiting our site.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">Managing Cookies</h3>
              <p>You can control and manage cookies in several ways:</p>
              <ul className="ml-4 mt-2 list-inside list-disc space-y-1">
                <li>
                  <strong>Browser Settings:</strong> Most browsers allow you to
                  block or delete cookies through their settings
                </li>
                <li>
                  <strong>Opt-Out:</strong> You can opt out of Google Analytics
                  by installing the{' '}
                  <a
                    href="https://tools.google.com/dlpage/gaoptout"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:no-underline"
                  >
                    Google Analytics Opt-out Browser Add-on
                  </a>
                </li>
                <li>
                  <strong>Decline Consent:</strong> Click "Decline" on our
                  cookie consent banner to prevent analytics cookies
                </li>
              </ul>
              <p className="mt-2">
                Note: Disabling cookies may affect some functionality of our
                platform, though core features will remain accessible.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold">Essential Cookies</h3>
              <p>
                In addition to analytics cookies, we use essential cookies that
                are necessary for the platform to function properly, including:
              </p>
              <ul className="ml-4 mt-2 list-inside list-disc space-y-1">
                <li>Authentication cookies to keep you logged in</li>
                <li>Session cookies for security and fraud prevention</li>
                <li>Preference cookies to remember your language choice</li>
              </ul>
              <p className="mt-2">
                These essential cookies do not require consent as they are
                strictly necessary for the operation of our service.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl">
              International Data Transfers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Your information may be transferred to and processed in countries
              other than your own. We ensure that such transfers comply with
              applicable data protection laws and implement appropriate
              safeguards to protect your information.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl">Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Our platform is not intended for children under 13 years of age.
              We do not knowingly collect personal information from children
              under 13. If you are a parent or guardian and believe your child
              has provided us with personal information, please contact us.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl">
              Changes to This Privacy Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last updated" date.
            </p>
            <p>
              We encourage you to review this Privacy Policy periodically for
              any changes. Changes to this Privacy Policy are effective when
              they are posted on this page.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-2xl">Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you have any questions about this Privacy Policy or our privacy
              practices, please contact us:
            </p>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <a
                href="mailto:hello@statusat.com"
                className="text-primary hover:underline"
              >
                hello@statusat.com
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              Suber Oak Limited
              <br />
              StatusAt Platform
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
