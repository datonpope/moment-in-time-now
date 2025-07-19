
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import Navigation from "@/components/Navigation";

const Privacy = () => {
  return (
    <>
      <SEO 
        title="Privacy Policy - Authentic Moments"
        description="Learn about how Authentic Moments collects, uses, and protects your personal information."
      />
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 pt-16">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
            
            <div className="prose prose-lg max-w-none space-y-6">
              <p className="text-muted-foreground">
                Last updated: January 19, 2025
              </p>

              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
                <p>
                  At Authentic Moments Digital LLC, we collect information you provide directly to us, such as when you create an account, capture moments, or contact us for support.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Account information (email address, display name)</li>
                  <li>Content you create (photos, videos, captions)</li>
                  <li>Usage data and analytics</li>
                  <li>Device information and technical data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide and maintain our services</li>
                  <li>Enable you to share authentic moments</li>
                  <li>Improve our app and user experience</li>
                  <li>Communicate with you about updates and support</li>
                  <li>Ensure platform safety and security</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share information with:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Service providers who assist in operating our platform</li>
                  <li>Legal authorities when required by law</li>
                  <li>Other users when you choose to share content publicly</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Delete your account and data</li>
                  <li>Export your data</li>
                  <li>Opt out of certain communications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
                <p>
                  If you have questions about this Privacy Policy, please contact us at{" "}
                  <a href="mailto:privacy@authenticmoments.app" className="text-primary hover:underline">
                    privacy@authenticmoments.app
                  </a>
                </p>
              </section>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Privacy;
