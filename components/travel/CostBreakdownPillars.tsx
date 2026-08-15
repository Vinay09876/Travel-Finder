import React from 'react';
import { Train, Building, Utensils, Car, Camera, ShieldCheck } from 'lucide-react';
import { CalculatedCost, SearchQuery } from '@/types';
import { formatINR } from '@/lib/utils';

export interface CostBreakdownPillarsProps {
  costInfo: CalculatedCost;
  query: SearchQuery;
  showTransitDetails?: boolean;
  showBuffer?: boolean;
}

export const CostBreakdownPillars: React.FC<CostBreakdownPillarsProps> = ({
  costInfo,
  query,
  showTransitDetails = true,
  showBuffer = false,
}) => {
  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase font-bold text-slate-600">
          Estimated 5-Pillar Breakdown ({query.travelers} {query.travelers === 1 ? 'Traveler' : 'Travelers'}, {query.durationDays} Days):
        </span>
        <span className="text-[10px] text-slate-500 font-medium">{query.month}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
        {/* 1. Transport */}
        <div className="flex items-center gap-1.5 text-slate-700 bg-white p-2 rounded-lg border border-slate-200/60">
          <Train className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-slate-600 block truncate">Transport</span>
            <span className="font-bold text-slate-900">{formatINR(costInfo.transportTotal)}</span>
          </div>
        </div>

        {/* 2. Stay */}
        <div className="flex items-center gap-1.5 text-slate-700 bg-white p-2 rounded-lg border border-slate-200/60">
          <Building className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-slate-600 block truncate">Hotel / Stay</span>
            <span className="font-bold text-slate-900">{formatINR(costInfo.stayTotal)}</span>
          </div>
        </div>

        {/* 3. Food */}
        <div className="flex items-center gap-1.5 text-slate-700 bg-white p-2 rounded-lg border border-slate-200/60">
          <Utensils className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-slate-600 block truncate">Food & Dining</span>
            <span className="font-bold text-slate-900">{formatINR(costInfo.foodTotal)}</span>
          </div>
        </div>

        {/* 4. Local Transport */}
        <div className="flex items-center gap-1.5 text-slate-700 bg-white p-2 rounded-lg border border-slate-200/60">
          <Car className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-slate-600 block truncate">Local Transit</span>
            <span className="font-bold text-slate-900">{formatINR(costInfo.localTransportTotal)}</span>
          </div>
        </div>

        {/* 5. Activities */}
        <div className="flex items-center gap-1.5 text-slate-700 bg-white p-2 rounded-lg border border-slate-200/60 col-span-2 sm:col-span-1">
          <Camera className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <div className="min-w-0">
            <span className="text-[10px] text-slate-600 block truncate">Activities</span>
            <span className="font-bold text-slate-900">{formatINR(costInfo.activitiesTotal)}</span>
          </div>
        </div>
      </div>

      {/* Contingency Buffer Row if requested */}
      {showBuffer && (
        <div className="mt-2.5 p-2 rounded-lg bg-slate-100/70 border border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Estimated 5% Contingency Buffer (water, tips, unforeseen transit)</span>
          </div>
          <span className="font-bold text-slate-800">{formatINR(costInfo.bufferTotal)}</span>
        </div>
      )}

      {/* Route transit details */}
      {showTransitDetails && (
        <div className="mt-2.5 pt-2 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-500">
          <span>
            Transit from {query.fromCity}: <strong>{costInfo.selectedTransport.name}</strong> (~{costInfo.selectedTransport.durationHours}h)
          </span>
          <span className="font-semibold text-teal-700">
            ~{formatINR(costInfo.perPersonCost)} / traveler
          </span>
        </div>
      )}
    </div>
  );
};
