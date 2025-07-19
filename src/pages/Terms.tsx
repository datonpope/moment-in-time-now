
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/Footer";
import Navigation from "@/components/Navigation";

const Terms = () => {
  return (
    <>
      <SEO 
        title="Terms of Service - Authentic Moments"
        description="Read the terms and conditions for using Authentic Moments platform."
      />
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 pt-16">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
            
            <div className="prose prose-lg max-w-none space-y-6">
              <p className="text-muted-foreground">
                Last updated: January 19, 2025
              </p>

              <section>
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using Authentic Moments, you accept and agree to be bound by the terms and provision of this agreement. These Terms of Service are operated by Authentic Moments Digital LLC.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                <p>
                  Authentic Moments is a platform that allows users to capture and share authentic, unfiltered moments with a 60-second time limit. Our service emphasizes genuine, real-time content without the ability to edit or filter.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
                <p>To use certain features of our service, you must:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Be at least 13 years old</li>
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">4. Content Guidelines</h2>
                <p>Users agree not to post content that:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violates any applicable law or regulation</li>
                  <li>Is harmful, threatening, or harassing</li>
                  <li>Infringes on intellectual property rights</li>
                  <li>Contains spam or unsolicited commercial content</li>
                  <li>Is false, misleading, or deceptive</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
                <p>
                  You retain ownership of content you create, but grant us a license to use, display, and distribute your content through our platform. Our platform and its original content are protected by copyright and other intellectual property laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">6. Termination</h2>
                <p>
                  We may terminate or suspend your account and access to the service at our sole discretion, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users or our business.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
                <p>
                  Authentic Moments Digital LLC shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
                <p>
                  Questions about these Terms of Service should be sent to us at{" "}
                  <a href="mailto:legal@authenticmoments.app" className="text-primary hover:underline">
                    legal@authenticmoments.app
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

export default Terms;
