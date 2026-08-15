import React from 'react';
import { ShieldCheck, Receipt, Train } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const trustPillars = [
    {
      icon: <Receipt className="w-5 h-5 text-teal-600" />,
      title: 'Complete 5-Pillar Cost Modeling',
      description:
        'Unlike flight-only engines, TravelFinder provides realistic budget estimates across transport, stay, food, local transport, and key activities.',
    },
    {
      icon: <Train className="w-5 h-5 text-teal-600" />,
      title: 'Realistic Transit Route Estimates',
      description:
        'Trip cost estimates based on IRCTC 3AC sleeper trains, AC Volvo buses, and domestic flights mapped directly from your selected starting city.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-teal-600" />,
      title: 'Transparent Budget Estimates',
      description:
        'Clear, estimated trip costs and practical budget breakdowns to help you discover destinations that fit your target spending.',
    },
  ];

  return (
    <section id="trust-value-section" className="w-full my-8 sm:my-10">
      <div className="bg-slate-100/70 border border-slate-200/80 rounded-2xl p-5 sm:p-7">
        <div className="text-center max-w-2xl mx-auto mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-teal-800 mb-1">
            Why Budget-First Discovery Works
          </h2>
          <p className="text-slate-600 text-sm">
            Discover destinations tailored to your budget with realistic estimates for transport, stay, food, and activities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {trustPillars.map((item, idx) => (
            <div
              key={idx}
              id={`trust-pillar-${idx}`}
              className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/60 shadow-2xs flex flex-col"
            >
              <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center mb-3">
                {item.icon}
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1.5">{item.title}</h3>
              <p className="text-xs leading-relaxed text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
