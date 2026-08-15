import React from 'react';
import { MapPin, ArrowRight, CheckCircle2, AlertCircle, ArrowUpRight, Bookmark } from 'lucide-react';
import { Destination, SearchQuery, CalculatedCost } from '@/types';
import { formatINR, getFallbackImage } from '@/lib/utils';
import { CostBreakdownPillars } from './CostBreakdownPillars';

export interface DestinationCardProps {
  destination: Destination;
  costInfo: CalculatedCost;
  query: SearchQuery;
  onSelect: (destId: string) => void;
  layout?: 'row' | 'grid';
  isSaved?: boolean;
  onToggleSave?: (destId: string) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  costInfo,
  query,
  onSelect,
  layout = 'row',
  isSaved = false,
  onToggleSave,
}) => {
  const status = costInfo.budgetStatus;

  if (layout === 'grid') {
    return (
      <div
        id={`popular-card-${destination.id}`}
        onClick={() => onSelect(destination.id)}
        className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col"
      >
        {/* Image with Tag Overlay */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <img
            src={destination.heroImage}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={(e) => { e.currentTarget.src = getFallbackImage(destination.id); }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

          {/* State badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[11px] font-bold text-slate-800 shadow-xs">
            <MapPin className="w-3 h-3 text-teal-600" />
            <span>{destination.state}</span>
          </div>

          {/* Top Right Badges */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            {/* Budget Fit Badge */}
            <div
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold backdrop-blur-md shadow-xs ${
                status === 'fits'
                  ? 'bg-emerald-600/95 text-white'
                  : status === 'near'
                  ? 'bg-amber-600/95 text-white'
                  : 'bg-slate-900/90 text-slate-200'
              }`}
            >
              {status === 'fits'
                ? 'Fits your budget ✓'
                : status === 'near'
                ? 'Near your budget'
                : 'Over budget'}
            </div>

            {/* Bookmark Button */}
            {onToggleSave && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSave(destination.id);
                }}
                className="w-7 h-7 bg-white/90 hover:bg-white backdrop-blur-md rounded-full shadow-xs flex items-center justify-center transition-all cursor-pointer"
                aria-label={isSaved ? "Remove bookmark" : "Save destination"}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-teal-500 text-teal-500' : 'text-slate-600 hover:text-teal-600'}`} />
              </button>
            )}
          </div>

          {/* Destination name over bottom gradient */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <h3 className="text-lg font-bold tracking-tight">{destination.name}</h3>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
              {destination.shortDescription}
            </p>

            {/* Vibe Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
              {destination.vibe.slice(0, 3).map((v, i) => (
                <span
                  key={i}
                  className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-sm"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing & CTA footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-600 block">
                Estimated Total
              </span>
              <span className="text-base font-bold text-slate-900">
                {formatINR(costInfo.totalEstimatedCost)}
              </span>
            </div>

            <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 group-hover:text-teal-700 group-hover:translate-x-0.5 transition-all">
              <span>View Trip</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Row layout for search results
  return (
    <div
      id={`result-card-${destination.id}`}
      className="bg-white rounded-2xl border border-slate-200 hover:border-teal-500/50 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col md:flex-row group"
    >
      {/* Image Section */}
      <div className="relative md:w-80 lg:w-96 h-52 md:h-auto shrink-0 bg-slate-100 overflow-hidden">
        <img
          src={destination.heroImage}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={(e) => { e.currentTarget.src = getFallbackImage(destination.id); }}
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-slate-950/75 via-transparent to-transparent" />

        {/* Bookmark Button */}
        {onToggleSave && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(destination.id);
            }}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white backdrop-blur-md rounded-full shadow-xs flex items-center justify-center transition-all cursor-pointer z-10"
            aria-label={isSaved ? "Remove bookmark" : "Save destination"}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-teal-500 text-teal-500' : 'text-slate-600 hover:text-teal-600'}`} />
          </button>
        )}

        {/* Destination Info Overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <span className="text-[11px] font-semibold bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-sm mb-1 inline-block">
            {destination.state} · {destination.region}
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">{destination.name}</h2>
        </div>
      </div>

      {/* Content & Cost Breakdown Body */}
      <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row: Tagline + Prominent Budget Status */}
          <div className="flex flex-wrap items-start justify-between gap-2.5 mb-2.5">
            <p className="text-xs sm:text-sm font-semibold text-slate-700 max-w-md">
              {destination.tagline}
            </p>

            {/* Explicit Budget Status Badge */}
            {status === 'fits' && (
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 text-emerald-800 px-3 py-1 rounded-full text-xs font-extrabold shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Fits your budget ✓ (+{formatINR(costInfo.budgetRemaining)} buffer)</span>
              </div>
            )}

            {status === 'near' && (
              <div className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-300 text-amber-900 px-3 py-1 rounded-full text-xs font-extrabold shadow-2xs">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                <span>Near your budget (+{formatINR(Math.abs(costInfo.budgetRemaining))} needed)</span>
              </div>
            )}

            {status === 'over' && (
              <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-300 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">
                <span>Over budget (+{formatINR(Math.abs(costInfo.budgetRemaining))})</span>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
            {destination.shortDescription}
          </p>

          {/* 5-Pillar Cost Breakdown Box */}
          <div className="mb-4">
            <CostBreakdownPillars costInfo={costInfo} query={query} />
          </div>
        </div>

        {/* Footer Row: Total Estimated Cost + View Details CTA */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {formatINR(costInfo.totalEstimatedCost)}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                estimated total for {query.travelers} traveler{query.travelers > 1 ? 's' : ''}
              </span>
            </div>
            <span
              className={`text-[11px] font-semibold block mt-0.5 ${
                status === 'fits'
                  ? 'text-emerald-700'
                  : status === 'near'
                  ? 'text-amber-800'
                  : 'text-slate-500'
              }`}
            >
              {status === 'fits'
                ? `₹${costInfo.budgetRemaining.toLocaleString('en-IN')} remaining of your ₹${query.budget.toLocaleString('en-IN')} budget`
                : status === 'near'
                ? `Requires ₹${Math.abs(costInfo.budgetRemaining).toLocaleString('en-IN')} beyond your ₹${query.budget.toLocaleString('en-IN')} budget`
                : `Exceeds budget by ₹${Math.abs(costInfo.budgetRemaining).toLocaleString('en-IN')}`}
            </span>
          </div>

          <button
            id={`view-trip-btn-${destination.id}`}
            onClick={() => onSelect(destination.id)}
            className="h-11 px-5 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer group"
          >
            <span>View Trip Details</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
