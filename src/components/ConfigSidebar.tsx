import React from 'react';
import {
  MapPin,
  Users,
  Building2,
  ScrollText,
  Church,
  Crown,
  Calendar,
  Sparkles,
  DollarSign,
  Info,
} from 'lucide-react';
import { WeddingConfig, StandingLevel, City, VenueType } from '../types';
import { STANDING_RATES, CITY_TIPS } from '../data/defaultData';
import { formatCurrency } from '../utils/formatters';

interface ConfigSidebarProps {
  config: WeddingConfig;
  onChange: (updated: Partial<WeddingConfig>) => void;
}

const STANDING_OPTIONS: StandingLevel[] = [
  'Économique',
  'Standard / Équilibré',
  'Haut de Gamme / VIP',
];

export const ConfigSidebar: React.FC<ConfigSidebarProps> = ({ config, onChange }) => {
  const currentTip = CITY_TIPS[config.ville] || CITY_TIPS['Autre'];

  return (
    <aside className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="font-bold text-slate-900 text-base">
            Paramètres & Filtres
          </h2>
        </div>
        <span className="text-[11px] font-medium text-slate-600 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
          Mariage
        </span>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* 1. Ville */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            Ville de l'événement
          </label>
          <select
            value={config.ville}
            onChange={(e) => onChange({ ville: e.target.value as City })}
            className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer"
          >
            <option value="Pointe-Noire">Pointe-Noire (Congo)</option>
            <option value="Brazzaville">Brazzaville (Congo)</option>
            <option value="Kinshasa">Kinshasa (RDC)</option>
            <option value="Autre">Autre Ville / Diaspora</option>
          </select>

          {config.ville === 'Autre' && (
            <input
              type="text"
              value={config.customCity}
              onChange={(e) => onChange({ customCity: e.target.value })}
              placeholder="Précisez la ville..."
              className="mt-2 w-full text-xs bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800 focus:outline-none focus:border-amber-500"
            />
          )}

          {currentTip && (
            <p className="mt-1.5 text-[11px] text-slate-600 leading-tight bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-start gap-1.5">
              <Info className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
              <span>{currentTip}</span>
            </p>
          )}
        </div>

        {/* 2. Nombre d'invités */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              Nombre d'invités prévus
            </label>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {config.nbInvites} pers.
            </span>
          </div>

          <input
            type="range"
            min={20}
            max={1000}
            step={10}
            value={config.nbInvites}
            onChange={(e) => onChange({ nbInvites: Number(e.target.value) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
          />

          <div className="flex justify-between items-center text-[10px] text-slate-600 mt-1 font-medium">
            <span>20 (Intimiste)</span>
            <span>200 (Moyen)</span>
            <span>500 (Grand)</span>
            <span>1000+</span>
          </div>

          {/* Quick preset chips */}
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {[80, 150, 200, 300, 500].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => onChange({ nbInvites: count })}
                className={`text-[11px] px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                  config.nbInvites === count
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Type de cadre */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            Type de cadre
          </label>
          <select
            value={config.typeLieu}
            onChange={(e) => onChange({ typeLieu: e.target.value as VenueType })}
            className="w-full text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer"
          >
            <option value="Pelouse / Jardin plein air">Pelouse / Jardin plein air</option>
            <option value="Salle des fêtes VIP">Salle des fêtes VIP</option>
            <option value="Espace mixte">Espace mixte (Salle + Jardin)</option>
          </select>
        </div>

        {/* 4. Options Cérémonies */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="block text-xs font-semibold text-slate-700 mb-1">
            Cérémonies & Rituels
          </span>

          <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={config.inclusCoutumier}
              onChange={(e) => onChange({ inclusCoutumier: e.target.checked })}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 accent-amber-600"
            />
            <div className="text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <ScrollText className="w-3.5 h-3.5 text-amber-600" />
                Mariage Coutumier
              </span>
              <p className="text-[11px] text-slate-500">Dots, traversée, pagnes & réception famille</p>
            </div>
          </label>

          <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={config.inclusReligieux}
              onChange={(e) => onChange({ inclusReligieux: e.target.checked })}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 accent-amber-600"
            />
            <div className="text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Church className="w-3.5 h-3.5 text-blue-600" />
                Célébration Religieuse & Civile
              </span>
              <p className="text-[11px] text-slate-500">Mairie, publication bans & office religieux</p>
            </div>
          </label>
        </div>

        {/* 5. Standing / Gamme */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              Niveau de Prestation
            </label>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                config.standing === 'Haut de Gamme / VIP'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : config.standing === 'Standard / Équilibré'
                  ? 'bg-slate-900 text-white'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
              }`}
            >
              {config.standing}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
            {STANDING_OPTIONS.map((stOption) => (
              <button
                key={stOption}
                type="button"
                onClick={() => onChange({ standing: stOption })}
                className={`py-2 px-1 text-center rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  config.standing === stOption
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {stOption === 'Économique' ? 'Éco' : stOption.startsWith('Standard') ? 'Standard' : 'VIP'}
              </button>
            ))}
          </div>

          {/* Key Rates for this standing */}
          <div className="mt-3 bg-slate-50 rounded-xl p-2.5 border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>Traiteur / Couvert :</span>
              <strong className="text-slate-900 font-semibold">
                {formatCurrency(STANDING_RATES.cout_couvert[config.standing], config.currency)} / pers.
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Lieu & Mobilier de base :</span>
              <strong className="text-slate-900 font-semibold">
                {formatCurrency(STANDING_RATES.cout_lieu[config.standing], config.currency)}
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Décoration & Scénographie :</span>
              <strong className="text-slate-900 font-semibold">
                {formatCurrency(STANDING_RATES.cout_deco[config.standing], config.currency)}
              </strong>
            </div>
          </div>
        </div>

        {/* 6. Date du mariage & Devise */}
        <div className="pt-2 border-t border-slate-100 space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Date prévue du mariage
            </label>
            <input
              type="date"
              value={config.weddingDate}
              onChange={(e) => onChange({ weddingDate: e.target.value })}
              className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:bg-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-slate-500" />
              Affichage des montants
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['XAF', 'EUR', 'USD'] as const).map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => onChange({ currency: curr })}
                  className={`py-1.5 px-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                    config.currency === curr
                      ? 'bg-amber-50 border-amber-300 text-amber-950 shadow-2xs font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {curr === 'XAF' ? 'XAF (FCFA)' : curr}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
