import React from 'react';
import { Volume2 } from 'lucide-react';

interface SpeakerButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string; // Optional text label next to icon
}

export const SpeakerButton: React.FC<SpeakerButtonProps> = ({ 
  text, 
  size = 'md', 
  className = "",
  label
}) => {
  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering parent elements (like card clicks)
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Set to English
    utterance.rate = 0.9; // Slightly slower than default for better clarity
    utterance.pitch = 1;
    
    window.speechSynthesis.speak(utterance);
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <button
      onClick={handleSpeak}
      className={`inline-flex items-center gap-2 rounded-full hover:bg-indigo-50 text-indigo-600 transition-colors p-2 ${className}`}
      title="Listen to pronunciation"
      type="button"
    >
      <Volume2 className={iconSizes[size]} />
      {label && <span className="font-medium text-sm">{label}</span>}
    </button>
  );
};