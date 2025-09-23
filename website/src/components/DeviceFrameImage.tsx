// DeviceFrameImage.tsx
import React from 'react';

interface DeviceFrameImageProps {
  frameSrc?: string;
  children: React.ReactNode;
}

// Simplified image-based frame. The screen slot is positioned to fit the provided PNG.
export default function DeviceFrameImage({
  frameSrc =
    'https://static.vecteezy.com/system/resources/previews/042/538/623/non_2x/white-smartphone-mockup-blank-screen-isolated-on-transparent-background-smartphone-mockup-frame-free-png.png',
  children,
}: DeviceFrameImageProps) {
  return (
    <div className="relative mx-auto w-full max-w-[640px]">
      {/* Frame image */}
      {/* Using regular img to avoid Next/Image remote constraints inside nested component is fine for this decorative frame */}
      <img src={frameSrc} alt="iPhone frame" className="w-full h-auto block" />
      {/* Approximate screen slot overlay (tuned for this asset) */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-[36px] overflow-hidden"
        style={{
          top: '12%',
          width: '72%',
          height: '78%',
          boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.06)',
        }}
      >
        <div className="h-full w-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none]" style={{ WebkitOverflowScrolling: 'touch' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
