'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2, MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';
import { fetchJson } from '@/lib/fetch-json';

const MapPreview = dynamic(() => import('./MapPreview'), { 
  ssr: false, 
  loading: () => <div className="w-full h-48 sm:h-64 rounded-xl bg-slate-100 animate-pulse border border-slate-200 flex items-center justify-center text-slate-400">Loading Map...</div> 
});

interface LocationSelection {
  name: string;
  lat: number;
  lng: number;
  country: string;
  state?: string;
}

interface MapTilerFeature {
  id: string;
  text: string;
  place_name: string;
  center: [number, number];
  context?: Array<{ id: string; text: string }>;
}

export function DirectDestinationSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<MapTilerFeature[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationSelection | null>(null);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Set when a suggestion is picked, so filling the input with its label
  // doesn't trigger another (pointless) geocode lookup.
  const skipNextLookup = useRef(false);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced geocoding search. Each run aborts the previous request so a
  // slow, stale response can't overwrite suggestions for newer input.
  useEffect(() => {
    const controller = new AbortController();

    if (skipNextLookup.current) {
      skipNextLookup.current = false;
      return;
    }

    const fetchSuggestions = async () => {
      if (query.trim().length < 3) {
        setSuggestions([]);
        return;
      }
      setIsLoadingSuggestions(true);
      try {
        const res = await fetchJson<{ features?: MapTilerFeature[] }>(
          `/api/geocode?q=${encodeURIComponent(query.trim().slice(0, 50))}`,
          { signal: controller.signal, timeoutMs: 10_000 }
        );
        if (res.ok && res.data?.features) {
          setSuggestions(res.data.features);
        } else if (res.status === 429) {
          setSuggestions([]);
          setErrorMsg('Too many searches. Please wait a few seconds and try again.');
        }
      } catch {
        // Aborted because the user kept typing — ignore.
        return;
      }
      setIsLoadingSuggestions(false);
    };

    const debounceTimer = setTimeout(fetchSuggestions, 400);
    return () => {
      clearTimeout(debounceTimer);
      controller.abort();
      setIsLoadingSuggestions(false);
    };
  }, [query]);

  const handleSelect = (feature: MapTilerFeature) => {
    const name = feature.text;
    const lat = feature.center[1];
    const lng = feature.center[0];
    
    // Extract country and state from context
    let country = 'Unknown';
    let state = undefined;
    
    if (feature.context) {
      const countryCtx = feature.context.find((c: { id: string }) => c.id.startsWith('country'));
      if (countryCtx) country = countryCtx.text;
      
      const regionCtx = feature.context.find((c: { id: string }) => c.id.startsWith('region'));
      if (regionCtx) state = regionCtx.text;
    }

    setSelectedLocation({ name, lat, lng, country, state });
    const label = feature.place_name || name;
    // Only skip if the value actually changes (otherwise the effect won't re-run to consume the flag).
    if (label !== query) skipNextLookup.current = true;
    setQuery(label);
    setShowDropdown(false);
    setErrorMsg('');
  };

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedLocation) {
      setErrorMsg('Please select a destination from the dropdown suggestions.');
      return;
    }

    setIsGenerating(true);
    setErrorMsg('');

    try {
      const res = await fetchJson<{ destinationId?: string }>('/api/destinations/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destinationName: selectedLocation.name,
          lat: selectedLocation.lat,
          lng: selectedLocation.lng,
          country: selectedLocation.country,
          state: selectedLocation.state
        }),
        // Generation = OSM lookup + up to two Gemini calls; never spin forever.
        timeoutMs: 150_000,
      });

      if (!res.ok) {
        if (res.timedOut) setErrorMsg('This is taking longer than expected. Please try again in a moment.');
        else if (res.status === 0) setErrorMsg('Network error. Please check your connection.');
        else if (res.status === 404) setErrorMsg("We couldn't find that destination. Please try another place.");
        else if (res.status === 429 || res.status === 503 || res.status === 504 || res.status === 400) {
          setErrorMsg(res.error || 'Please try again in a little while.');
        } else setErrorMsg('Something went wrong while discovering this destination. Please try again.');
        setIsGenerating(false);
        return;
      }

      if (!res.data?.destinationId) {
        setErrorMsg('Something went wrong while discovering this destination. Please try again.');
        setIsGenerating(false);
        return;
      }

      // Keep the button in its loading state while the destination page loads.
      router.push(`/destination/${encodeURIComponent(res.data.destinationId)}`);
    } catch {
      setErrorMsg('Something went wrong. Please try again.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-lg shadow-slate-900/5 p-4 sm:p-6 lg:p-7">
      <div className="mb-4">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Search className="w-5 h-5 text-teal-600" />
          Where do you want to go?
        </h2>
        <p className="text-sm text-slate-500 mt-1">Search any place worldwide to discover an itinerary and cost estimate.</p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-3">
          <div className="flex-1 relative" ref={dropdownRef}>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowDropdown(true);
                  if (errorMsg) setErrorMsg('');
                  if (selectedLocation) setSelectedLocation(null);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="e.g. Munnar, Paris, Bali, Tokyo..."
                disabled={isGenerating}
                className="w-full h-14 pl-12 pr-4 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 font-semibold text-base rounded-xl border border-slate-300 focus:border-teal-600 focus:ring-2 focus:ring-teal-500/20 focus:outline-hidden transition-all placeholder:text-slate-400 placeholder:font-normal disabled:opacity-70 disabled:cursor-not-allowed"
              />
              {isLoadingSuggestions && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
                </div>
              )}
            </div>

            {/* Dropdown Suggestions */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
                {suggestions.map((feature, idx) => (
                  <button
                    key={feature.id || idx}
                    type="button"
                    onClick={() => handleSelect(feature)}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 transition-colors flex items-start gap-3"
                  >
                    <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-semibold text-slate-800">{feature.text}</div>
                      <div className="text-xs text-slate-500 line-clamp-1">{feature.place_name}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {errorMsg && (
              <p className="text-red-500 text-sm mt-2 font-medium pl-1">{errorMsg}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isGenerating || !selectedLocation}
            className="h-14 px-8 rounded-xl bg-slate-900 hover:bg-black active:scale-[0.99] text-white font-bold text-sm tracking-wide shadow-md shadow-slate-900/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Discovering...</span>
              </>
            ) : (
              <span>Generate Itinerary</span>
            )}
          </button>
        </div>
        
        {/* Map Preview */}
        {selectedLocation && (
          <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <MapPreview lat={selectedLocation.lat} lng={selectedLocation.lng} name={selectedLocation.name} />
          </div>
        )}
      </form>
    </div>
  );
}
