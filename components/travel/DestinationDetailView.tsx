'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Train,
  Building,
  Utensils,
  Camera,
  Car,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Share2,
  Sun,
  ShieldCheck,
  Wifi,
  ChevronDown,
  ChevronUp,
  Info,
  Plane,
  Bookmark,
} from 'lucide-react';
import { Destination, SearchQuery, StayTier, TransportPreference } from '@/types';
import { calculateTripCost } from '@/lib/cost-calculator';
import { formatINR, getFallbackImage } from '@/lib/utils';
import dynamic from 'next/dynamic';

const InteractiveMap = dynamic(() => import('./InteractiveMap'), { 
  ssr: false, 
  loading: () => <div className="w-full h-80 sm:h-96 rounded-2xl bg-slate-100 animate-pulse border border-slate-200 flex items-center justify-center text-slate-400">Loading Map...</div> 
});

export interface DestinationDetailViewProps {
  destination: Destination;
  query: SearchQuery;
  onChangeQuery: (newQuery: SearchQuery) => void;
  onBackToResults: () => void;
  onOpenAiItinerary: () => void;
  isSaved?: boolean;
  onToggleSave?: (destId: string) => void;
}

export const DestinationDetailView: React.FC<DestinationDetailViewProps> = ({
  destination,
  query,
  onBackToResults,
  onOpenAiItinerary,
  isSaved = false,
  onToggleSave,
}) => {
  // Local stay tier and transport mode overrides for interactive customization
  const [activeStayTier, setActiveStayTier] = useState<StayTier>(query.stayTier || 'standard_homestay');
  const [activeTransportMode, setActiveTransportMode] = useState<TransportPreference>(query.transportPreference || 'all');
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [copiedToast, setCopiedToast] = useState(false);

  // Recalculate based on active overrides
  const customQuery: SearchQuery = {
    ...query,
    stayTier: activeStayTier,
    transportPreference: activeTransportMode,
  };
  const costInfo = calculateTripCost(destination, customQuery);
  const status = costInfo.budgetStatus;

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  const transportOptionsList = destination.transportOptions?.[query.fromCity] || destination.transportOptions?.['Mumbai'] || [];

  return (
    <div id="destination-detail-page" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          id="detail-back-btn"
          onClick={onBackToResults}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Matches</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Bookmark Button */}
          {onToggleSave && (
            <button
              onClick={() => onToggleSave(destination.id)}
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-teal-600' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          )}

          {/* Share Button */}
          <button
            id="share-trip-btn"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedToast ? 'Link Copied!' : 'Share Trip'}</span>
          </button>
        </div>
      </div>

      {/* 1. HERO SECTION */}
      <section id="destination-hero" className="relative rounded-3xl overflow-hidden mb-8 bg-slate-900 text-white shadow-lg">
        <div className="relative h-[340px] sm:h-[420px] w-full">
          <img
            src={destination.heroImage}
            alt={destination.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={(e) => { e.currentTarget.src = getFallbackImage(destination.id); }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/20" />

          {/* Hero Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  <span>{destination.state}, India</span>
                </span>
                <span className="bg-teal-500/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                  {destination.bestSeason}
                </span>
                <span className="bg-slate-800/80 backdrop-blur-md text-slate-200 text-xs font-semibold px-3 py-1 rounded-full">
                  Trip Month: {query.month}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-2">
                {destination.name}
              </h1>
              <p className="text-sm sm:text-base text-slate-200 line-clamp-2 leading-relaxed">
                {destination.tagline}
              </p>
            </div>

            {/* Prominent Estimated Cost Card */}
            <div className="bg-white/95 backdrop-blur-md text-slate-900 rounded-2xl p-4 sm:p-5 border border-white/40 shadow-xl shrink-0 min-w-[260px]">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Estimated Total Trip Cost
              </span>
              <div className="flex items-baseline gap-2 mt-0.5 mb-1">
                <span className="text-3xl font-black text-slate-900 tracking-tight">
                  {formatINR(costInfo.totalEstimatedCost)}
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  (~{formatINR(costInfo.perPersonCost)}/traveler)
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200/80 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-600">Your Budget:</span>
                  <span className="font-bold text-slate-900">{formatINR(query.budget)}</span>
                </div>
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-600">Budget Status:</span>
                  <span className={status === 'fits' ? 'text-emerald-600' : status === 'near' ? 'text-amber-600' : 'text-slate-600'}>
                    {status === 'fits'
                      ? `Fits budget (+${formatINR(costInfo.budgetRemaining)})`
                      : status === 'near'
                      ? `Near budget (-${formatINR(Math.abs(costInfo.budgetRemaining))})`
                      : `Over budget (-${formatINR(Math.abs(costInfo.budgetRemaining))})`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DESTINATION MAP */}
      {destination.lat && destination.lng && (
        <section className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <InteractiveMap 
            lat={destination.lat} 
            lng={destination.lng} 
            name={destination.name} 
          />
        </section>
      )}

      {/* 3. INTERACTIVE BUDGET CUSTOMIZER & 5-PILLAR BREAKDOWN */}
      <section id="budget-breakdown-section" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Left 2 Cols: Itemized 5-Pillar Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block mb-0.5">
                Complete Cost Transparency
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                5-Pillar Cost Breakdown for {destination.name}
              </h2>
            </div>

            {/* Budget status badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold self-start sm:self-auto ${
                status === 'fits'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : status === 'near'
                  ? 'bg-amber-50 text-amber-900 border border-amber-300'
                  : 'bg-slate-100 text-slate-700 border border-slate-300'
              }`}
            >
              {status === 'fits' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Fits your budget</span>
                </>
              ) : status === 'near' ? (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Near your budget</span>
                </>
              ) : (
                <span>Over budget</span>
              )}
            </div>
          </div>

          {/* 5-Pillar Interactive Breakdown List */}
          <div className="space-y-4">
            {/* Pillar 1: Transport */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-700">
                    <Train className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">1. Transport from {query.fromCity} (Round-Trip)</h3>
                    <p className="text-xs text-slate-500">
                      {costInfo.selectedTransport.name} · ~{costInfo.selectedTransport.durationHours} hrs transit
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-900">
                  {formatINR(costInfo.transportTotal)}
                </span>
              </div>

              {/* Transport switcher pills */}
              <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-slate-200/60">
                <span className="text-[10px] font-semibold text-slate-500 self-center mr-1">Switch Mode:</span>
                {transportOptionsList.map((opt, i) => (
                  <button
                    key={i}
                    id={`transport-option-${opt.mode}`}
                    onClick={() => setActiveTransportMode(opt.mode)}
                    className={`text-xs px-2.5 py-1 rounded-md font-semibold border transition-all cursor-pointer ${
                      costInfo.selectedTransport.name === opt.name
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt.mode === 'train' ? '🚆 ' : opt.mode === 'flight' ? '✈️ ' : opt.mode === 'bus' ? '🚌 ' : '🚗 '}
                    {opt.name.split('(')[0]} ({formatINR(opt.costPerPersonRoundTrip * query.travelers)})
                  </button>
                ))}
              </div>
            </div>

            {/* Pillar 2: Stay */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-700">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">2. Stay / Accommodation ({query.durationDays - 1} Nights)</h3>
                    <p className="text-xs text-slate-500">
                      {costInfo.selectedStay?.name || 'Standard Accommodation'} ({formatINR(costInfo.selectedStay?.costPerNightPerRoom || 1500)}/night)
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-900">
                  {formatINR(costInfo.stayTotal)}
                </span>
              </div>

              {/* Stay Tier Switcher */}
              <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t border-slate-200/60">
                <span className="text-[10px] font-semibold text-slate-500 self-center mr-1">Stay Style:</span>
                {destination.stayOptions.map((opt) => (
                  <button
                    key={opt.tier}
                    id={`stay-tier-${opt.tier}`}
                    onClick={() => setActiveStayTier(opt.tier)}
                    className={`text-xs px-2.5 py-1 rounded-md font-semibold border transition-all cursor-pointer ${
                      activeStayTier === opt.tier
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {opt.tier === 'budget_hostel' ? 'Backpacker Hostel' : opt.tier === 'comfort_hotel' ? '3-Star Resort' : 'Standard Homestay'}
                  </button>
                ))}
              </div>
            </div>

            {/* Pillar 3: Food */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">3. Food & Dining ({query.durationDays} Days)</h3>
                  <p className="text-xs text-slate-500">
                    Breakfast, regional meals, cafes, and tea (~{formatINR(costInfo.foodTotal / query.travelers / query.durationDays)}/traveler/day)
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-900">
                {formatINR(costInfo.foodTotal)}
              </span>
            </div>

            {/* Pillar 4: Local Transport */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Car className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">4. Local Transport</h3>
                  <p className="text-xs text-slate-500">
                    Scooter rentals, fuel, auto rickshaws, and local taxis ({query.durationDays} days)
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-900">
                {formatINR(costInfo.localTransportTotal)}
              </span>
            </div>

            {/* Pillar 5: Activities */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">5. Activities & Sights</h3>
                  <p className="text-xs text-slate-500">
                    Fort entry tickets, boat rides, water activities, and guided monument access
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-900">
                {formatINR(costInfo.activitiesTotal)}
              </span>
            </div>

            {/* Contingency Buffer */}
            <div className="p-3.5 rounded-xl bg-slate-100/70 border border-dashed border-slate-300 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Estimated 5% Contingency Buffer (water, tips, unforeseen transit)</span>
              </div>
              <span className="font-bold text-slate-800">{formatINR(costInfo.bufferTotal)}</span>
            </div>
          </div>
        </div>

        {/* Right Col: Budget Summary & AI Itinerary CTA Card */}
        <div className="space-y-6">
          {/* Summary Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-teal-400 tracking-wider">
                Financial Summary
              </span>
              <h3 className="text-lg font-bold text-white mt-1 mb-4">
                Trip Cost Overview
              </h3>

              <div className="space-y-3 text-xs mb-6">
                <div className="flex justify-between text-slate-300 pb-2 border-b border-slate-800">
                  <span>Your Stated Budget:</span>
                  <span className="font-bold text-white text-sm">{formatINR(query.budget)}</span>
                </div>
                <div className="flex justify-between text-slate-300 pb-2 border-b border-slate-800">
                  <span>Estimated Total Cost:</span>
                  <span className="font-bold text-teal-300 text-sm">{formatINR(costInfo.totalEstimatedCost)}</span>
                </div>
                <div className="flex justify-between items-center pt-1">
                  <span className="font-bold text-white">Estimated Balance:</span>
                  <span
                    className={`font-black text-base ${
                      costInfo.budgetRemaining >= 0 ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {costInfo.budgetRemaining >= 0
                      ? `+${formatINR(costInfo.budgetRemaining)} remaining`
                      : `-${formatINR(Math.abs(costInfo.budgetRemaining))} over`}
                  </span>
                </div>
              </div>
            </div>

            {/* Clear AI Itinerary CTA: "Generate My Itinerary" */}
            <div className="pt-4 border-t border-slate-800">
              <button
                id="generate-ai-itinerary-btn"
                onClick={onOpenAiItinerary}
                className="w-full py-3.5 px-4 bg-teal-500 hover:bg-teal-400 active:scale-[0.99] text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer group"
              >
                <Sparkles className="w-4 h-4 text-slate-950 transition-transform group-hover:rotate-12" />
                <span>Generate My Itinerary</span>
              </button>
              <p className="text-[11px] text-slate-400 text-center mt-2">
                Personalized day-by-day itinerary fitted to your travel month & budget.
              </p>
            </div>
          </div>

          {/* Quick Facts Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs text-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Info className="w-4 h-4 text-teal-600" />
              <span>Key Travel Facts</span>
            </h4>

            <div className="flex items-start gap-2 text-slate-600">
              <Sun className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Best Season: </strong>
                {destination.bestSeason}
              </div>
            </div>

            <div className="flex items-start gap-2 text-slate-600">
              <Train className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Nearest Station: </strong>
                {destination.importantInfo.nearestStation}
              </div>
            </div>

            <div className="flex items-start gap-2 text-slate-600">
              <Plane className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Nearest Airport: </strong>
                {destination.importantInfo.nearestAirport}
              </div>
            </div>

            <div className="flex items-start gap-2 text-slate-600">
              <Wifi className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">Connectivity: </strong>
                {destination.importantInfo.connectivity}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DAY-BY-DAY ITINERARY PLAN */}
      <section id="day-plan-section" className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-8 mb-10 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block mb-0.5">
              Realistic Daily Schedule
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Your {query.durationDays}-Day {destination.name} Plan
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Curated timeline optimized for budget, travel distances, and iconic experiences.
            </p>
          </div>

          <button
            id="plan-ai-itinerary-btn"
            onClick={onOpenAiItinerary}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>Generate My Itinerary</span>
          </button>
        </div>

        {/* Day Cards Accordion / Timeline */}
        <div className="space-y-4">
          {destination.sampleItinerary.slice(0, query.durationDays).map((day) => {
            const isCurrentExpanded = expandedDay === day.dayNumber;

            return (
              <div
                key={day.dayNumber}
                id={`day-plan-card-${day.dayNumber}`}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-slate-50/50"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => setExpandedDay(isCurrentExpanded ? null : day.dayNumber)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left hover:bg-slate-100/60 transition-colors focus:outline-hidden cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-600 text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0">
                      D{day.dayNumber}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base">{day.title}</h3>
                      <span className="text-xs text-teal-700 font-medium">{day.theme}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                      {isCurrentExpanded ? 'Collapse' : 'Expand Schedule'}
                    </span>
                    {isCurrentExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                </button>

                {/* Accordion Content: Morning, Afternoon, Evening */}
                {isCurrentExpanded && (
                  <div className="p-4 sm:p-6 pt-0 border-t border-slate-200/60 bg-white space-y-4 mt-2">
                    {/* Morning */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold text-xs shrink-0 mt-0.5">
                        🌅
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-900 mb-0.5">
                          <span>Morning</span>
                          <span className="text-teal-700">~{formatINR(day.morning.estimatedCost)}</span>
                        </div>
                        <p className="font-semibold text-slate-800 mb-1">{day.morning.activity}</p>
                        <p className="text-slate-600 leading-relaxed">{day.morning.description}</p>
                        {day.morning.tip && (
                          <div className="mt-1.5 text-[11px] text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100 font-medium">
                            💡 Tip: {day.morning.tip}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Afternoon */}
                    <div className="flex items-start gap-3.5 pt-3 border-t border-slate-100">
                      <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-700 font-bold text-xs shrink-0 mt-0.5">
                        ☀️
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-900 mb-0.5">
                          <span>Afternoon</span>
                          <span className="text-teal-700">~{formatINR(day.afternoon.estimatedCost)}</span>
                        </div>
                        <p className="font-semibold text-slate-800 mb-1">{day.afternoon.activity}</p>
                        <p className="text-slate-600 leading-relaxed">{day.afternoon.description}</p>
                        {day.afternoon.foodRecommendation && (
                          <div className="mt-1.5 text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/80 font-medium">
                            🍽️ Food Recommendation: {day.afternoon.foodRecommendation}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Evening */}
                    <div className="flex items-start gap-3.5 pt-3 border-t border-slate-100">
                      <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0 mt-0.5">
                        🌆
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between font-bold text-slate-900 mb-0.5">
                          <span>Evening & Sunset</span>
                          <span className="text-teal-700">~{formatINR(day.evening.estimatedCost)}</span>
                        </div>
                        <p className="font-semibold text-slate-800 mb-1">{day.evening.activity}</p>
                        <p className="text-slate-600 leading-relaxed">{day.evening.description}</p>
                        {day.evening.sunsetSpotOrVibe && (
                          <div className="mt-1.5 text-[11px] text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 font-medium">
                            ✨ Sunset Highlight: {day.evening.sunsetSpotOrVibe}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. LOCAL FOOD, TRAVEL TIPS & PRACTICAL INFO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Must Try Food */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Utensils className="w-4 h-4 text-teal-600" />
            <span>Must-Try Local Food in {destination.name}</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {destination.mustTryFood.map((food, i) => (
              <span
                key={i}
                className="text-xs bg-slate-50 border border-slate-200 text-slate-800 px-3 py-1.5 rounded-lg font-medium"
              >
                🍛 {food}
              </span>
            ))}
          </div>
        </div>

        {/* Practical Local Tips */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Local Money-Saving Tips</span>
          </h3>
          <ul className="space-y-2 text-xs text-slate-600">
            {destination.travelTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-teal-600 font-bold">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
