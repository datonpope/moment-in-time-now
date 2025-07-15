import Hero from "@/components/Hero";
import MomentsFeed from "@/components/MomentsFeed";
import BlueskyIntegration from "@/components/BlueskyIntegration";
import Navigation from "@/components/Navigation";
import { SEO } from "@/components/SEO";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <>
      <SEO />
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 pt-16">
          <Hero />
          <MomentsFeed />
          <BlueskyIntegration />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Index;
