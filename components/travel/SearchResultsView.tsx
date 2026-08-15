'use client';

import React, { useState, useMemo } from 'react';
import {
  MapPin,
  ArrowLeft,
  SlidersHorizontal,
  Users,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Compass,
} from 'lucide-react';
import { Destination, SearchQuery, TravelCategory, CalculatedCost } from '@/types';
import { calculateTripCost } from '@/lib/cost-calculator';
import { formatINR } from '@/lib/utils';
import { SearchForm } from './SearchForm';
import { DestinationCard } from './DestinationCard';

export interface SearchResultsViewProps {
  apiResults: { destination: Destination; costInfo: CalculatedCost }[];
  query: SearchQuery;
  onChangeQuery: (newQuery: SearchQuery) => void;
  onSelectDestination: (destId: string) => void;
  onBackToHome: () => void;
  onSearch: () => void;
  isSearching: boolean;
  savedTripIds?: string[];
  onToggleSave?: (destId: string) => void;
}

type SortOption = 'best_match' | 'cheapest' | 'budget_status';

export const SearchResultsView: React.FC<SearchResultsViewProps> = ({
  apiResults,
  query,
  onChangeQuery,
  onSelectDestination,
  onBackToHome,
  onSearch,
  isSearching,
  savedTripIds = [],
  onToggleSave,
}) => {
  const [sortBy, setSortBy] = useState<SortOption>('best_match');
  const [selectedCategory, setSelectedCategory] = useState<TravelCategory>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'fits' | 'near' | 'over'>('all');
  const [isEditingSearch, setIsEditingSearch] = useState(false);

  const categories: { id: TravelCategory; label: string }[] = [
    { id: 'all', label: 'All Places' },
    { id: 'beach', label: 'Beaches' },
    { id: 'heritage', label: 'Heritage & Palaces' },
    { id: 'hills', label: 'Hills & Mountains' },
    { id: 'adventure', label: 'Adventure & Rivers' },
  ];

  // Calculate costs and sort/filter
  const processedDestinations = useMemo(() => {
    const baseList = apiResults.map((res) => ({ dest: res.destination, costInfo: res.costInfo }));

    return baseList
      .filter(({ dest, costInfo }) => {
        if (selectedCategory !== 'all' && dest.category !== selectedCategory) {
          return false;
        }
        if (statusFilter !== 'all' && costInfo.budgetStatus !== statusFilter) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'cheapest') {
          return a.costInfo.totalEstimatedCost - b.costInfo.totalEstimatedCost;
        }
        if (sortBy === 'budget_status') {
          const order = { fits: 0, near: 1, over: 2 };
          if (order[a.costInfo.budgetStatus] !== order[b.costInfo.budgetStatus]) {
            return order[a.costInfo.budgetStatus] - order[b.costInfo.budgetStatus];
          }
          return a.costInfo.totalEstimatedCost - b.costInfo.totalEstimatedCost;
        }
        // 'best_match': prioritize 'fits', then 'near', then 'over', sorted by total estimated cost
        const statusPriority = { fits: 0, near: 1, over: 2 };
        if (statusPriority[a.costInfo.budgetStatus] !== statusPriority[b.costInfo.budgetStatus]) {
          return statusPriority[a.costInfo.budgetStatus] - statusPriority[b.costInfo.budgetStatus];
        }
        return a.costInfo.totalEstimatedCost - b.costInfo.totalEstimatedCost;
      });
  }, [apiResults, query, selectedCategory, statusFilter, sortBy]);

  // Overall counts across all categories
  const allWithCosts = useMemo(() => {
    return apiResults.map((r) => r.costInfo);
  }, [apiResults]);

  const fitsCount = allWithCosts.filter((c) => c.budgetStatus === 'fits').length;
  const nearCount = allWithCosts.filter((c) => c.budgetStatus === 'near').length;
  const overCount = allWithCosts.filter((c) => c.budgetStatus === 'over').length;

  return (
    <div id="search-results-page" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Top Breadcrumb & Modify Search */}
      <div className="flex items-center justify-between mb-4">
        <button
          id="back-to-home-btn"
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search</span>
        </button>

        <button
          id="toggle-edit-search-btn"
          onClick={() => setIsEditingSearch(!isEditingSearch)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{isEditingSearch ? 'Hide Search Controls' : 'Edit Search Criteria'}</span>
        </button>
      </div>

      {/* Expandable Search Criteria Editor */}
      {isEditingSearch && (
        <div className="mb-6 animate-in fade-in duration-200">
          <SearchForm
            query={query}
            onChangeQuery={onChangeQuery}
            onSubmitSearch={() => {
              setIsEditingSearch(false);
              onSearch();
            }}
            compact={true}
            isSearching={isSearching}
          />
        </div>
      )}

      {/* Prominent Search Summary & Criteria Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 mb-6 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
              <Compass className="w-3.5 h-3.5" />
              <span>Realistic Trip Cost Estimates</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Best Destinations for Your Budget
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Estimated realistic costs including transport, stay, food, local transit, and sights.
            </p>
          </div>

          {/* Prominent Search Criteria Recap Tag */}
          <div className="bg-slate-50 border border-slate-200 p-3 sm:p-3.5 rounded-xl self-start lg:self-auto">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Active Search Criteria
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-800">
              <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                <MapPin className="w-3 h-3 text-teal-600" />
                {query.fromCity}
              </span>
              <span className="text-slate-400">→</span>
              <span className="inline-flex items-center gap-1 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200 text-teal-800 font-extrabold">
                {formatINR(query.budget)}
              </span>
              <span className="text-slate-400">→</span>
              <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                <Users className="w-3 h-3 text-slate-500" />
                {query.travelers} {query.travelers === 1 ? 'Traveler' : 'Travelers'}
              </span>
              <span className="text-slate-400">→</span>
              <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                <Calendar className="w-3 h-3 text-slate-500" />
                {query.durationDays} Days
              </span>
              <span className="text-slate-400">→</span>
              <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300 text-slate-700 font-semibold">
                {query.month}
              </span>
            </div>
          </div>
        </div>

        {/* Budget Status Quick Filter Toolbar */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Status Breakdown Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-600 mr-1">Budget Status:</span>
            <button
              id="status-filter-all"
              onClick={() => setStatusFilter('all')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All ({apiResults.length})
            </button>

            <button
              id="status-filter-fits"
              onClick={() => setStatusFilter('fits')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                statusFilter === 'fits'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Fits your budget ({fitsCount})</span>
            </button>

            <button
              id="status-filter-near"
              onClick={() => setStatusFilter('near')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                statusFilter === 'near'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Near your budget ({nearCount})</span>
            </button>

            <button
              id="status-filter-over"
              onClick={() => setStatusFilter('over')}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                statusFilter === 'over'
                  ? 'bg-slate-700 text-white border-slate-700 shadow-xs'
                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
              }`}
            >
              <span>Over budget ({overCount})</span>
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs text-slate-600 self-start md:self-auto">
            <span className="font-semibold">Sort by:</span>
            <select
              id="sort-results-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-8 pl-2.5 pr-7 bg-white text-slate-800 font-bold rounded-lg border border-slate-300 focus:outline-hidden text-xs cursor-pointer"
            >
              <option value="best_match">Budget Fit First</option>
              <option value="cheapest">Cheapest Total Cost</option>
              <option value="budget_status">Group by Budget Status</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider mr-1">Vibe:</span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`filter-category-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs font-medium px-2.5 py-1 rounded-md whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-teal-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header Notice */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
        <span>
          Showing <strong>{processedDestinations.length}</strong> matching destination{processedDestinations.length !== 1 ? 's' : ''} for {query.month}
        </span>
        <span className="hidden sm:inline italic text-slate-500">
          *Estimates are indicative; transport and hotel prices may vary by booking date and season
        </span>
      </div>

      {/* Destination Cards List */}
      {processedDestinations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 text-center max-w-lg mx-auto my-8">
          <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-4 text-amber-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No destinations match this filter</h3>
          <p className="text-xs text-slate-600 mb-5 leading-relaxed">
            Try switching the budget status filter or adjusting your starting city/budget to view more options.
          </p>
          <button
            onClick={() => {
              setStatusFilter('all');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Show All Destinations
          </button>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-5">
          {processedDestinations.map(({ dest, costInfo }) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              costInfo={costInfo}
              query={query}
              onSelect={onSelectDestination}
              layout="row"
              isSaved={savedTripIds.includes(dest.id)}
              onToggleSave={onToggleSave}
            />
          ))}
        </div>
      )}
    </div>
  );
};
