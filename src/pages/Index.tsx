import Hero from "@/components/Hero";
import MomentsFeed from "@/components/MomentsFeed";
import BlueskyIntegration from "@/components/BlueskyIntegration";
import Navigation from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="pt-16">
        <Hero />
        <MomentsFeed />
        <BlueskyIntegration />
      </div>
    </div>
  );
};

export default Index;
