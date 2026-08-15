import React from 'react';
import { Compass, HelpCircle } from 'lucide-react';

export interface MobileQuickBarProps {
  currentView: 'home' | 'results' | 'detail';
  onNavigateHome: () => void;
  onOpenHowItWorks: () => void;
}

export const MobileQuickBar: React.FC<MobileQuickBarProps> = ({
  currentView,
  onNavigateHome,
  onOpenHowItWorks,
}) => {
  return (
    <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-6 py-2 shadow-lg">
      <div className="flex items-center justify-around max-w-xs mx-auto">
        {/* Explore / Home */}
        <button
          id="mobile-nav-home-btn"
          onClick={onNavigateHome}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-colors cursor-pointer ${
            currentView === 'home' || currentView === 'results' ? 'text-teal-700 font-bold' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[11px]">Explore</span>
        </button>

        {/* How It Works */}
        <button
          id="mobile-nav-how-btn"
          onClick={onOpenHowItWorks}
          className="flex flex-col items-center gap-1 py-1 px-4 rounded-xl text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <HelpCircle className="w-5 h-5" />
          <span className="text-[11px]">How It Works</span>
        </button>
      </div>
    </nav>
  );
};
