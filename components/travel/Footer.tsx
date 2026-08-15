import React from 'react';
import { Compass } from 'lucide-react';

export interface FooterProps {
  onOpenHowItWorks: () => void;
  onOpenDesignSystem?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenHowItWorks, onOpenDesignSystem }) => {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-8 sm:py-10 text-xs text-slate-500 mt-12 pb-20 md:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-teal-600 flex items-center justify-center text-white">
            <Compass className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-800">TravelFinder</span>
          <span>© 2026</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onOpenHowItWorks}
            className="hover:text-slate-900 transition-colors cursor-pointer font-medium"
          >
            How It Works
          </button>
          {onOpenDesignSystem && (
            <>
              <span>·</span>
              <button
                onClick={onOpenDesignSystem}
                className="hover:text-slate-900 transition-colors cursor-pointer font-medium text-teal-700"
              >
                Design System Spec
              </button>
            </>
          )}
          <span>·</span>
          <span>Estimated costs include transport, stay, food, local travel, and activities. Prices may vary by season.</span>
        </div>
      </div>
    </footer>
  );
};
