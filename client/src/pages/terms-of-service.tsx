import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card>
          <CardContent className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using MagicVidio ("Service"), a product of Scrypted Inc. ("Company", "we", "us", or "our"), 
                you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, 
                then you may not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                MagicVidio is an AI-powered content creation platform that enables users to generate, customize, and share 
                visual content including images, videos, and other digital media using our proprietary NAMI engine (patent pending).
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The Service includes recipe-based content generation, brand asset management, sample galleries, 
                and export functionality for created content.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts and Registration</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>To access certain features, you must create an account by providing accurate information.</p>
                <p>You are responsible for maintaining the confidentiality of your account credentials.</p>
                <p>You agree to notify us immediately of any unauthorized use of your account.</p>
                <p>We reserve the right to suspend or terminate accounts that violate these Terms.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use Policy</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p><strong>You agree NOT to use the Service to:</strong></p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Generate content that is illegal, harmful, threatening, abusive, defamatory, or obscene</li>
                  <li>Create deepfakes or misleading content of real people without consent</li>
                  <li>Infringe upon intellectual property rights of others</li>
                  <li>Generate content promoting violence, discrimination, or hate speech</li>
                  <li>Create sexually explicit or NSFW content involving minors</li>
                  <li>Attempt to reverse engineer or circumvent our security measures</li>
                  <li>Use the Service for spam, phishing, or other malicious activities</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Content and Intellectual Property</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p><strong>Your Content:</strong> You retain ownership of content you create using our Service, subject to our license to operate the Service.</p>
                <p><strong>Our Technology:</strong> The NAMI engine and underlying AI models are proprietary to Scrypted Inc. and protected by intellectual property laws.</p>
                <p><strong>Generated Content:</strong> AI-generated content may be similar to content created by other users. We cannot guarantee uniqueness.</p>
                <p><strong>Sample Gallery:</strong> By submitting content to our public gallery, you grant us a license to display and promote your content.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Credits and Payment</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>Content generation requires credits purchased through our platform.</p>
                <p>Credits are non-refundable and non-transferable unless required by law.</p>
                <p>Pricing may change with 30 days notice to existing users.</p>
                <p>Failed generations may result in credit refunds at our discretion.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Export and Download Rights</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>Premium exports require authentication and may have usage limitations.</p>
                <p>Downloaded content may include watermarks for free tier users.</p>
                <p>Commercial usage rights depend on your subscription level.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Privacy and Data Protection</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your privacy is important to us. Please review our Privacy Policy, which explains how we collect, 
                use, and protect your information when you use our Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Service Availability and Modifications</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>We strive to maintain high availability but cannot guarantee uninterrupted service.</p>
                <p>We may modify, suspend, or discontinue features with reasonable notice.</p>
                <p>Maintenance windows may temporarily limit service availability.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, SCRYPTED INC. SHALL NOT BE LIABLE for any indirect, 
                incidental, special, consequential, or punitive damages, including without limitation, loss of profits, 
                data, use, goodwill, or other intangible losses, resulting from your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed">
                You agree to indemnify and hold harmless Scrypted Inc. from any claims, damages, or expenses 
                arising from your use of the Service, violation of these Terms, or infringement of any third-party rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Termination</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>You may terminate your account at any time by contacting our support team.</p>
                <p>We may terminate or suspend your account for violations of these Terms.</p>
                <p>Upon termination, your right to use the Service ceases immediately.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction 
                where Scrypted Inc. is incorporated, without regard to conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">14. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify users of significant changes 
                via email or through the Service. Continued use after changes constitutes acceptance of new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">15. Contact Information</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p>For questions about these Terms of Service, please contact:</p>
                <p className="mt-2">
                  <strong>Scrypted Inc.</strong><br />
                  Email: legal@scrypted.com<br />
                  Subject: MagicVidio Terms of Service Inquiry
                </p>
              </div>
            </section>

            <section className="border-t pt-6">
              <p className="text-sm text-muted-foreground">
                By using MagicVidio, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}