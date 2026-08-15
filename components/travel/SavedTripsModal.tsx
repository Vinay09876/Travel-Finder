'use client';

import React, { useState } from 'react';
import {
  X,
  Bookmark,
  Trash2,
  ArrowRight,
  Layers,
} from 'lucide-react';
import { Destination, SearchQuery } from '@/types';
import { calculateTripCost } from '@/lib/cost-calculator';
import { formatINR, getFallbackImage } from '@/lib/utils';


interface SavedTripsModalProps {
  isOpen: boolean;
  savedTripIds: string[];
  destinations: Destination[];
  query: SearchQuery;
  onSelectDestination: (destId: string) => void;
  onToggleSave: (destId: string) => void;
  onClose: () => void;
}

export const SavedTripsModal: React.FC<SavedTripsModalProps> = ({
  isOpen,
  savedTripIds,
  destinations,
  query,
  onSelectDestination,
  onToggleSave,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'compare'>('list');

  if (!isOpen) return null;

  const savedDestinations = destinations.filter((d) => savedTripIds.includes(d.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 block">
                Saved Itineraries ({savedDestinations.length})
              </span>
              <h2 className="text-xl font-black tracking-tight">Your Bookmarked Trips</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors focus:outline-hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher if 2 or more saved */}
        {savedDestinations.length > 1 && (
          <div className="flex border-b border-slate-200 px-6 pt-3 bg-slate-50 gap-4">
            <button
              onClick={() => setActiveTab('list')}
              className={`pb-3 text-xs font-bold transition-all border-b-2 ${
                activeTab === 'list'
                  ? 'border-teal-600 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Saved Cards ({savedDestinations.length})
            </button>
            <button
              onClick={() => setActiveTab('compare')}
              className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
                activeTab === 'compare'
                  ? 'border-teal-600 text-teal-800'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Side-by-Side Comparison</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-7 max-h-[70vh] overflow-y-auto">
          {savedDestinations.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">No saved trips yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                Click the bookmark icon on any destination card or trip details page to save it for quick comparison.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-700 transition-colors"
              >
                Explore Destinations
              </button>
            </div>
          ) : activeTab === 'list' ? (
            /* List of Saved Cards */
            <div className="space-y-3.5">
              {savedDestinations.map((dest) => {
                const costInfo = calculateTripCost(dest, query);

                return (
                  <div
                    key={dest.id}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={dest.heroImage}
                        alt={dest.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                        referrerPolicy="no-referrer"
                        onError={(e) => { e.currentTarget.src = getFallbackImage(dest.id); }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-slate-900">{dest.name}</h3>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {dest.state}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                          {dest.tagline}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold text-slate-900">
                            {formatINR(costInfo.totalEstimatedCost)}
                          </span>
                          <span className="text-[10px] text-slate-400">•</span>
                          <span className="text-[11px] font-semibold text-teal-700">
                            {formatINR(costInfo.perPersonCost)}/person
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => onToggleSave(dest.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => {
                          onSelectDestination(dest.id);
                          onClose();
                        }}
                        className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <span>View Trip</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Side-by-Side Comparison Matrix */
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-2.5 px-3 font-bold text-slate-500 uppercase text-[10px]">Metric</th>
                    {savedDestinations.map((d) => (
                      <th key={d.id} className="py-2.5 px-3 font-bold text-slate-900 text-sm">
                        {d.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-600">Total Est. Cost</td>
                    {savedDestinations.map((d) => {
                      const cost = calculateTripCost(d, query);
                      return (
                        <td key={d.id} className="py-3 px-3 font-black text-slate-900 text-sm">
                          {formatINR(cost.totalEstimatedCost)}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-600">Per Person</td>
                    {savedDestinations.map((d) => {
                      const cost = calculateTripCost(d, query);
                      return (
                        <td key={d.id} className="py-3 px-3 font-bold text-teal-700">
                          {formatINR(cost.perPersonCost)}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-600">Budget Status</td>
                    {savedDestinations.map((d) => {
                      const cost = calculateTripCost(d, query);
                      return (
                        <td key={d.id} className="py-3 px-3">
                          {cost.fitsBudget ? (
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-sm">
                              +{formatINR(cost.budgetRemaining)} Safe
                            </span>
                          ) : (
                            <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-sm">
                              Stretch
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-600">Recommended Transit</td>
                    {savedDestinations.map((d) => {
                      const cost = calculateTripCost(d, query);
                      return (
                        <td key={d.id} className="py-3 px-3 text-slate-700">
                          {cost.selectedTransport.name} (~{cost.selectedTransport.durationHours}h)
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="py-3 px-3 font-semibold text-slate-600">Best Season</td>
                    {savedDestinations.map((d) => (
                      <td key={d.id} className="py-3 px-3 text-slate-700">
                        {d.bestSeason}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
