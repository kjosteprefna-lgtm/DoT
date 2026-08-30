import React from 'react';
import { Users, Wallet, ShieldAlert, Sparkles, UserCheck } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface KPISummaryProps {
  nbInvites: number;
  totalDirect: number;
  reserveImprevus: number;
  totalGeneral: number;
  currency: string;
}

export const KPISummary: React.FC<KPISummaryProps> = ({
  nbInvites,
  totalDirect,
  reserveImprevus,
  totalGeneral,
  currency,
}) => {
  const costPerGuest = nbInvites > 0 ? Math.round(totalDirect / nbInvites) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Invités */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Nombre d'Invités
          </span>
          <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
            {nbInvites} <span className="text-sm font-sans font-medium text-slate-500">pers.</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-slate-600" />
            Capacité traiteur & mobilier
          </p>
        </div>
      </div>

      {/* Card 2: Budget Direct */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Budget Estimé Direct
          </span>
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-serif">
            {formatCurrency(totalDirect, currency)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Hors réserve (~{formatCurrency(costPerGuest, currency)}/invité)
          </p>
        </div>
      </div>

      {/* Card 3: Réserve Imprévus */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Réserve Sécurité (10%)
          </span>
          <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold text-amber-700 font-serif">
            {formatCurrency(reserveImprevus, currency)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Garantie aléas & imprévus de dernière minute
          </p>
        </div>
      </div>

      {/* Card 4: Budget Global Recommandé */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 text-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-800 relative overflow-hidden flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
            Budget Recommandé (+10%)
          </span>
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold text-amber-200 font-serif">
            {formatCurrency(totalGeneral, currency)}
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Budget total prévisionnel complet
          </p>
        </div>
      </div>
    </div>
  );
};
