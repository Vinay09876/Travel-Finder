import React from 'react';
import { ArrowUpRight, TrendingUp } from 'lucide-react';
import { Destination, SearchQuery } from '@/types';
import { calculateTripCost } from '@/lib/cost-calculator';
import { DestinationCard } from './DestinationCard';

export interface PopularDestinationsProps {
  destinations: Destination[];
  query: SearchQuery;
  onSelectDestination: (destId: string) => void;
  onViewAllResults: () => void;
}

export const PopularDestinations: React.FC<PopularDestinationsProps> = ({
  destinations,
  query,
  onSelectDestination,
  onViewAllResults,
}) => {
  // Focus on the core popular weekend getaways
  const featuredIds = ['goa', 'udaipur', 'jaipur', 'manali', 'gokarna', 'rishikesh'];
  const featuredList = destinations.filter((d) => featuredIds.includes(d.id));

  return (
    <section id="popular-destinations-section" className="w-full my-8 sm:my-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Trending Destinations</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Popular Getaways from {query.fromCity}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Estimated complete {query.durationDays}-day cost for {query.travelers} traveler{query.travelers > 1 ? 's' : ''}
          </p>
        </div>

        <button
          id="view-all-trips-btn"
          onClick={onViewAllResults}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100/80 px-3.5 py-2 rounded-lg transition-colors self-start sm:self-auto cursor-pointer"
        >
          <span>View All Matches</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {featuredList.slice(0, 4).map((dest) => {
          const costInfo = calculateTripCost(dest, query);

          return (
            <DestinationCard
              key={dest.id}
              destination={dest}
              costInfo={costInfo}
              query={query}
              onSelect={onSelectDestination}
              layout="grid"
            />
          );
        })}
      </div>
    </section>
  );
};
