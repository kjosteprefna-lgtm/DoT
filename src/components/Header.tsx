import React, { useState } from 'react';
import { Sparkles, Calendar, Heart, RotateCcw, PartyPopper, Cloud, RefreshCw, WifiOff, Smartphone, Share2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WeddingConfig } from '../types';
import { ShareModal } from './ShareModal';

interface HeaderProps {
  config: WeddingConfig;
  onChangeConfig: (newConfig: WeddingConfig) => void;
  onReset: () => void;
  syncStatus?: 'synced' | 'saving' | 'offline' | 'loading';
  lastSyncTime?: string;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  onChangeConfig,
  onReset,
  syncStatus = 'synced',
  lastSyncTime = '',
}) => {
  const [isEditingNames, setIsEditingNames] = useState(false);
  const [names, setNames] = useState(config.coupleNames);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#d97706', '#0f172a', '#3b82f6', '#10b981'],
    });
  };

  const handleSaveNames = () => {
    onChangeConfig({ ...config, coupleNames: names || 'Les Futurs Mariés' });
    setIsEditingNames(false);
  };

  // Calculate days remaining to wedding date
  const getDaysRemaining = () => {
    if (!config.weddingDate) return null;
    const target = new Date(config.weddingDate).getTime();
    const today = new Date().getTime();
    const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo and Main Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-2xl shadow-xs shrink-0">
              💒
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-serif">
                  Simulateur & Planner Intelligent de Mariage
                </h1>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100/80 text-amber-900 border border-amber-300">
                  Version 2026 Pro
                </span>
                
                {/* Cloud Sync Status Badge */}
                <div
                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all ${
                    syncStatus === 'synced'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : syncStatus === 'saving'
                      ? 'bg-blue-50 text-blue-800 border border-blue-200 animate-pulse'
                      : syncStatus === 'loading'
                      ? 'bg-slate-100 text-slate-700 border border-slate-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                  title={lastSyncTime ? `Dernière sauvegarde Cloud à ${lastSyncTime}` : 'Synchronisation Cloud active'}
                >
                  {syncStatus === 'synced' && (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
                      <span>☁️ Synchronisé en direct</span>
                    </>
                  )}
                  {syncStatus === 'saving' && (
                    <>
                      <RefreshCw className="w-3 h-3 text-blue-600 animate-spin" />
                      <span>Enregistrement Cloud...</span>
                    </>
                  )}
                  {syncStatus === 'loading' && (
                    <>
                      <Cloud className="w-3 h-3 text-slate-500" />
                      <span>Connexion Cloud...</span>
                    </>
                  )}
                  {syncStatus === 'offline' && (
                    <>
                      <WifiOff className="w-3 h-3 text-amber-600" />
                      <span>Mode local (Hors-ligne)</span>
                    </>
                  )}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Estimation budgétaire sur-mesure, rétroplanning interactif et gestion des dépenses
              </p>
            </div>
          </div>

          {/* Couple & Date Header Widget */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap justify-between md:justify-end no-print">
            {/* Couple names button */}
            <div className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 flex items-center gap-2 transition-colors">
              <Heart className="w-4 h-4 text-amber-600 fill-amber-500 shrink-0" />
              {isEditingNames ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={names}
                    onChange={(e) => setNames(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveNames()}
                    className="text-xs sm:text-sm bg-white border border-slate-300 rounded px-1.5 py-0.5 w-32 focus:outline-amber-500"
                    placeholder="Ex: Sarah & Junior"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveNames}
                    className="text-xs bg-amber-600 text-white px-2 py-0.5 rounded font-medium hover:bg-amber-700 cursor-pointer"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingNames(true)}
                  className="text-xs sm:text-sm font-semibold text-slate-800 hover:text-amber-600 transition-colors text-left cursor-pointer"
                  title="Cliquez pour personnaliser les noms"
                >
                  {config.coupleNames || 'Personnaliser les noms'}
                </button>
              )}
            </div>

            {/* Wedding Date Countdown */}
            {config.weddingDate && (
              <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-xs text-amber-900 font-medium">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>
                  {new Date(config.weddingDate).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                {daysRemaining !== null && (
                  <span className="ml-1 bg-amber-200/80 text-amber-950 px-1.5 py-0.2 rounded-md font-bold text-[11px]">
                    {daysRemaining > 0 ? `J-${daysRemaining}` : daysRemaining === 0 ? 'Jour J !' : 'Passé'}
                  </span>
                )}
              </div>
            )}

            {/* Partager / Installer Android App */}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              title="Partager le lien ou installer sur Android"
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>Partager / Android</span>
            </button>

            {/* Confetti celebration button */}
            <button
              onClick={handleConfetti}
              className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors cursor-pointer"
              title="Célébrer !"
              aria-label="Célébrer"
            >
              <PartyPopper className="w-4 h-4" />
            </button>

            {/* Reset Defaults */}
            <button
              onClick={onReset}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition-colors cursor-pointer"
              title="Réinitialiser les paramètres par défaut"
              aria-label="Réinitialiser"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Share / Mobile App Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </header>
  );
};
