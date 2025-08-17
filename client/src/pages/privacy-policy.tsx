import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function PrivacyPolicy() {
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
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <Card>
          <CardContent className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Scrypted Inc. ("we," "us," or "our") operates MagicVidio, an AI-powered content creation platform. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you 
                use our Service. Please read this policy carefully to understand our practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
              
              <h3 className="text-lg font-medium mb-3">Personal Information</h3>
              <div className="text-muted-foreground leading-relaxed space-y-2 mb-4">
                <p>When you create an account, we collect:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Email address and name</li>
                  <li>Profile information you choose to provide</li>
                  <li>Authentication credentials (encrypted)</li>
                  <li>Payment information (processed securely through third-party providers)</li>
                </ul>
              </div>

              <h3 className="text-lg font-medium mb-3">Usage Data</h3>
              <div className="text-muted-foreground leading-relaxed space-y-2 mb-4">
                <p>We automatically collect:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>IP address and device information</li>
                  <li>Browser type and version</li>
                  <li>Pages visited and time spent on our Service</li>
                  <li>Generation requests and usage patterns</li>
                  <li>Error logs and performance data</li>
                </ul>
              </div>

              <h3 className="text-lg font-medium mb-3">Content Data</h3>
              <div className="text-muted-foreground leading-relaxed space-y-2">
                <p>We process and store:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Text prompts and generation requests</li>
                  <li>Generated images, videos, and other content</li>
                  <li>Brand assets you upload</li>
                  <li>Content metadata and tags</li>
                  <li>Gallery submissions and public content</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p><strong>Service Provision:</strong> To operate, maintain, and improve MagicVidio and our NAMI engine</p>
                <p><strong>Content Generation:</strong> To process your requests and generate AI-powered content</p>
                <p><strong>Account Management:</strong> To manage your account, process payments, and provide customer support</p>
                <p><strong>Communication:</strong> To send service-related notifications, updates, and marketing communications (with consent)</p>
                <p><strong>Analytics:</strong> To analyze usage patterns and improve our algorithms and user experience</p>
                <p><strong>Security:</strong> To detect fraud, prevent abuse, and ensure platform security</p>
                <p><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Information Sharing and Disclosure</h2>
              
              <h3 className="text-lg font-medium mb-3">We DO NOT sell your personal information.</h3>
              
              <h3 className="text-lg font-medium mb-3">We may share information with:</h3>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p><strong>Service Providers:</strong> Third-party vendors who assist with hosting, payment processing, analytics, and customer support</p>
                <p><strong>AI Model Providers:</strong> To process generation requests (data is anonymized where possible)</p>
                <p><strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights and safety</p>
                <p><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</p>
                <p><strong>Public Content:</strong> Content you submit to our public gallery is visible to other users</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Data Storage and Security</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p><strong>Encryption:</strong> We use industry-standard encryption for data in transit and at rest</p>
                <p><strong>Access Controls:</strong> Limited employee access to personal data on a need-to-know basis</p>
                <p><strong>Infrastructure:</strong> We use secure cloud providers with SOC 2 compliance</p>
                <p><strong>Monitoring:</strong> Continuous monitoring for security threats and vulnerabilities</p>
                <p><strong>Data Retention:</strong> We retain data only as long as necessary for service provision and legal requirements</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Content and AI Training</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p><strong>Content Processing:</strong> Your prompts and generated content may be processed to improve our NAMI engine</p>
                <p><strong>Model Training:</strong> Aggregated and anonymized data may be used to enhance AI model performance</p>
                <p><strong>Opt-out Options:</strong> Premium users can opt-out of data usage for model training</p>
                <p><strong>Public Gallery:</strong> Content submitted to public galleries may be used for promotional purposes</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Your Privacy Rights</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p><strong>Access:</strong> Request access to your personal information</p>
                <p><strong>Correction:</strong> Update or correct inaccurate information</p>
                <p><strong>Deletion:</strong> Request deletion of your account and associated data</p>
                <p><strong>Portability:</strong> Export your content and data in standard formats</p>
                <p><strong>Opt-out:</strong> Unsubscribe from marketing communications</p>
                <p><strong>Restriction:</strong> Limit how we process your information</p>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise these rights, contact us at privacy@scrypted.com
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Cookies and Tracking</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p><strong>Essential Cookies:</strong> Required for authentication and basic functionality</p>
                <p><strong>Analytics Cookies:</strong> Help us understand usage patterns and improve our Service</p>
                <p><strong>Preference Cookies:</strong> Remember your settings and customizations</p>
                <p><strong>Third-party Tracking:</strong> We may use analytics services like Google Analytics</p>
                <p>You can control cookie preferences through your browser settings.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. 
                We ensure appropriate safeguards are in place through standard contractual clauses 
                and adequacy decisions where applicable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our Service is not intended for children under 13. We do not knowingly collect personal 
                information from children under 13. If we discover such collection, we will delete the 
                information immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. California Privacy Rights (CCPA)</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>California residents have additional rights under the CCPA:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Right to know what personal information is collected</li>
                  <li>Right to delete personal information</li>
                  <li>Right to opt-out of sale (we don't sell personal information)</li>
                  <li>Right to non-discrimination for exercising privacy rights</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. European Privacy Rights (GDPR)</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>If you are in the European Economic Area, you have rights under GDPR including:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Legal basis for processing (legitimate interest, consent, or contract)</li>
                  <li>Right to withdraw consent at any time</li>
                  <li>Right to lodge complaints with supervisory authorities</li>
                  <li>Data Protection Officer contact: dpo@scrypted.com</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Data Breach Notification</h2>
              <p className="text-muted-foreground leading-relaxed">
                In the event of a data breach that may affect your personal information, we will notify 
                affected users within 72 hours and provide details about the incident and steps we're taking to address it.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">14. Third-Party Services</h2>
              <div className="text-muted-foreground leading-relaxed space-y-3">
                <p>Our Service integrates with third-party services:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Payment processors (Stripe)</li>
                  <li>Authentication providers (Google, social logins)</li>
                  <li>Cloud storage and CDN services</li>
                  <li>Analytics and monitoring tools</li>
                </ul>
                <p>These services have their own privacy policies governing their use of your information.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">15. Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy periodically. We will notify you of significant changes 
                via email or through our Service. The "Last Updated" date at the top indicates when 
                the policy was last revised.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">16. Contact Us</h2>
              <div className="text-muted-foreground leading-relaxed">
                <p>For privacy-related questions or requests, contact us:</p>
                <div className="mt-4 space-y-2">
                  <p><strong>Email:</strong> privacy@scrypted.com</p>
                  <p><strong>Data Protection Officer:</strong> dpo@scrypted.com</p>
                  <p><strong>Mailing Address:</strong></p>
                  <p className="pl-4">
                    Scrypted Inc.<br />
                    Privacy Department<br />
                    [Address to be provided]
                  </p>
                </div>
              </div>
            </section>

            <section className="border-t pt-6">
              <p className="text-sm text-muted-foreground">
                By using MagicVidio, you acknowledge that you have read and understood this Privacy Policy 
                and consent to the collection and use of your information as described herein.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}