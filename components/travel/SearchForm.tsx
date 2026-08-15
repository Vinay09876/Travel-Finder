'use client';

import React from 'react';
import { MapPin, IndianRupee, Users, Calendar, ArrowRight, Sparkles, ChevronDown } from 'lucide-react';
import { SearchQuery, CityOrigin } from '@/types';
import { POPULAR_CITIES, MONTHS, formatINR } from '@/lib/destinations';

export interface SearchFormProps {
  query: SearchQuery;
  onChangeQuery: (newQuery: SearchQuery) => void;
  onSubmitSearch: () => void;
  compact?: boolean;
  isSearching?: boolean;
}

export const SearchForm: React.FC<SearchFormProps> = ({
  query,
  onChangeQuery,
  onSubmitSearch,
  compact = false,
  isSearching = false,
}) => {
  const budgetPresets = [5000, 8000, 10000, 15000, 25000, 40000];

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeQuery({ ...query, fromCity: e.target.value as CityOrigin });
  };

  const handleBudgetChange = (amount: number) => {
    onChangeQuery({ ...query, budget: Math.max(1000, amount) });
  };

  const handleTravelersChange = (delta: number) => {
    const nextVal = Math.max(1, Math.min(10, query.travelers + delta));
    onChangeQuery({ ...query, travelers: nextVal });
  };

  const handleDurationChange = (delta: number) => {
    const nextVal = Math.max(1, Math.min(14, query.durationDays + delta));
    onChangeQuery({ ...query, durationDays: nextVal });
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeQuery({ ...query, month: e.target.value });
  };

  const quickPresets = [
    { fromCity: 'Mumbai' as CityOrigin, budget: 10000, travelers: 2, durationDays: 3, month: 'August 2026', label: 'Mumbai · ₹10,000 · 2 Travelers · 3 Days · Aug 2026' },
    { fromCity: 'Delhi' as CityOrigin, budget: 8500, travelers: 2, durationDays: 3, month: 'September 2026', label: 'Delhi · ₹8,500 · 2 Travelers · 3 Days · Sep 2026' },
    { fromCity: 'Bengaluru' as CityOrigin, budget: 12000, travelers: 2, durationDays: 3, month: 'October 2026', label: 'Bengaluru · ₹12,000 · 2 Travelers · 3 Days · Oct 2026' },
    { fromCity: 'Pune' as CityOrigin, budget: 6000, travelers: 1, durationDays: 2, month: 'August 2026', label: 'Pune · ₹6,000 · Solo · 2 Days · Aug 2026' },
  ];

  return (
    <div id="main-search-card" className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-lg shadow-slate-900/5 p-4 sm:p-6 lg:p-7">
      {/* Quick search example pills */}
      {!compact && (
        <div className="mb-5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Popular quick examples:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickPresets.map((preset, idx) => (
              <button
                key={idx}
                id={`preset-btn-${idx}`}
                type="button"
                onClick={() => {
                  onChangeQuery({
                    ...query,
                    fromCity: preset.fromCity,
                    budget: preset.budget,
                    travelers: preset.travelers,
                    durationDays: preset.durationDays,
                    month: preset.month,
                  });
                }}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all text-left font-medium cursor-pointer ${
                  query.fromCity === preset.fromCity &&
                  query.budget === preset.budget &&
                  query.travelers === preset.travelers &&
                  query.month === preset.month
                    ? 'bg-teal-50 border-teal-300 text-teal-800 ring-2 ring-teal-500/20'
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Grid Controls */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitSearch();
        }}
        className="space-y-4 sm:space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {/* 1. Starting Location */}
          <div className="flex flex-col">
            <label htmlFor="origin-city-select" className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>Starting From</span>
            </label>
            <div className="relative">
              <select
                id="origin-city-select"
                value={query.fromCity}
                onChange={handleCityChange}
                className="w-full h-12 pl-3.5 pr-9 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 font-semibold text-sm rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden transition-all appearance-none cursor-pointer"
              >
                {POPULAR_CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 2. Total Trip Budget */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="budget-input" className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-teal-600" />
                <span>Total Budget</span>
              </label>
              <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-sm">
                {formatINR(query.budget)}
              </span>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">₹</span>
              <input
                id="budget-input"
                type="number"
                min={2000}
                max={200000}
                step={500}
                value={query.budget}
                onChange={(e) => handleBudgetChange(Number(e.target.value))}
                className="w-full h-12 pl-8 pr-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 font-bold text-base rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden transition-all"
                placeholder="e.g. 10000"
              />
            </div>
          </div>

          {/* 3. Number of Travelers */}
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-teal-600" />
              <span>Travelers</span>
            </label>
            <div className="flex items-center justify-between h-12 px-3 bg-slate-50 rounded-xl border border-slate-300">
              <span className="text-sm font-semibold text-slate-900 truncate">
                {query.travelers} {query.travelers === 1 ? 'Solo' : query.travelers === 2 ? '2 People' : `${query.travelers} People`}
              </span>
              <div className="flex items-center gap-1">
                <button
                  id="travelers-minus-btn"
                  type="button"
                  onClick={() => handleTravelersChange(-1)}
                  disabled={query.travelers <= 1}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  aria-label="Decrease travelers"
                >
                  -
                </button>
                <button
                  id="travelers-plus-btn"
                  type="button"
                  onClick={() => handleTravelersChange(1)}
                  disabled={query.travelers >= 10}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  aria-label="Increase travelers"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 4. Trip Duration */}
          <div className="flex flex-col">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              <span>Duration</span>
            </label>
            <div className="flex items-center justify-between h-12 px-3 bg-slate-50 rounded-xl border border-slate-300">
              <span className="text-sm font-semibold text-slate-900">
                {query.durationDays} Days
              </span>
              <div className="flex items-center gap-1">
                <button
                  id="duration-minus-btn"
                  type="button"
                  onClick={() => handleDurationChange(-1)}
                  disabled={query.durationDays <= 1}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  aria-label="Decrease days"
                >
                  -
                </button>
                <button
                  id="duration-plus-btn"
                  type="button"
                  onClick={() => handleDurationChange(1)}
                  disabled={query.durationDays >= 14}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                  aria-label="Increase days"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* 5. Travel Month */}
          <div className="flex flex-col">
            <label htmlFor="travel-month-select" className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-600" />
              <span>Travel Month</span>
            </label>
            <div className="relative">
              <select
                id="travel-month-select"
                value={query.month}
                onChange={handleMonthChange}
                className="w-full h-12 pl-3.5 pr-9 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 font-semibold text-sm rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden transition-all appearance-none cursor-pointer"
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Second Row: Budget Preset Pills + Primary CTA */}
        <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
          {/* Quick budget chip selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
              Budget Presets:
            </span>
            {budgetPresets.map((preset) => (
              <button
                key={preset}
                id={`budget-chip-${preset}`}
                type="button"
                onClick={() => handleBudgetChange(preset)}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold border transition-all shrink-0 cursor-pointer ${
                  query.budget === preset
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                ₹{(preset / 1000).toFixed(0)}k
              </button>
            ))}
          </div>

          {/* Primary Find Trips CTA */}
          <button
            id="find-trips-submit-btn"
            type="submit"
            disabled={isSearching}
            className="h-12 px-7 rounded-xl bg-teal-600 hover:bg-teal-700 active:scale-[0.99] text-white font-bold text-sm tracking-wide shadow-md shadow-teal-700/15 flex items-center justify-center gap-2 transition-all cursor-pointer group shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span>{isSearching ? 'Searching...' : 'Find Trips'}</span>
            {!isSearching && <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
          </button>
        </div>
      </form>
    </div>
  );
};
