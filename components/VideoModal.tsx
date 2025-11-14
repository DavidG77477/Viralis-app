
import React from 'react';
import { XCircleIcon } from './icons/Icons';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, videoUrl }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[100] animate-fade-in" 
      onClick={onClose}
      style={{ animationDuration: '0.3s' }}
    >
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl aspect-video relative" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute -top-4 -right-4 text-slate-300 hover:text-white bg-slate-800 rounded-full z-10"
          aria-label="Close video player"
        >
          <XCircleIcon className="w-10 h-10" />
        </button>
        <video
          src={videoUrl}
          controls
          autoPlay
          loop
          className="w-full h-full rounded-2xl object-contain"
        >
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoModal;