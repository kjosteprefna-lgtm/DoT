import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Trash2,
  Share2,
  FileSpreadsheet,
  Check,
  Sparkles,
  HelpCircle,
  AlertCircle,
  Coins,
  ShieldAlert,
  Users,
  Heart,
  Save,
} from 'lucide-react';
import { DoteItem, DoteStatus, WeddingConfig } from '../types';
import { formatCurrency } from '../utils/formatters';

interface DoteManagerProps {
  doteItems: DoteItem[];
  config: WeddingConfig;
  onChangeRate: (rate: number) => void;
  onUpdateDoteItem: (id: string, updates: Partial<DoteItem>) => void;
  onAddDoteItem: (newItem: DoteItem) => void;
  onDeleteDoteItem: (id: string) => void;
  onResetDoteItems: () => void;
}

const STATUS_CONFIG: Record<
  DoteStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  'À acheter': {
    label: 'À acheter',
    bg: 'bg-amber-50',
    text: 'text-amber-900 font-bold',
    border: 'border-amber-200',
  },
  'En réserve': {
    label: 'En réserve',
    bg: 'bg-blue-50',
    text: 'text-blue-800 font-semibold',
    border: 'border-blue-200',
  },
  'Réserve cash': {
    label: 'Réserve cash',
    bg: 'bg-purple-50',
    text: 'text-purple-800 font-semibold',
    border: 'border-purple-200',
  },
  'Négocié': {
    label: 'Négocié',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800 font-semibold',
    border: 'border-emerald-200',
  },
  'Payé / Acheté': {
    label: 'Payé / Acheté',
    bg: 'bg-teal-50',
    text: 'text-teal-800 font-semibold',
    border: 'border-teal-200',
  },
};

export const DoteManager: React.FC<DoteManagerProps> = ({
  doteItems,
  config,
  onChangeRate,
  onUpdateDoteItem,
  onAddDoteItem,
  onDeleteDoteItem,
  onResetDoteItems,
}) => {
  const [copied, setCopied] = useState(false);
  const [addingCategory, setAddingCategory] = useState<'papa' | 'maman' | 'imprevus' | null>(null);
  const [newArticle, setNewArticle] = useState('');
  const [newUsd, setNewUsd] = useState(50);
  const [newNote, setNewNote] = useState('');
  const [newStatus, setNewStatus] = useState<DoteStatus>('À acheter');

  const rate = config.usdToXafRate || 600;

  // Filter items by category
  const papaItems = doteItems.filter((i) => i.category === 'papa');
  const mamanItems = doteItems.filter((i) => i.category === 'maman');
  const imprevusItems = doteItems.filter((i) => i.category === 'imprevus');

  // Compute Subtotals
  const totPapaUsd = papaItems.reduce((sum, item) => sum + (Number(item.usd) || 0), 0);
  const totPapaXaf = totPapaUsd * rate;

  const totMamanUsd = mamanItems.reduce((sum, item) => sum + (Number(item.usd) || 0), 0);
  const totMamanXaf = totMamanUsd * rate;

  const totImprUsd = imprevusItems.reduce((sum, item) => sum + (Number(item.usd) || 0), 0);
  const totImprXaf = totImprUsd * rate;

  const totGlobalUsd = totPapaUsd + totMamanUsd + totImprUsd;
  const totGlobalXaf = totGlobalUsd * rate;

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addingCategory || !newArticle.trim()) return;

    const count = doteItems.filter((i) => i.category === addingCategory).length + 1;
    const catCode = addingCategory === 'papa' ? '1' : addingCategory === 'maman' ? '2' : '3';

    const newItem: DoteItem = {
      id: `custom_dote_${Date.now()}`,
      code: `${catCode}.${count}`,
      category: addingCategory,
      article: newArticle.trim(),
      usd: Number(newUsd) || 0,
      statut: newStatus,
      note: newNote.trim(),
      isCustom: true,
    };

    onAddDoteItem(newItem);
    setNewArticle('');
    setNewUsd(50);
    setNewNote('');
    setAddingCategory(null);
  };

  const handleExportCSV = () => {
    const headers = ['Catégorie', 'Code', 'Article / Désignation', 'Prix (USD)', 'Prix (XAF)', 'Statut', 'Notes'];
    const rows = doteItems.map((item) => {
      const catLabel = item.category === 'papa' ? 'Côté Papa' : item.category === 'maman' ? 'Côté Maman' : 'Imprévus & Logistique';
      const xaf = Math.round(item.usd * rate);
      return [
        `"${catLabel}"`,
        `"${item.code}"`,
        `"${item.article.replace(/"/g, '""')}"`,
        item.usd,
        xaf,
        `"${item.statut}"`,
        `"${(item.note || '').replace(/"/g, '""')}"`,
      ];
    });

    // Add totals row
    rows.push(['"TOTAL CÔTÉ PAPA"', '""', '""', totPapaUsd, totPapaXaf, '""', '""']);
    rows.push(['"TOTAL CÔTÉ MAMAN"', '""', '""', totMamanUsd, totMamanXaf, '""', '""']);
    rows.push(['"TOTAL IMPRÉVUS"', '""', '""', totImprUsd, totImprXaf, '""', '""']);
    rows.push(['"TOTAL GÉNÉRAL DOTE"', '""', '""', totGlobalUsd, totGlobalXaf, '""', '""']);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Facture_Dote_${config.coupleNames.replace(/\s+/g, '_')}_2026.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyWhatsApp = () => {
    let msg = `💍 *FACTURE OFFICIELLE & BUDGET DOTE COUTUMIÈRE*\n`;
    msg += `👰 *Mariage :* ${config.coupleNames} (Kasangulu / RDC)\n`;
    msg += `💱 *Taux de conversion :* 1 USD = ${rate.toLocaleString()} XAF\n\n`;

    msg += `👨‍🦳 *1. CÔTÉ PAPA (${totPapaUsd.toLocaleString()}$ / ${totPapaXaf.toLocaleString()} XAF)*\n`;
    papaItems.forEach((it) => {
      msg += `• ${it.code} ${it.article} : *${it.usd}$* (~${(it.usd * rate).toLocaleString()} XAF) [${it.statut}]\n`;
    });

    msg += `\n👩‍🦳 *2. CÔTÉ MAMAN (${totMamanUsd.toLocaleString()}$ / ${totMamanXaf.toLocaleString()} XAF)*\n`;
    mamanItems.forEach((it) => {
      msg += `• ${it.code} ${it.article} : *${it.usd}$* (~${(it.usd * rate).toLocaleString()} XAF) [${it.statut}]\n`;
    });

    msg += `\n⚠️ *3. IMPRÉVUS & LOGISTIQUE (${totImprUsd.toLocaleString()}$ / ${totImprXaf.toLocaleString()} XAF)*\n`;
    imprevusItems.forEach((it) => {
      msg += `• ${it.code} ${it.article} : *${it.usd}$* (~${(it.usd * rate).toLocaleString()} XAF) [${it.statut}]\n`;
    });

    msg += `\n===============================\n`;
    msg += `💰 *TOTAL GÉNÉRAL DOTE : ${totGlobalUsd.toLocaleString()}$ soit ${totGlobalXaf.toLocaleString()} XAF*\n`;
    msg += `_Généré via le Simulateur & Planning de Mariage_`;

    navigator.clipboard.writeText(msg);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Currency Rate & Global KPIs */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Mariage Coutumier & Dotation RDC
              </span>
              <span className="text-xs text-slate-500 font-medium">Kasangulu / Bas-Congo</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif mt-1">
              Facture de Dote & Imprévus Modifiable
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Modifiez les montants en dollars ou en CFA en direct, ajustez les statuts et ajoutez des articles selon vos négociations familiales.
            </p>
          </div>

          {/* Currency Rate Slider / Input */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3 self-start md:self-auto">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-700 block uppercase">
                Taux de Conversion
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs text-slate-600 font-mono">1 USD =</span>
                <input
                  type="number"
                  min="400"
                  max="1000"
                  step="5"
                  value={rate}
                  onChange={(e) => onChangeRate(Number(e.target.value) || 600)}
                  className="w-20 px-2 py-0.5 text-xs font-bold font-mono text-slate-900 bg-white border border-slate-300 rounded-md focus:border-amber-600 focus:outline-none"
                />
                <span className="text-xs text-slate-600 font-mono">XAF</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Papa */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                👨‍🦳 Côté Papa
              </span>
              <span className="text-[11px] font-mono text-slate-500">{papaItems.length} art.</span>
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono mt-1">
              ${totPapaUsd.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-amber-700 font-mono">
              {totPapaXaf.toLocaleString()} XAF
            </div>
          </div>

          {/* Card 2: Maman */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                👩‍🦳 Côté Maman
              </span>
              <span className="text-[11px] font-mono text-slate-500">{mamanItems.length} art.</span>
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono mt-1">
              ${totMamanUsd.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-amber-700 font-mono">
              {totMamanXaf.toLocaleString()} XAF
            </div>
          </div>

          {/* Card 3: Imprévus */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-900 flex items-center gap-1">
                ⚠️ Imprévus & Logistique
              </span>
              <span className="text-[11px] font-mono text-amber-800">{imprevusItems.length} art.</span>
            </div>
            <div className="text-lg font-bold text-amber-950 font-mono mt-1">
              ${totImprUsd.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-amber-800 font-mono">
              {totImprXaf.toLocaleString()} XAF
            </div>
          </div>

          {/* Card 4: Total Dote */}
          <div className="p-3.5 rounded-xl bg-slate-900 text-white shadow-xs">
            <span className="text-xs font-semibold text-amber-400 block uppercase">
              Total Général Dote
            </span>
            <div className="text-lg font-bold text-white font-mono mt-1">
              ${totGlobalUsd.toLocaleString()}
            </div>
            <div className="text-xs font-bold text-amber-300 font-mono">
              {totGlobalXaf.toLocaleString()} XAF
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Exporter Excel / CSV
            </button>
            <button
              onClick={handleCopyWhatsApp}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  Copié dans le presse-papier !
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                  Copier Récapitulatif WhatsApp
                </>
              )}
            </button>
          </div>

          <button
            onClick={onResetDoteItems}
            className="text-xs text-slate-400 hover:text-slate-600 underline cursor-pointer"
          >
            Réinitialiser les articles officiels
          </button>
        </div>
      </div>

      {/* Add New Custom Item Modal / Bar */}
      {addingCategory && (
        <form
          onSubmit={handleCreateItem}
          className="bg-amber-50/80 border border-amber-300 rounded-2xl p-4 sm:p-5 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-3 animate-in fade-in"
        >
          <div className="sm:col-span-4 flex items-center justify-between pb-2 border-b border-amber-200">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-700" />
              Ajouter un article dans :{' '}
              <span className="text-amber-800 uppercase font-mono">
                {addingCategory === 'papa'
                  ? 'Côté Papa'
                  : addingCategory === 'maman'
                  ? 'Côté Maman'
                  : 'Imprévus & Logistique'}
              </span>
            </h4>
            <button
              type="button"
              onClick={() => setAddingCategory(null)}
              className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              Fermer
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Désignation de l'article *
            </label>
            <input
              type="text"
              required
              value={newArticle}
              onChange={(e) => setNewArticle(e.target.value)}
              placeholder="Ex: 1 Sac de riz 50kg ou Enveloppe grands-parents"
              className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2 focus:border-amber-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Prix en Dollars (USD) *
            </label>
            <div className="relative">
              <input
                type="number"
                required
                min="0"
                step="1"
                value={newUsd}
                onChange={(e) => setNewUsd(Number(e.target.value) || 0)}
                className="w-full text-xs font-mono font-bold bg-white border border-slate-300 rounded-xl p-2 pr-8 focus:border-amber-600 focus:outline-none"
              />
              <span className="absolute right-2.5 top-2 text-xs font-mono text-slate-400">$</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
              = {(newUsd * rate).toLocaleString()} XAF
            </span>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Statut
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as DoteStatus)}
              className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2 focus:border-amber-600 focus:outline-none"
            >
              <option value="À acheter">À acheter</option>
              <option value="En réserve">En réserve</option>
              <option value="Réserve cash">Réserve cash</option>
              <option value="Négocié">Négocié</option>
              <option value="Payé / Acheté">Payé / Acheté</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Note / Détail pratique
            </label>
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Ex: Achat au marché de Kasangulu"
              className="w-full text-xs bg-white border border-slate-300 rounded-xl p-2 focus:border-amber-600 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-4 flex items-center justify-end gap-2 pt-2 border-t border-amber-200">
            <button
              type="button"
              onClick={() => setAddingCategory(null)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold cursor-pointer shadow-xs"
            >
              Enregistrer l'article
            </button>
          </div>
        </form>
      )}

      {/* SECTION 1: CÔTÉ PAPA */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                👨‍🦳 1. Côté Papa (18 Articles Officiels)
              </h3>
              <p className="text-xs text-slate-500">
                Dotation exigée par la lignée paternelle : costumes, pagnes, casiers de bières & dotation en espèces.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Sous-Total Papa</span>
              <strong className="text-sm font-bold text-slate-900 font-mono">
                ${totPapaUsd.toLocaleString()} • {totPapaXaf.toLocaleString()} XAF
              </strong>
            </div>
            <button
              onClick={() => setAddingCategory('papa')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Ajouter ligne
            </button>
          </div>
        </div>

        {/* Papa Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3 w-14 text-center">Code</th>
                <th className="p-3">Désignation de l'Article</th>
                <th className="p-3 w-28 text-right">Prix ($ USD)</th>
                <th className="p-3 w-36 text-right">Prix (XAF)</th>
                <th className="p-3 w-36">Statut</th>
                <th className="p-3">Notes & Précisions</th>
                <th className="p-3 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {papaItems.map((item) => (
                <DoteTableRow
                  key={item.id}
                  item={item}
                  rate={rate}
                  onUpdate={onUpdateDoteItem}
                  onDelete={onDeleteDoteItem}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: CÔTÉ MAMAN */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pink-100 text-pink-800 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                👩‍🦳 2. Côté Maman (12 Articles Officiels)
              </h3>
              <p className="text-xs text-slate-500">
                Dotation de la lignée maternelle : pagne Super Wax, marmite ma famille, bassin libala bosembo & sucre.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Sous-Total Maman</span>
              <strong className="text-sm font-bold text-slate-900 font-mono">
                ${totMamanUsd.toLocaleString()} • {totMamanXaf.toLocaleString()} XAF
              </strong>
            </div>
            <button
              onClick={() => setAddingCategory('maman')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Ajouter ligne
            </button>
          </div>
        </div>

        {/* Maman Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3 w-14 text-center">Code</th>
                <th className="p-3">Désignation de l'Article</th>
                <th className="p-3 w-28 text-right">Prix ($ USD)</th>
                <th className="p-3 w-36 text-right">Prix (XAF)</th>
                <th className="p-3 w-36">Statut</th>
                <th className="p-3">Notes & Précisions</th>
                <th className="p-3 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {mamanItems.map((item) => (
                <DoteTableRow
                  key={item.id}
                  item={item}
                  rate={rate}
                  onUpdate={onUpdateDoteItem}
                  onDelete={onDeleteDoteItem}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: IMPRÉVUS & LOGISTIQUE */}
      <div className="bg-white rounded-2xl border border-amber-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 bg-amber-50/70 border-b border-amber-200 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                ⚠️ 3. Rubriques des Imprévus & Logistique Coutumière
              </h3>
              <p className="text-xs text-amber-900/80">
                Amendes coutumières, droit de portier, enveloppes surprises des tantes et transport pour éviter tout blocage le jour J.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-amber-800 block">Sous-Total Imprévus</span>
              <strong className="text-sm font-bold text-amber-950 font-mono">
                ${totImprUsd.toLocaleString()} • {totImprXaf.toLocaleString()} XAF
              </strong>
            </div>
            <button
              onClick={() => setAddingCategory('imprevus')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Ajouter ligne
            </button>
          </div>
        </div>

        {/* Imprevus Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-amber-100/50 border-b border-amber-200 text-amber-950 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3 w-14 text-center">Code</th>
                <th className="p-3">Désignation de l'Imprévu / Logistique</th>
                <th className="p-3 w-28 text-right">Prix ($ USD)</th>
                <th className="p-3 w-36 text-right">Prix (XAF)</th>
                <th className="p-3 w-36">Statut</th>
                <th className="p-3">Recommandations & Utilisation</th>
                <th className="p-3 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-100/60 text-slate-800">
              {imprevusItems.map((item) => (
                <DoteTableRow
                  key={item.id}
                  item={item}
                  rate={rate}
                  onUpdate={onUpdateDoteItem}
                  onDelete={onDeleteDoteItem}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

interface DoteTableRowProps {
  item: DoteItem;
  rate: number;
  onUpdate: (id: string, updates: Partial<DoteItem>) => void;
  onDelete: (id: string) => void;
}

const DoteTableRow: React.FC<DoteTableRowProps> = ({ item, rate, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [article, setArticle] = useState(item.article);
  const [usd, setUsd] = useState(item.usd);
  const [note, setNote] = useState(item.note || '');

  // Keep local state in sync when item props change from cloud or parent
  React.useEffect(() => {
    setArticle(item.article);
    setUsd(item.usd);
    setNote(item.note || '');
  }, [item.article, item.usd, item.note]);

  const xafAmount = Math.round((Number(usd) || item.usd) * rate);
  const statusInfo = STATUS_CONFIG[item.statut] || STATUS_CONFIG['À acheter'];

  const handleSave = () => {
    const validUsd = Math.max(0, Number(usd) || 0);
    onUpdate(item.id, {
      article: article.trim() || item.article,
      usd: validUsd,
      note: note.trim(),
    });
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setArticle(item.article);
      setUsd(item.usd);
      setNote(item.note || '');
      setIsEditing(false);
    }
  };

  return (
    <tr className={`hover:bg-slate-50/70 transition-colors ${isEditing ? 'bg-amber-50/40' : ''}`}>
      <td className="p-3 text-center font-mono font-semibold text-slate-500">{item.code}</td>

      {/* Article Name */}
      <td className="p-3">
        {isEditing ? (
          <input
            type="text"
            value={article}
            onChange={(e) => setArticle(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full text-xs font-semibold text-slate-900 bg-white border border-amber-300 rounded-lg px-2 py-1 focus:outline-none"
          />
        ) : (
          <div
            onClick={() => setIsEditing(true)}
            className="font-semibold text-slate-900 hover:text-amber-800 cursor-pointer"
            title="Cliquer pour modifier"
          >
            {item.article}
          </div>
        )}
      </td>

      {/* USD Price */}
      <td className="p-3 text-right">
        {isEditing ? (
          <input
            type="number"
            min="0"
            step="1"
            value={usd}
            onChange={(e) => setUsd(e.target.value === '' ? ('' as unknown as number) : Number(e.target.value))}
            onKeyDown={handleKeyDown}
            className="w-20 text-xs font-bold font-mono text-right text-slate-900 bg-white border border-amber-300 rounded-lg px-2 py-1 focus:outline-none"
            autoFocus
          />
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="font-bold font-mono text-slate-900 hover:text-amber-700 bg-slate-100 hover:bg-amber-100 px-2 py-1 rounded-md transition cursor-pointer"
            title="Cliquer pour modifier le prix"
          >
            ${item.usd.toLocaleString()}
          </button>
        )}
      </td>

      {/* XAF Price (Computed) */}
      <td className="p-3 text-right font-mono font-bold text-amber-800">
        {xafAmount.toLocaleString()} XAF
      </td>

      {/* Statut Dropdown */}
      <td className="p-3">
        <select
          value={item.statut}
          onChange={(e) => onUpdate(item.id, { statut: e.target.value as DoteStatus })}
          className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border cursor-pointer focus:outline-none transition-all ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
        >
          <option value="À acheter">🛒 À acheter</option>
          <option value="En réserve">En réserve</option>
          <option value="Réserve cash">Réserve cash</option>
          <option value="Négocié">Négocié</option>
          <option value="Payé / Acheté">Payé / Acheté</option>
        </select>
      </td>

      {/* Note */}
      <td className="p-3">
        {isEditing ? (
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Détail..."
              className="w-full text-xs text-slate-600 bg-white border border-amber-300 rounded-lg px-2 py-1 focus:outline-none"
            />
            <button
              onClick={handleSave}
              className="p-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-xs"
              title="Sauvegarder"
            >
              <Save className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <span
            onClick={() => setIsEditing(true)}
            className="text-slate-500 hover:text-slate-700 cursor-pointer line-clamp-1"
            title="Cliquer pour modifier"
          >
            {item.note || '—'}
          </span>
        )}
      </td>

      {/* Delete / Actions */}
      <td className="p-3 text-center">
        <button
          onClick={() => onDelete(item.id)}
          className="p-1 text-slate-300 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
          title="Supprimer cet article"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </td>
    </tr>
  );
};
