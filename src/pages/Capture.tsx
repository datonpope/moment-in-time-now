import CameraCaptureRefactored from "@/components/CameraCaptureRefactored";
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
          <CameraCaptureRefactored />
        </div>
      </div>
    </>
  );
};

export default Capture;