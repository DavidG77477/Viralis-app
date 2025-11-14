import React from 'react';

const DynamicBackground: React.FC = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-slate-950" />
      <div className="absolute -top-1/2 -left-1/4 w-[70vw] h-[70vw] bg-gradient-to-br from-emerald-400/40 via-sky-500/25 to-transparent rounded-full blur-[220px] animate-gradient-orbit" />
      <div className="absolute -bottom-[45%] right-[-25%] w-[80vw] h-[80vw] bg-gradient-to-tl from-sky-500/35 via-emerald-300/20 to-transparent rounded-full blur-[240px] animate-gradient-orbit-rev" />
      <div className="absolute top-1/2 left-1/2 w-[60vw] h-[60vw] bg-gradient-to-br from-emerald-500/25 via-sky-400/20 to-transparent rounded-full blur-[200px] animate-gradient-pulse" />
    </div>
  );
};

export default DynamicBackground;

