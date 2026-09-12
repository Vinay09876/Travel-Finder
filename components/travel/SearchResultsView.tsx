'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft,
  Users,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Compass,
  IndianRupee,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RefreshCw,
  MapPin,
} from 'lucide-react';
import { Destination, SearchQuery, TravelCategory, CalculatedCost, CityOrigin } from '@/types';
import { POPULAR_CITIES, MONTHS } from '@/lib/destinations';
import { DestinationCard } from './DestinationCard';

const RESULTS_PER_PAGE = 10;

export interface SearchResultsViewProps {
  apiResults: { destination: Destination; costInfo: CalculatedCost }[];
  query: SearchQuery;
  onChangeQuery: (newQuery: SearchQuery) => void;
  onSelectDestination: (destId: string) => void;
  onBackToHome: () => void;
  onSearch: (queryToSubmit?: SearchQuery) => void;
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
  const [currentPage, setCurrentPage] = useState(1);

  // Draft copy of the query, edited inline in the criteria banner. Only
  // committed (via onChangeQuery + onSearch) when "Update Results" is clicked,
  // so typing in the budget field doesn't trigger a search on every keystroke.
  const [draftQuery, setDraftQuery] = useState<SearchQuery>(query);
  const isDirty = useMemo(() => JSON.stringify(draftQuery) !== JSON.stringify(query), [draftQuery, query]);

  useEffect(() => {
    setDraftQuery(query);
  }, [query]);

  const handleUpdateResults = () => {
    onChangeQuery(draftQuery);
    onSearch(draftQuery);
  };

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
  }, [apiResults, selectedCategory, statusFilter, sortBy]);

  // Reset to page 1 whenever the filtered/sorted list changes shape
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, statusFilter, sortBy, apiResults]);

  const totalPages = Math.max(1, Math.ceil(processedDestinations.length / RESULTS_PER_PAGE));
  const paginatedDestinations = useMemo(() => {
    const start = (currentPage - 1) * RESULTS_PER_PAGE;
    return processedDestinations.slice(start, start + RESULTS_PER_PAGE);
  }, [processedDestinations, currentPage]);

  const goToPage = (page: number) => {
    const clamped = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(clamped);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Overall counts across all categories
  const allWithCosts = useMemo(() => {
    return apiResults.map((r) => r.costInfo);
  }, [apiResults]);

  const fitsCount = allWithCosts.filter((c) => c.budgetStatus === 'fits').length;
  const nearCount = allWithCosts.filter((c) => c.budgetStatus === 'near').length;
  const overCount = allWithCosts.filter((c) => c.budgetStatus === 'over').length;

  return (
    <div id="search-results-page" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between mb-4">
        <button
          id="back-to-home-btn"
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search</span>
        </button>
      </div>

      {/* Prominent Search Summary & Criteria Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 mb-6 shadow-xs">
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

        {/* Editable Active Search Criteria */}
        <div className="mt-5 bg-slate-50 border border-slate-200 p-3.5 sm:p-4 rounded-xl">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-2.5">
            Active Search Criteria — edit and update anytime
          </div>
          <div className="flex flex-wrap items-end gap-3">
            {/* Origin city */}
            <div className="flex flex-col">
              <label htmlFor="criteria-city" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-teal-600" />
                From
              </label>
              <div className="relative">
                <select
                  id="criteria-city"
                  value={draftQuery.fromCity}
                  onChange={(e) => setDraftQuery({ ...draftQuery, fromCity: e.target.value as CityOrigin })}
                  className="h-9 pl-2.5 pr-7 bg-white text-slate-900 font-bold text-xs rounded-lg border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden appearance-none cursor-pointer"
                >
                  {POPULAR_CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <span className="text-slate-300 pb-2 hidden sm:inline">→</span>

            {/* Budget */}
            <div className="flex flex-col">
              <label htmlFor="criteria-budget" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                <IndianRupee className="w-3 h-3 text-teal-600" />
                Budget
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">₹</span>
                <input
                  id="criteria-budget"
                  type="number"
                  min={1000}
                  step={500}
                  value={draftQuery.budget || ''}
                  onChange={(e) => setDraftQuery({ ...draftQuery, budget: e.target.value === '' ? 0 : Number(e.target.value) })}
                  onBlur={() => setDraftQuery((prev) => ({ ...prev, budget: Math.max(1000, prev.budget || 0) }))}
                  className="w-28 h-9 pl-6 pr-2 bg-teal-50 text-teal-900 font-extrabold text-xs rounded-lg border border-teal-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden"
                />
              </div>
            </div>

            <span className="text-slate-300 pb-2 hidden sm:inline">→</span>

            {/* Travelers */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                <Users className="w-3 h-3 text-slate-500" />
                Travelers
              </label>
              <div className="flex items-center h-9 bg-white rounded-lg border border-slate-300 px-1">
                <button
                  type="button"
                  onClick={() => setDraftQuery({ ...draftQuery, travelers: Math.max(1, draftQuery.travelers - 1) })}
                  disabled={draftQuery.travelers <= 1}
                  className="w-6 h-6 flex items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Decrease travelers"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-7 text-center text-xs font-bold text-slate-800">{draftQuery.travelers}</span>
                <button
                  type="button"
                  onClick={() => setDraftQuery({ ...draftQuery, travelers: Math.min(10, draftQuery.travelers + 1) })}
                  disabled={draftQuery.travelers >= 10}
                  className="w-6 h-6 flex items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Increase travelers"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <span className="text-slate-300 pb-2 hidden sm:inline">→</span>

            {/* Duration */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" />
                Days
              </label>
              <div className="flex items-center h-9 bg-white rounded-lg border border-slate-300 px-1">
                <button
                  type="button"
                  onClick={() => setDraftQuery({ ...draftQuery, durationDays: Math.max(1, draftQuery.durationDays - 1) })}
                  disabled={draftQuery.durationDays <= 1}
                  className="w-6 h-6 flex items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Decrease days"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-7 text-center text-xs font-bold text-slate-800">{draftQuery.durationDays}</span>
                <button
                  type="button"
                  onClick={() => setDraftQuery({ ...draftQuery, durationDays: Math.min(14, draftQuery.durationDays + 1) })}
                  disabled={draftQuery.durationDays >= 14}
                  className="w-6 h-6 flex items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Increase days"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            <span className="text-slate-300 pb-2 hidden sm:inline">→</span>

            {/* Month */}
            <div className="flex flex-col">
              <label htmlFor="criteria-month" className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Month
              </label>
              <div className="relative">
                <select
                  id="criteria-month"
                  value={draftQuery.month}
                  onChange={(e) => setDraftQuery({ ...draftQuery, month: e.target.value })}
                  className="h-9 pl-2.5 pr-7 bg-white text-slate-900 font-bold text-xs rounded-lg border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden appearance-none cursor-pointer"
                >
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Update button */}
            <button
              id="update-search-criteria-btn"
              onClick={handleUpdateResults}
              disabled={isSearching || !isDirty}
              className={`h-9 ml-auto px-4 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:cursor-not-allowed ${
                isDirty
                  ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSearching ? 'animate-spin' : ''}`} />
              <span>{isSearching ? 'Updating...' : 'Update Results'}</span>
            </button>
          </div>
        </div>

        {/* Budget Status Quick Filter Toolbar */}
        <div className="mt-5 pt-5 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
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
          Showing <strong>{paginatedDestinations.length}</strong> of <strong>{processedDestinations.length}</strong> matching destination{processedDestinations.length !== 1 ? 's' : ''} for {query.month}
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
        <>
          <div className="space-y-4 sm:space-y-5">
            {paginatedDestinations.map(({ dest, costInfo }) => (
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-1.5">
              <button
                id="pagination-prev-btn"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  // Show first, last, current, and neighbors of current; collapse the rest
                  return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                })
                .reduce<(number | 'ellipsis')[]>((acc, page, idx, arr) => {
                  if (idx > 0 && page - arr[idx - 1] > 1) acc.push('ellipsis');
                  acc.push(page);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === 'ellipsis' ? (
                    <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-slate-400 text-xs">
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => goToPage(item)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        item === currentPage
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {item}
                    </button>
                  )
                )}

              <button
                id="pagination-next-btn"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
