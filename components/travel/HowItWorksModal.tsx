'use client';

import React from 'react';
import { HelpCircle, Sparkles, Train, Building, Utensils, Car, Camera } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

export interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  const steps = [
    {
      number: '01',
      title: 'Define Your Constraints First',
      description:
        'Instead of picking a destination blindly and experiencing budget shock later, start with what you can actually afford, where you live, and how many friends are joining.',
    },
    {
      number: '02',
      title: 'Transparent 5-Pillar Cost Modeling',
      description:
        'TravelFinder calculates complete on-ground expenses: Return transport (train/bus/flight), rooms (based on actual group occupancy), daily food, local scooter/autos, and sight entry tickets.',
    },
    {
      number: '03',
      title: 'Dynamic Customization & AI Routing',
      description:
        'Switch between backpacker hostels or comfortable boutique resorts, choose between sleeper trains or direct flights, and synthesize custom day-by-day itineraries tailored to your pace.',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-600">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 block">
              How TravelFinder Works
            </span>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">The Budget-First Travel Engine</h2>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="space-y-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80"
            >
              <span className="w-9 h-9 rounded-xl bg-teal-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                {step.number}
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Cost breakdown breakdown info */}
        <div className="bg-teal-50/70 border border-teal-200/80 rounded-2xl p-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900 mb-3 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-700" />
            <span>The 5 Pillars We Calculate for Every Indian Trip</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
            <div className="flex items-center gap-2">
              <Train className="w-4 h-4 text-teal-600" />
              <span><strong>Transport:</strong> IRCTC 3AC / Volvo sleeper / Flights</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-teal-600" />
              <span><strong>Stay:</strong> Homestays, resorts or hostels</span>
            </div>
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-teal-600" />
              <span><strong>Food:</strong> Regional meals, street food & cafes</span>
            </div>
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-teal-600" />
              <span><strong>Local Transport:</strong> Scooters, fuel & autos</span>
            </div>
            <div className="flex items-center gap-2 sm:col-span-2">
              <Camera className="w-4 h-4 text-teal-600" />
              <span><strong>Activities:</strong> Monument entries, boat rides & cultural sights</span>
            </div>
          </div>
        </div>

        <div className="text-center pt-2">
          <Button
            variant="secondary"
            onClick={onClose}
            className="bg-slate-900 hover:bg-slate-800 text-white"
          >
            Got It, Start Exploring
          </Button>
        </div>
      </div>
    </Modal>
  );
};
