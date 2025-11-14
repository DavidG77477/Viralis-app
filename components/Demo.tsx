import React, { useState, useRef } from 'react';
import { PlayIcon } from './icons/Icons';
import VideoModal from './VideoModal';
import type { Language } from '../App';
import { translations } from '../translations';

const secondaryVideos = [
  {
    video: '/videos/interview.mp4',
    caption: "Podcast AI Edition",
    placeholder:
      "https://images.unsplash.com/photo-1517404215738-15263e9f9178?q=80&w=800",
  },
  {
    video: '/videos/story_telling.mp4',
    caption: "Storytelling Mode",
    placeholder:
      "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?q=80&w=800",
  },
  {
    video: '/videos/ad.mp4',
    caption: "Product Ad",
    placeholder:
      "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=800",
  },
];

const featuredVideoUrl = '/videos/un_cafe-con_leche.mp4';

const showFirstFrame = (videoElement: HTMLVideoElement) => {
  const seekToFirstFrame = () => {
    try {
      videoElement.pause();
      videoElement.currentTime = 0.05;
    } catch (error) {
      console.warn('Unable to set preview frame:', error);
    } finally {
      videoElement.removeEventListener('seeked', seekToFirstFrame);
    }
  };

  if (videoElement.readyState >= 2) {
    seekToFirstFrame();
  } else {
    const handleLoadedMetadata = () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.addEventListener('seeked', seekToFirstFrame);
      try {
        videoElement.currentTime = 0.05;
      } catch (error) {
        console.warn('Unable to seek video preview:', error);
      }
    };
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
  }
};

const DemoCard: React.FC<(typeof secondaryVideos)[number]> = ({
  video,
  caption,
  placeholder,
}) => (
  <div className="relative rounded-3xl overflow-hidden group cursor-pointer animate-fade-in-up border-2 border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl hover:border-[#00ff9d]/60 transition-all duration-700 hover:scale-[1.03] hover:shadow-[0_12px_48px_rgba(0,255,153,0.3)] hover:-translate-y-2">
    {/* Animated gradient border glow */}
    <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00ff9d]/0 via-[#00b3ff]/0 to-[#00ff9d]/0 group-hover:from-[#00ff9d]/40 group-hover:via-[#00b3ff]/40 group-hover:to-[#00ff9d]/40 rounded-3xl blur-md transition-all duration-700 opacity-0 group-hover:opacity-100 -z-10"></div>
    
    {/* Gradient overlay on hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#00ff9d]/0 to-[#00b3ff]/0 group-hover:from-[#00ff9d]/15 group-hover:to-[#00b3ff]/15 transition-all duration-700 pointer-events-none z-10 rounded-3xl"></div>
    
    {/* Shine effect */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-10 rounded-3xl"></div>
    
    {video ? (
      <video
        src={video}
        muted
        playsInline
        preload="auto"
        onLoadedMetadata={(event) => showFirstFrame(event.currentTarget)}
        className="w-full h-full object-cover aspect-[9/16] transition-transform duration-700 group-hover:scale-110"
      />
    ) : (
      <img
        src={placeholder}
        alt={caption}
        className="w-full h-full object-cover aspect-[9/16] transition-transform duration-700 group-hover:scale-110"
      />
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-40 group-hover:opacity-80 transition-opacity duration-500"></div>
    
    {/* Play button overlay */}
    <div className="absolute inset-0 flex items-center justify-center opacity-100 transition-all duration-500 transform group-hover:scale-105 z-20 pointer-events-none">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] rounded-full blur-xl opacity-40 animate-pulse"></div>
        <div className="relative bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] rounded-full p-5 shadow-[0_0_40px_rgba(0,255,153,0.5)]">
          <PlayIcon className="w-12 h-12 text-slate-950 relative z-10" />
        </div>
      </div>
    </div>
    
    {/* Caption with improved styling */}
    <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-1 w-8 bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] rounded-full group-hover:w-12 transition-all duration-300"></div>
        <span className="text-[#00ff9d] text-xs font-bold uppercase tracking-wider">Viral</span>
      </div>
      <p className="text-white font-bold text-xl mb-2 group-hover:text-[#00ff9d] transition-colors duration-300 drop-shadow-lg">
        {caption}
      </p>
    </div>
  </div>
);

const Demo: React.FC<{ language: Language }> = ({ language }) => {
    const t = translations[language];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const featuredVideoRef = useRef<HTMLVideoElement | null>(null);

    const handlePlayVideo = (url: string) => {
        setVideoUrl(url);
        setIsModalOpen(true);
    };

  return (
    <>
    <section className="py-24 px-4 md:px-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-bl from-[#00ff9d]/10 to-transparent rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
      <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-tr from-[#00b3ff]/10 to-transparent rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
      
      <div className="container mx-auto text-center relative z-10">
        <div className="mb-8">
          <h2 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-4 relative inline-block" style={{background: 'linear-gradient(90deg, #00ff9d, #00b3ff)', WebkitBackgroundClip: 'text', color: 'transparent'}}>
            {t.demoTitle}
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#00ff9d] via-[#00b3ff] to-[#00ff9d] rounded-full opacity-50"></div>
          </h2>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t.demoSubtitle}
          </p>
        </div>

        {/* Featured Video */}
        <div className="max-w-6xl mx-auto mb-24 relative">
          {/* Enhanced Background Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-[#00ff9d]/30 via-[#00b3ff]/30 to-[#00ff9d]/30 rounded-3xl blur-3xl opacity-60 group-hover:opacity-90 transition-opacity duration-700 animate-pulse"></div>
          <div className="absolute -inset-2 bg-gradient-to-r from-[#00ff9d]/20 via-[#00b3ff]/20 to-[#00ff9d]/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
          
          <div
            onClick={() => handlePlayVideo(featuredVideoUrl)}
            className="relative rounded-3xl overflow-hidden group cursor-pointer animate-fade-in-up border-2 border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl hover:border-[#00ff9d]/60 transition-all duration-700 hover:shadow-[0_16px_64px_rgba(0,255,153,0.4)] hover:-translate-y-1"
          >
            {/* Animated gradient border */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00ff9d]/0 via-[#00b3ff]/0 to-[#00ff9d]/0 group-hover:from-[#00ff9d]/50 group-hover:via-[#00b3ff]/50 group-hover:to-[#00ff9d]/50 rounded-3xl blur-lg transition-all duration-700 opacity-0 group-hover:opacity-100 -z-10"></div>
            
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00ff9d]/0 to-[#00b3ff]/0 group-hover:from-[#00ff9d]/15 group-hover:to-[#00b3ff]/15 transition-all duration-700 pointer-events-none z-10 rounded-3xl"></div>
            
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 z-10 rounded-3xl"></div>
            
            <video
              ref={featuredVideoRef}
              src={featuredVideoUrl}
              muted
              playsInline
              preload="auto"
              onLoadedMetadata={(event) => showFirstFrame(event.currentTarget)}
              className="w-full h-full object-cover aspect-video transition-transform duration-700 group-hover:scale-[1.02] relative z-0"
            />
            
            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent opacity-40 group-hover:opacity-90 transition-opacity duration-500 z-10"></div>
            
            {/* Enhanced Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-100 transition-all duration-500 group-hover:scale-105 z-20 pointer-events-none">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] rounded-full blur-2xl opacity-40 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-[#00ff9d] to-[#00b3ff] rounded-full p-8 shadow-[0_0_60px_rgba(0,255,153,0.6)]">
                  <PlayIcon className="w-16 h-16 text-slate-950 relative z-10" />
                </div>
              </div>
            </div>
            
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {secondaryVideos.map((video, index) => (
            <div 
              key={index} 
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div onClick={() => video.video && handlePlayVideo(video.video)}>
                <DemoCard {...video} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    <VideoModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoUrl={videoUrl}
    />
    </>
  );
};

export default Demo;