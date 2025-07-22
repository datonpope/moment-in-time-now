
import MobileCaptureInterface from "@/components/MobileCaptureInterface";
import Navigation from "@/components/Navigation";
import { SEO } from "@/components/SEO";

const Capture = () => {
  return (
    <>
      <SEO 
        title="Capture Your Moment - Authentic Moments"
        description="Capture and share your authentic moment in 60 seconds. No filters, no edits, just real life."
      />
      <div>
        <Navigation />
        <div className="pt-16">
          <MobileCaptureInterface />
        </div>
      </div>
    </>
  );
};

export default Capture;
