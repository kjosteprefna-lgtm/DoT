import React, { useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  Share2,
  Printer,
  Copy,
  Check,
  Sparkles,
  FileText,
  Mail,
} from 'lucide-react';
import { BudgetItem, Milestone, WeddingConfig } from '../types';
import {
  formatCurrency,
  generateCSV,
  downloadCSVFile,
  generateShareableWhatsAppText,
  computeBudgetTotals,
} from '../utils/formatters';

interface ExportPanelProps {
  items: BudgetItem[];
  milestones: Milestone[];
  config: WeddingConfig;
  totals: {
    directTotal: number;
    reserveImprevus: number;
    totalGeneral: number;
    totalPaid: number;
    remainingToPay: number;
  };
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  items,
  milestones,
  config,
  totals,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedMail, setCopiedMail] = useState(false);

  const handleDownloadCSV = () => {
    const csvContent = generateCSV(items, config);
    downloadCSVFile(csvContent, 'simulation_budget_mariage.csv');
  };

  const handleCopyWhatsApp = () => {
    const text = generateShareableWhatsAppText(config, items, totals);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 font-serif mb-1">
          Exporter & Partager vos Données
        </h3>
        <p className="text-xs sm:text-sm text-slate-500">
          Téléchargez votre tableau de suivi au format tableur, générez une fiche imprimable ou
          partagez le récapitulatif complet sur WhatsApp avec votre comité d’organisation.
        </p>

        {/* 3 Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {/* Card 1: Download CSV */}
          <div className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between transition-all group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                Fichier CSV / Excel
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Générez le fichier tableur officiel compatible Excel, Google Sheets et Numbers avec
                les formules et postes détaillés.
              </p>
            </div>

            <button
              onClick={handleDownloadCSV}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs py-2.5 px-3 rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4" />
              Télécharger .CSV
            </button>
          </div>

          {/* Card 2: Copy WhatsApp Summary */}
          <div className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between transition-all group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Share2 className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                Partage WhatsApp & SMS
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Copiez un message formaté avec puces, émojis et totaux pour l'envoyer directement au
                conjoint ou au comité de pilotage.
              </p>
            </div>

            <button
              onClick={handleCopyWhatsApp}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 px-3 rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  Copié dans le presse-papier !
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copier le texte récapitulatif
                </>
              )}
            </button>
          </div>

          {/* Card 3: Print / PDF Sheet */}
          <div className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between transition-all group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-amber-200">
                <Printer className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                Fiche Imprimable / PDF
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Affichez un rapport épuré au format A4 prêt à être imprimé ou sauvegardé en PDF
                pour vos réunions de famille.
              </p>
            </div>

            <button
              onClick={handlePrint}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs py-2.5 px-3 rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              <Printer className="w-4 h-4" />
              Imprimer / Sauvegarder PDF
            </button>
          </div>
        </div>
      </div>

      {/* Live Preview of the Official Summary Sheet */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs print:border-none print:shadow-none">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <span className="text-[11px] font-bold tracking-widest text-amber-700 uppercase">
              Rapport Officiel de Simulation
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
              {config.coupleNames || 'Mariage 2026'}
            </h3>
            <p className="text-xs text-slate-500">
              {config.ville === 'Autre' ? config.customCity || 'Autre' : config.ville} •{' '}
              {config.nbInvites} invités • Gamme {config.standing}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500 block">Budget Global</span>
            <strong className="text-xl font-bold text-slate-900 font-serif">
              {formatCurrency(totals.totalGeneral, config.currency)}
            </strong>
          </div>
        </div>

        {/* Printable items list */}
        <div className="mt-5 space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Détail des Postes Chiffrés
          </h4>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
            {items.map((item) => {
              const amount = item.customAmount !== undefined ? item.customAmount : item.baseAmount;
              return (
                <div key={item.id} className="p-2.5 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <span className="font-semibold text-slate-900">{item.rubric}</span>
                    <span className="text-slate-500 mx-2">—</span>
                    <span className="text-slate-700">{item.item}</span>
                  </div>
                  <strong className="font-mono text-slate-900 font-bold">
                    {formatCurrency(amount, config.currency)}
                  </strong>
                </div>
              );
            })}
          </div>
        </div>

        {/* Totals box */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
          <div className="flex justify-between text-slate-600">
            <span>Total Direct (Hors Réserve) :</span>
            <strong className="font-mono text-slate-900">
              {formatCurrency(totals.directTotal, config.currency)}
            </strong>
          </div>
          <div className="flex justify-between text-amber-800">
            <span>Réserve de Sécurité (+10%) :</span>
            <strong className="font-mono">
              +{formatCurrency(totals.reserveImprevus, config.currency)}
            </strong>
          </div>
          <div className="flex justify-between text-sm font-bold text-slate-950 pt-1.5 border-t border-slate-200">
            <span className="font-serif">Budget Global Recommandé :</span>
            <span className="font-mono text-amber-700">
              {formatCurrency(totals.totalGeneral, config.currency)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
