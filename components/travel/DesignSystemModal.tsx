'use client';

import React, { useState } from 'react';
import {
  X,
  LayoutGrid,
  Palette,
  Type,
  Layers,
  Compass,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

interface DesignSystemModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

export const DesignSystemModal: React.FC<DesignSystemModalProps> = ({ isOpen = false, onClose }) => {
  const [activeSection, setActiveSection] = useState<
    'concept' | 'system' | 'components' | 'architecture' | 'ux'
  >('concept');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-4">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 block">
                Senior Product Design Specification
              </span>
              <h2 className="text-xl font-black tracking-tight">TravelFinder Product & Design System</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors focus:outline-hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 px-4 sm:px-6 bg-slate-50 overflow-x-auto scrollbar-none gap-2 sm:gap-4">
          <button
            onClick={() => setActiveSection('concept')}
            className={`py-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
              activeSection === 'concept'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Design Concept & Philosophy
          </button>
          <button
            onClick={() => setActiveSection('system')}
            className={`py-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
              activeSection === 'system'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Design System Tokens
          </button>
          <button
            onClick={() => setActiveSection('components')}
            className={`py-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
              activeSection === 'components'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Reusable Components
          </button>
          <button
            onClick={() => setActiveSection('architecture')}
            className={`py-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
              activeSection === 'architecture'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            4. Information Architecture
          </button>
          <button
            onClick={() => setActiveSection('ux')}
            className={`py-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 ${
              activeSection === 'ux'
                ? 'border-teal-600 text-teal-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            5. Key UX Rationale
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-5 sm:p-7 max-h-[68vh] overflow-y-auto text-xs space-y-6">
          {activeSection === 'concept' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Overall Product & Visual Concept</h3>
                <p className="text-slate-700 leading-relaxed mb-3">
                  TravelFinder solves the <strong>&ldquo;Destination Budget Shock&rdquo;</strong> problem experienced by Indian travelers. Most travel engines require choosing a destination first, only revealing hotel and transit costs at checkout. TravelFinder inverts this workflow into a <strong>budget-first constraint engine</strong>:
                </p>
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-950 font-bold text-center">
                  &ldquo;Give me ₹10,000 and 3 days from Mumbai for 2 people → I will show you where you can realistically travel, eat, sleep, and explore with zero surprises.&rdquo;
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                  <h4 className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Anti-Slop Craft Philosophy</span>
                  </h4>
                  <ul className="space-y-1.5 text-slate-600 pl-1">
                    <li>• No purple-to-cyan SaaS gradients or gimmicky animations</li>
                    <li>• Neutral warm stone canvas with crisp Deep Teal accent</li>
                    <li>• Honest mathematical cost breakdowns (5-pillar modeling)</li>
                    <li>• Mobile-first ergonomics with large tap targets (48px+)</li>
                  </ul>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
                  <h4 className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    <span>Indian Travel Reality</span>
                  </h4>
                  <ul className="space-y-1.5 text-slate-600 pl-1">
                    <li>• Models IRCTC 3AC sleeper trains and AC Volvo buses</li>
                    <li>• Room sharing math (2 people = 1 room; 3 people = 1 room + extra bed)</li>
                    <li>• Real daily food costs (authentic thalis & local tea stalls)</li>
                    <li>• Scooter rental and auto-rickshaw calculations included</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'system' && (
            <div className="space-y-5">
              {/* Color System */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-teal-600" />
                  <span>Color Palette & Contrast Hierarchy</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-teal-600 text-white rounded-xl">
                    <span className="font-bold block">Primary Accent</span>
                    <span className="text-[10px] opacity-90">Deep Teal (#0D9488)</span>
                    <span className="text-[9px] block mt-1">Actions, CTAs, Highlights</span>
                  </div>
                  <div className="p-3 bg-slate-900 text-white rounded-xl">
                    <span className="font-bold block">Dominant Text</span>
                    <span className="text-[10px] opacity-90">Slate 900 (#0F172A)</span>
                    <span className="text-[9px] block mt-1">Headings, Strong Contrast</span>
                  </div>
                  <div className="p-3 bg-emerald-600 text-white rounded-xl">
                    <span className="font-bold block">Budget Fit Indicator</span>
                    <span className="text-[10px] opacity-90">Emerald (#059669)</span>
                    <span className="text-[9px] block mt-1">Within Budget, Savings</span>
                  </div>
                  <div className="p-3 bg-amber-500 text-white rounded-xl">
                    <span className="font-bold block">Budget Stretch</span>
                    <span className="text-[10px] opacity-90">Warm Amber (#D97706)</span>
                    <span className="text-[9px] block mt-1">Exceeds Budget Buffer</span>
                  </div>
                </div>
              </div>

              {/* Typography Scale */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <Type className="w-4 h-4 text-teal-600" />
                  <span>Typography Scale & Font Pairing</span>
                </h3>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between border-b border-slate-200/60 pb-1.5 font-bold">
                    <span>Role</span>
                    <span>Font Size / Weight / Leading</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Display / Hero</span>
                    <span>32px–48px (font-black, leading-tight)</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Section H1 / H2</span>
                    <span>20px–28px (font-extrabold, tracking-tight)</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Card Prices</span>
                    <span>24px–30px (font-black, en-IN formatting)</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Form Labels & Eyebrows</span>
                    <span>11px–12px (font-bold, uppercase tracking-wider)</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Body Copy</span>
                    <span>13px–14px (font-medium, line-height 1.6)</span>
                  </div>
                </div>
              </div>

              {/* Spatial System */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h4 className="font-bold text-slate-900 mb-1">Border Radius Hierarchy</h4>
                  <ul className="text-slate-600 space-y-1">
                    <li>• <strong>Outer Cards & Modals:</strong> rounded-2xl to rounded-3xl (16px–24px)</li>
                    <li>• <strong>Form Inputs & Selects:</strong> rounded-xl (12px)</li>
                    <li>• <strong>Buttons & Chips:</strong> rounded-lg to rounded-full (8px–9999px)</li>
                  </ul>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h4 className="font-bold text-slate-900 mb-1">Elevation & Shadows</h4>
                  <ul className="text-slate-600 space-y-1">
                    <li>• <strong>Base Cards:</strong> Subtle border + shadow-2xs</li>
                    <li>• <strong>Interactive Hover:</strong> shadow-md + border-teal-500/50</li>
                    <li>• <strong>Floating Overlays:</strong> shadow-2xl + backdrop-blur-md</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'components' && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-600" />
                <span>Reusable UI Component Catalog</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-900 block mb-1">1. SearchForm & LocationInput</span>
                  <p className="text-slate-600 text-[11px]">
                    Multi-variable constraint selector supporting starting city, budget presets, traveler counters, duration steppers, and travel months.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-900 block mb-1">2. DestinationCard & BudgetBadge</span>
                  <p className="text-slate-600 text-[11px]">
                    Dual-mode card (grid and list) featuring hero image, 5-pillar mini breakdown, total estimated cost, and real-time budget fit indicator.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-900 block mb-1">3. BudgetBreakdown & CostCustomizer</span>
                  <p className="text-slate-600 text-[11px]">
                    Interactive breakdown table that dynamically recalculates total trip cost as travelers switch stay tiers (Hostel vs Resort) or transport modes.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-900 block mb-1">4. DayPlan Timeline Accordion</span>
                  <p className="text-slate-600 text-[11px]">
                    Structured day-by-day itinerary component with morning, afternoon, and evening checkpoints, food recommendations, and sunset highlights.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-900 block mb-1">5. AiItineraryModal</span>
                  <p className="text-slate-600 text-[11px]">
                    Customization drawer allowing travelers to tune travel pace, wake-up schedule, dietary restrictions, and generate tailored exportable plans.
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="font-bold text-slate-900 block mb-1">6. SavedTrips & Side-by-Side Matrix</span>
                  <p className="text-slate-600 text-[11px]">
                    Local persistence storage allowing travelers to bookmark multiple destinations and compare them side-by-side across cost and transit.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'architecture' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Compass className="w-4 h-4 text-teal-600" />
                <span>Information Architecture & User Flow</span>
              </h3>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center shrink-0">1</span>
                  <div>
                    <strong className="text-slate-900">Homepage Constraint Entry:</strong>
                    <span className="text-slate-600 block">User inputs Starting City, Total Budget, Travelers count, and Duration. No login required.</span>
                  </div>
                </div>

                <div className="w-0.5 h-4 bg-teal-300 ml-3.5" />

                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center shrink-0">2</span>
                  <div>
                    <strong className="text-slate-900">Affordability Results Feed:</strong>
                    <span className="text-slate-600 block">Immediate display of destinations tagged as &ldquo;Fits your budget (+₹X buffer)&rdquo; or &ldquo;Stretch by ₹Y&rdquo;.</span>
                  </div>
                </div>

                <div className="w-0.5 h-4 bg-teal-300 ml-3.5" />

                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center shrink-0">3</span>
                  <div>
                    <strong className="text-slate-900">Transparent Destination Deep Dive:</strong>
                    <span className="text-slate-600 block">Explore 5-pillar cost model, toggle stay/transit styles, view 3-day itinerary, and local food guides.</span>
                  </div>
                </div>

                <div className="w-0.5 h-4 bg-teal-300 ml-3.5" />

                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center shrink-0">4</span>
                  <div>
                    <strong className="text-slate-900">AI Itinerary & Saved Trips Comparison:</strong>
                    <span className="text-slate-600 block">Generate customized pace itineraries, bookmark multiple options, and compare matrices side-by-side.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'ux' && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Senior Product Designer UX Decisions</span>
              </h3>

              <div className="space-y-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h4 className="font-bold text-slate-900 mb-1">1. Why No Required Account Creation?</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Requiring sign-up before discovery creates a 70%+ drop-off. Users must experience the immediate value of seeing which Indian destinations they can afford before any commitment. Bookmarks persist seamlessly in local client storage.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h4 className="font-bold text-slate-900 mb-1">2. Why 5-Pillar Modeling Instead of Flight Only?</h4>
                  <p className="text-slate-600 leading-relaxed">
                    A ₹3,000 flight to Goa often ends up costing ₹18,000 once taxis, beach shacks, resort rooms, and water sports are added. Transparently showing the 5 pillars (Transport + Stay + Food + Local Transit + Sights) builds immense trust and prevents budget distress.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h4 className="font-bold text-slate-900 mb-1">3. Why Prominent Buffer & Stretch Indicators?</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Instead of binary &ldquo;Allowed / Not Allowed&rdquo;, showing &ldquo;+₹2,200 Buffer Remaining&rdquo; or &ldquo;Stretch by ₹500&rdquo; gives travelers emotional confidence and realistic negotiation space with friends or travel partners.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
