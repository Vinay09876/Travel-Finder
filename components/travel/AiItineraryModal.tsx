'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';
import { Destination, SearchQuery, TripVibe, ItineraryDay } from '@/types';
import { formatINR } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { getAnonymousUserId } from '@/lib/user-identity';

export interface AiItineraryModalProps {
  destination: Destination;
  query: SearchQuery;
  isOpen: boolean;
  onClose: () => void;
}

export const AiItineraryModal: React.FC<AiItineraryModalProps> = ({
  destination,
  query,
  isOpen,
  onClose,
}) => {
  const [selectedVibe, setSelectedVibe] = useState<TripVibe>('relaxed');
  const [startTime, setStartTime] = useState<'early' | 'leisure'>('leisure');
  const [dietary, setDietary] = useState<'all' | 'veg' | 'cafe'>('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<ItineraryDay[] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const vibeOptions: { id: TripVibe; label: string; icon: string; desc: string }[] = [
    { id: 'relaxed', label: 'Relaxed & Scenic', icon: '🌿', desc: 'Slow mornings, sunset views, low rush' },
    { id: 'active', label: 'High Energy & Adventure', icon: '⚡', desc: 'Packed days, water sports, hill hikes' },
    { id: 'foodie', label: 'Foodie & Cafe Explorer', icon: '🍽️', desc: 'Legendary eateries, street food & bakeries' },
    { id: 'culture', label: 'Heritage & Culture', icon: '🏛️', desc: 'Temples, historic forts & artisan bazaars' },
    { id: 'budget_saver', label: 'Maximum Budget Saver', icon: '💰', desc: 'Free spots, cheap transit & street stalls' },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const anonId = getAnonymousUserId();

      const res = await fetch('/api/ai-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': anonId,
        },
        body: JSON.stringify({
          destinationId: destination.id,
          query,
          preferences: { vibe: selectedVibe, startTime, dietary },
        }),
      });

      if (!res.ok) {
        let errMessage = 'AI generation failed.';
        try {
          const errData = await res.json();
          if (errData.error) errMessage = errData.error;
        } catch {
          // ignore
        }
        throw new Error(errMessage);
      }

      const data = await res.json();
      if (!data.generatedContent) {
        throw new Error('Invalid response from AI.');
      }

      setGeneratedItinerary(data.generatedContent);
      setHasGenerated(true);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'AI is resting right now, please try again later.';
      setErrorMsg(msg);
      setHasGenerated(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!generatedItinerary) return;
    const itineraryText = `✨ TravelFinder AI Itinerary: ${destination.name} (${query.durationDays} Days)\nStarting from: ${query.fromCity}\nTravelers: ${query.travelers}\nVibe: ${selectedVibe}\n\n${generatedItinerary
      .map(
        (day) =>
          `📅 DAY ${day.dayNumber}: ${day.title}\n• Morning: ${day.morning.activity}\n• Afternoon: ${day.afternoon.activity}\n• Evening: ${day.evening.activity}\n`
      )
      .join('\n')}`;

    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(itineraryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 block">
              TravelFinder AI Generator
            </span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Generate My Itinerary for {destination.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {query.fromCity} → {destination.name} · {query.durationDays} Days · {query.month} · Budget: {formatINR(query.budget)}
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Preferences Section */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
            1. Select Trip Style & Pace
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {vibeOptions.map((vibe) => (
              <button
                key={vibe.id}
                onClick={() => {
                  setSelectedVibe(vibe.id);
                  setHasGenerated(false);
                }}
                className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                  selectedVibe === vibe.id
                    ? 'bg-teal-50/80 border-teal-500 text-teal-950 ring-2 ring-teal-500/20'
                    : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200 text-slate-700'
                }`}
              >
                <span className="text-lg">{vibe.icon}</span>
                <div>
                  <span className="text-xs font-bold block">{vibe.label}</span>
                  <span className="text-[11px] text-slate-500">{vibe.desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Morning Pace */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
              2. Morning Wake-up Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setStartTime('leisure')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                  startTime === 'leisure'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                ☕ Leisure (9:00 AM)
              </button>
              <button
                onClick={() => setStartTime('early')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                  startTime === 'early'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                🌅 Early Bird (7:00 AM)
              </button>
            </div>
          </div>

          {/* Food Focus */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block mb-2">
              3. Food Preference
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setDietary('all')}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all text-center cursor-pointer ${
                  dietary === 'all'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                All Food
              </button>
              <button
                onClick={() => setDietary('veg')}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all text-center cursor-pointer ${
                  dietary === 'veg'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                Pure Veg
              </button>
              <button
                onClick={() => setDietary('cafe')}
                className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all text-center cursor-pointer ${
                  dietary === 'cafe'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                Cafes
              </button>
            </div>
          </div>
        </div>

        {/* Action to Generate or Regenerate */}
        <div className="pt-2">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full h-12"
          >
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                <span>Customizing Itinerary for {query.month}...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                <span>{hasGenerated ? 'Re-generate My Itinerary' : 'Generate My Itinerary'}</span>
              </>
            )}
          </Button>
        </div>

        {errorMsg && (
          <div className="p-3 text-xs font-bold text-red-700 bg-red-50 border border-red-200 rounded-xl text-center">
            {errorMsg}
          </div>
        )}

        {/* Output Preview */}
        {hasGenerated && (
          <div className="border border-teal-200 bg-teal-50/40 rounded-2xl p-5 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 block">
                  Tailored Plan Generated
                </span>
                <h4 className="text-base font-bold text-slate-900">
                  {destination.name} • {query.durationDays} Days ({selectedVibe.toUpperCase()} MODE)
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-lg bg-white border border-teal-200 text-teal-800 text-xs font-bold flex items-center gap-1 hover:bg-teal-50 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Day highlights */}
            <div className="space-y-3 pt-2">
              {generatedItinerary?.map((day) => (
                <div key={day.dayNumber} className="bg-white rounded-xl p-3.5 border border-slate-200/80 text-xs">
                  <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                    <span>Day {day.dayNumber}: {day.title}</span>
                    <span className="text-teal-700 text-[11px] font-semibold">{day.theme}</span>
                  </div>
                  <ul className="text-slate-600 space-y-1 pl-1">
                    <li>• <strong>Morning ({startTime === 'early' ? '7:30 AM' : '9:30 AM'}):</strong> {day.morning.activity}</li>
                    <li>• <strong>Afternoon:</strong> {day.afternoon.activity}</li>
                    <li>• <strong>Evening:</strong> {day.evening.activity}</li>
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
