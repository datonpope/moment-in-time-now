import CameraCapture from "@/components/CameraCapture";
import Navigation from "@/components/Navigation";

const Capture = () => {
  return (
    <div>
      <Navigation />
      <div className="pt-16">
        <CameraCapture />
      </div>
    </div>
  );
};

export default Capture;