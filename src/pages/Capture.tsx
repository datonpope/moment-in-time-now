import CameraCaptureRefactored from "@/components/CameraCaptureRefactored";
import Navigation from "@/components/Navigation";

const Capture = () => {
  return (
    <div>
      <Navigation />
      <div className="pt-16">
        <CameraCaptureRefactored />
      </div>
    </div>
  );
};

export default Capture;