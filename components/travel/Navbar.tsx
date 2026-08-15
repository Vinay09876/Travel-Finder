import React from 'react';
import { Compass, HelpCircle, Bookmark } from 'lucide-react';
import { SearchQuery } from '@/types';

export interface NavbarProps {
  currentView: 'home' | 'results' | 'detail';
  onNavigateHome: () => void;
  onOpenHowItWorks: () => void;
  onOpenSavedTrips?: () => void;
  savedCount?: number;
  activeQuery: SearchQuery;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigateHome,
  onOpenHowItWorks,
  onOpenSavedTrips,
  savedCount = 0,
  activeQuery,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            id="nav-brand-btn"
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 group text-left focus:outline-hidden cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs group-hover:bg-teal-700 transition-colors">
              <Compass className="w-5 h-5 transition-transform group-hover:rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-slate-900 tracking-tight">TravelFinder</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-teal-50 text-teal-700 border border-teal-200">
                  Beta
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Budget-First Travel Discovery</p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              id="nav-explore-btn"
              onClick={onNavigateHome}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                currentView === 'home' || currentView === 'results'
                  ? 'text-teal-700 bg-teal-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Explore
            </button>

            {onOpenSavedTrips && (
              <button
                id="nav-saved-trips-btn"
                onClick={onOpenSavedTrips}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Bookmark className="w-4 h-4 text-slate-400" />
                <span>Saved</span>
                {savedCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold flex items-center justify-center">
                    {savedCount}
                  </span>
                )}
              </button>
            )}

            <button
              id="nav-how-it-works-btn"
              onClick={onOpenHowItWorks}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>How It Works</span>
            </button>
          </div>

          {/* Right Status Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>
              Origin: <strong className="text-slate-800 font-semibold">{activeQuery.fromCity}</strong>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
