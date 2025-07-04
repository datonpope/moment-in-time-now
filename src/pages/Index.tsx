import Hero from "@/components/Hero";
import CameraInterface from "@/components/CameraInterface";
import FeedPreview from "@/components/FeedPreview";
import BlueskyIntegration from "@/components/BlueskyIntegration";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <CameraInterface />
      <FeedPreview />
      <BlueskyIntegration />
    </div>
  );
};

export default Index;
