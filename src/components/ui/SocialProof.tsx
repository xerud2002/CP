'use client';

import { useEffect, useState } from 'react';

const notifications = [
  { name: 'Maria', from: 'București', to: 'Londra', time: 'acum 2 minute' },
  { name: 'Andrei', from: 'Cluj', to: 'Berlin', time: 'acum 5 minute' },
  { name: 'Elena', from: 'Timișoara', to: 'Madrid', time: 'acum 8 minute' },
  { name: 'Ion', from: 'Iași', to: 'Paris', time: 'acum 12 minute' },
  { name: 'Ana', from: 'Brașov', to: 'Milano', time: 'acum 15 minute' },
  { name: 'Mihai', from: 'Constanța', to: 'Viena', time: 'acum 18 minute' },
  { name: 'Cristina', from: 'Sibiu', to: 'Amsterdam', time: 'acum 22 minute' },
  { name: 'Alexandru', from: 'Oradea', to: 'Bruxelles', time: 'acum 25 minute' },
];

export default function SocialProof() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Initial delay before showing first notification
    const initialDelay = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(initialDelay);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      // Start exit animation
      setIsExiting(true);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % notifications.length);
        setIsExiting(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [isVisible]);

  const notification = notifications[currentIndex];

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-24 left-6 z-40 transition-all duration-300 ${
        isExiting ? 'opacity-0 translate-x-[-20px]' : 'opacity-100 translate-x-0'
      }`}
    >
      <div className="bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl max-w-xs">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-green-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {notification.name.charAt(0)}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium">
              {notification.name} a trimis un colet
            </p>
            <p className="text-gray-400 text-xs mt-0.5">
              {notification.from} → {notification.to}
            </p>
            <p className="text-gray-500 text-xs mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              {notification.time}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-500 hover:text-gray-300 transition-colors p-1"
            aria-label="Închide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
