import MatrixRain from '@/components/MatrixRain';
import Header from '@/components/Header';
import SurveillancePanel from '@/components/SurveillancePanel';

const Index = () => {
  return (
    <div className="min-h-screen bg-background scanlines animate-flicker">
      {/* Matrix rain background */}
      <MatrixRain />
      
      {/* Main content */}
      <div className="relative z-10">
        <Header />
        <main className="pb-12">
          <SurveillancePanel />
        </main>
      </div>
    </div>
  );
};

export default Index;
