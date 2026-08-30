import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Circle,
  TrendingUp,
  Tag,
  Gift,
  Tv,
  Flame,
  Music,
  Clock,
  HeartHandshake,
} from 'lucide-react';
import { IDEES_PLUS_MEILLEUR } from '../data/defaultData';
import { WeddingConfig } from '../types';

interface BestIdeasPanelProps {
  config: WeddingConfig;
}

export const BestIdeasPanel: React.FC<BestIdeasPanelProps> = ({ config }) => {
  const [selectedIdeas, setSelectedIdeas] = useState<Record<string, boolean>>({
    idea1: true,
    idea2: true,
    idea3: true,
    idea4: true,
    idea5: true,
    idea6: true,
    idea7: true,
  });

  const toggleIdea = (id: string) => {
    setSelectedIdeas((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const activeCount = Object.values(selectedIdeas).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Conseils & Idées "Plus Meilleur"
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {activeCount} / {IDEES_PLUS_MEILLEUR.length} retenues
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif mt-1">
            7 Concepts Exclusifs pour Sublimer votre Mariage
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Des idées originales et éprouvées pour impressionner vos 400 invités et créer une expérience inoubliable pour {config.coupleNames}.
          </p>
        </div>
      </div>

      {/* Grid of the 7 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {IDEES_PLUS_MEILLEUR.map((idea) => {
          const isChecked = !!selectedIdeas[idea.id];
          return (
            <div
              key={idea.id}
              onClick={() => toggleIdea(idea.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isChecked
                  ? 'bg-white border-amber-300 ring-1 ring-amber-200 shadow-xs'
                  : 'bg-slate-50/60 border-slate-200 hover:border-slate-300 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-2 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                      {idea.icon}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 font-mono block">
                        {idea.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        {idea.title}
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="text-slate-400 hover:text-amber-600 transition-colors p-1"
                    title={isChecked ? 'Désélectionner cette idée' : 'Retenir cette idée'}
                  >
                    {isChecked ? (
                      <CheckCircle2 className="w-5 h-5 text-amber-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300" />
                    )}
                  </button>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed mt-3">
                  {idea.description}
                </p>

                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-0.5">
                  <strong className="text-slate-900 font-semibold flex items-center gap-1">
                    ✨ Impact Invités :
                  </strong>
                  <p>{idea.benefit}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
                <span className="text-[11px] text-slate-500 font-medium">Budget indicatif :</span>
                <span className="font-bold text-slate-900 font-mono bg-slate-100 px-2 py-0.5 rounded-md">
                  {idea.estimatedCost}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
