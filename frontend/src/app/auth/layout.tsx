
import { Providers } from "@/components/Providers";
import LiquidEther from "@/components/LiquidEther";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('AuthLayout rendering'); // Debug log
  return (
    <Providers toasterPosition="bottom-center">
      <div className="relative min-h-screen">
        {/* LiquidEther Background */}
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          zIndex: 0, 
          pointerEvents: 'none',
          backgroundColor: '#FFFF' // เพิ่ม background color ชั่วคราวเพื่อให้เห็น
        }}>
          <LiquidEther
            colors={[ '#5227FF', '#FF9FFC', '#B19EEF' ]}
            mouseForce={25}
            cursorSize={120}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.6}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.7}
            autoIntensity={2.5}
            takeoverDuration={0.25}
            autoResumeDelay={2000}
            autoRampDuration={0.8}
          />
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </Providers>
  );
}