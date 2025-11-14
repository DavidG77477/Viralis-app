import React, { useEffect, useMemo } from 'react';
import watermarkImage from '../attached_assets/viralis_watermark.png';

interface WatermarkOverlayProps {
  aspectRatio?: '9:16' | '16:9';
  opacity?: number;
  className?: string;
}

const KEYFRAMES_ID = 'viralis-watermark-keyframes';

const WatermarkOverlay: React.FC<WatermarkOverlayProps> = ({
  aspectRatio = '16:9',
  opacity = 0.38,
  className = '',
}) => {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    if (!document.getElementById(KEYFRAMES_ID)) {
      const styleEl = document.createElement('style');
      styleEl.id = KEYFRAMES_ID;
      styleEl.textContent = `@keyframes viralis-watermark-float {\n  0% { transform: translateY(0); }\n  100% { transform: translateY(-5px); }\n}`;
      document.head.appendChild(styleEl);
    }
  }, []);

  const positioning = useMemo(() => {
    if (aspectRatio === '9:16') {
      return {
        widthPercent: 14,
        marginPercent: 2.5,
      };
    }

    return {
      widthPercent: 11,
      marginPercent: 1.75,
    };
  }, [aspectRatio]);

  const style: React.CSSProperties = {
    position: 'absolute',
    right: `${positioning.marginPercent}%`,
    bottom: `${positioning.marginPercent}%`,
    width: `${positioning.widthPercent}%`,
    maxWidth: '160px',
    minWidth: '60px',
    opacity,
    pointerEvents: 'none',
    animation: 'viralis-watermark-float 2s ease-in-out infinite alternate',
    filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.4))',
    transition: 'opacity 0.3s ease-in-out',
    zIndex: 20,
    mixBlendMode: 'normal',
  };

  return (
    <img
      src={watermarkImage}
      alt="Viralis Studio watermark"
      style={style}
      className={`select-none ${className}`}
    />
  );
};

export default WatermarkOverlay;
