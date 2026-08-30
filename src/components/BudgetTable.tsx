import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Info,
  DollarSign,
  Utensils,
  Home,
  Sparkles,
  Music,
  Shirt,
  ScrollText,
  Church,
  Search,
} from 'lucide-react';
import { BudgetItem, WeddingConfig } from '../types';
import { formatCurrency } from '../utils/formatters';

interface BudgetTableProps {
  items: BudgetItem[];
  config: WeddingConfig;
  onUpdateItem: (id: string, updates: Partial<BudgetItem>) => void;
  onAddItem: (item: BudgetItem) => void;
  onDeleteItem: (id: string) => void;
  onResetItems: () => void;
  totals: {
    directTotal: number;
    reserveImprevus: number;
    totalGeneral: number;
    totalPaid: number;
    remainingToPay: number;
  };
}

export const BudgetTable: React.FC<BudgetTableProps> = ({
  items,
  config,
  onUpdateItem,
  onAddItem,
  onDeleteItem,
  totals,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState<string>('');
  const [editNote, setEditNote] = useState<string>('');
  const [editPaid, setEditPaid] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRubric, setSelectedRubric] = useState<string>('all');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // New item state
  const [newRubric, setNewRubric] = useState('Autre / Divers');
  const [newItemName, setNewItemName] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newNote, setNewNote] = useState('');

  const getRubricIcon = (rubric: string) => {
    switch (rubric) {
      case 'Mariage Coutumier':
        return <ScrollText className="w-4 h-4 text-amber-600" />;
      case 'Formalités & Église':
        return <Church className="w-4 h-4 text-blue-600" />;
      case 'Tenues & Beauté':
        return <Shirt className="w-4 h-4 text-purple-600" />;
      case 'Lieu & Mobilier':
        return <Home className="w-4 h-4 text-emerald-600" />;
      case 'Restauration & Bar':
        return <Utensils className="w-4 h-4 text-amber-700" />;
      case 'Décoration & Ambience':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      case 'Animation & Média':
        return <Music className="w-4 h-4 text-indigo-600" />;
      default:
        return <DollarSign className="w-4 h-4 text-slate-500" />;
    }
  };

  const startEdit = (item: BudgetItem) => {
    const currentVal = item.customAmount !== undefined ? item.customAmount : item.baseAmount;
    setEditingId(item.id);
    setEditAmount(currentVal.toString());
    setEditNote(item.note || '');
    setEditPaid((item.paidAmount || 0).toString());
  };

  const saveEdit = (id: string) => {
    const numAmount = parseFloat(editAmount);
    const numPaid = parseFloat(editPaid) || 0;
    if (!isNaN(numAmount) && numAmount >= 0) {
      onUpdateItem(id, {
        customAmount: numAmount,
        note: editNote,
        paidAmount: numPaid,
      });
    }
    setEditingId(null);
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(newAmount);
    if (!newItemName.trim() || isNaN(parsedAmount) || parsedAmount < 0) return;

    const newItem: BudgetItem = {
      id: `custom_${Date.now()}`,
      rubric: newRubric,
      item: newItemName.trim(),
      baseAmount: parsedAmount,
      customAmount: parsedAmount,
      note: newNote.trim() || 'Poste personnalisé',
      isCustom: true,
      paidAmount: 0,
    };

    onAddItem(newItem);
    setIsAddingNew(false);
    setNewItemName('');
    setNewAmount('');
    setNewNote('');
  };

  // Filter items
  const uniqueRubrics = Array.from(new Set(items.map((i) => i.rubric)));
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.rubric.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.note && item.note.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRubric = selectedRubric === 'all' || item.rubric === selectedRubric;
    return matchesSearch && matchesRubric;
  });

  return (
    <div className="space-y-5">
      {/* Controls Bar: Search, Rubric Filter, Add button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un poste de dépense..."
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 text-slate-800"
            />
          </div>
          <select
            value={selectedRubric}
            onChange={(e) => setSelectedRubric(e.target.value)}
            className="text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="all">Toutes les rubriques</option>
            {uniqueRubrics.map((rub) => (
              <option key={rub} value={rub}>
                {rub}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setIsAddingNew(true)}
          className="inline-flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Ajouter un poste
        </button>
      </div>

      {/* Add New Item Modal / Drawer */}
      {isAddingNew && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 sm:p-5 shadow-xs transition-all">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-700" />
              Nouveau poste de dépense personnalisé
            </h3>
            <button
              onClick={() => setIsAddingNew(false)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleCreateNew} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Rubrique
              </label>
              <select
                value={newRubric}
                onChange={(e) => setNewRubric(e.target.value)}
                className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2 focus:border-amber-500"
              >
                <option value="Mariage Coutumier">Mariage Coutumier</option>
                <option value="Formalités & Église">Formalités & Église</option>
                <option value="Tenues & Beauté">Tenues & Beauté</option>
                <option value="Lieu & Mobilier">Lieu & Mobilier</option>
                <option value="Restauration & Bar">Restauration & Bar</option>
                <option value="Décoration & Ambience">Décoration & Ambience</option>
                <option value="Animation & Média">Animation & Média</option>
                <option value="Transport & Logistique">Transport & Logistique</option>
                <option value="Cadeaux & Invitations">Cadeaux & Invitations</option>
                <option value="Autre / Divers">Autre / Divers</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Intitulé du poste *
              </label>
              <input
                type="text"
                required
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Ex: Voiture cortège mariés"
                className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Estimation (XAF) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="5000"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="Ex: 150000"
                className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2 focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Note / Détail
              </label>
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Ex: Location avec chauffeur"
                className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2 focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-4 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold cursor-pointer"
              >
                Enregistrer le poste
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Budget Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3.5 px-4">Rubrique</th>
                <th className="py-3.5 px-4">Poste & Description</th>
                <th className="py-3.5 px-4 text-right">Estimation</th>
                <th className="py-3.5 px-4 text-center">% Budget</th>
                <th className="py-3.5 px-4 text-right">Payé / Acompte</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Aucun poste de dépense trouvé avec ces filtres.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const currentAmount =
                    item.customAmount !== undefined ? item.customAmount : item.baseAmount;
                  const isModified =
                    item.customAmount !== undefined && item.customAmount !== item.baseAmount;
                  const pct =
                    totals.directTotal > 0
                      ? Math.round((currentAmount / totals.directTotal) * 100)
                      : 0;
                  const isEditing = editingId === item.id;
                  const paid = item.paidAmount || 0;
                  const isFullyPaid = paid >= currentAmount && currentAmount > 0;

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isEditing ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      {/* Rubrique */}
                      <td className="py-3 px-4 align-top">
                        <div className="flex items-center gap-2">
                          <div className="p-1 rounded-lg bg-slate-100">
                            {getRubricIcon(item.rubric)}
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 text-xs sm:text-sm block">
                              {item.rubric}
                            </span>
                            {item.isCustom && (
                              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-medium">
                                Manuel
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Poste & Note */}
                      <td className="py-3 px-4 align-top max-w-xs sm:max-w-sm">
                        <div className="font-medium text-slate-900">{item.item}</div>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editNote}
                            onChange={(e) => setEditNote(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit(item.id);
                              else if (e.key === 'Escape') setEditingId(null);
                            }}
                            placeholder="Note ou précision..."
                            className="mt-1 w-full text-xs bg-white border border-slate-300 rounded px-2 py-1 focus:border-amber-500"
                          />
                        ) : (
                          item.note && (
                            <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                              {item.note}
                            </div>
                          )
                        )}
                      </td>

                      {/* Estimation */}
                      <td className="py-3 px-4 align-top text-right font-semibold">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="number"
                              value={editAmount}
                              onChange={(e) => setEditAmount(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEdit(item.id);
                                else if (e.key === 'Escape') setEditingId(null);
                              }}
                              className="w-28 text-right font-bold text-xs bg-white border border-amber-300 rounded px-2 py-1 text-slate-900 focus:outline-none"
                              autoFocus
                            />
                            <span className="text-[10px] text-slate-500">XAF</span>
                          </div>
                        ) : (
                          <div>
                            <span className="text-slate-900 font-bold font-mono">
                              {formatCurrency(currentAmount, config.currency)}
                            </span>
                            {isModified && (
                              <span className="block text-[10px] text-amber-700">
                                (Initial : {formatCurrency(item.baseAmount, config.currency)})
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* % Total bar */}
                      <td className="py-3 px-4 align-top text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="font-medium text-xs text-slate-600">{pct}%</span>
                          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                            <div
                              className="h-full bg-amber-500 rounded-full"
                              style={{ width: `${Math.min(pct * 2, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Payé / Acompte */}
                      <td className="py-3 px-4 align-top text-right">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editPaid}
                            onChange={(e) => setEditPaid(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit(item.id);
                              else if (e.key === 'Escape') setEditingId(null);
                            }}
                            placeholder="Montant payé"
                            className="w-24 text-right text-xs bg-white border border-slate-300 rounded px-2 py-1"
                          />
                        ) : (
                          <div>
                            <span
                              className={`text-xs font-semibold ${
                                isFullyPaid
                                  ? 'text-emerald-700'
                                  : paid > 0
                                  ? 'text-amber-700'
                                  : 'text-slate-600'
                              }`}
                            >
                              {paid > 0 ? formatCurrency(paid, config.currency) : '0 XAF'}
                            </span>
                            {isFullyPaid && (
                              <span className="block text-[10px] text-emerald-700 font-semibold">
                                ✓ Soldé
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 align-top text-center">
                        {isEditing ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => saveEdit(item.id)}
                              className="p-1 rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer"
                              title="Valider"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer"
                              title="Annuler"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => startEdit(item)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                              title="Modifier le montant ou la note"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            {item.isCustom && (
                              <button
                                onClick={() => onDeleteItem(item.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Supprimer ce poste"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Table Footer Totals */}
            <tfoot className="bg-slate-50 border-t-2 border-slate-200 font-semibold text-xs sm:text-sm">
              <tr className="border-b border-slate-200">
                <td colSpan={2} className="py-3 px-4 text-slate-700">
                  Total Direct Estimé (Hors Réserve)
                </td>
                <td className="py-3 px-4 text-right font-bold text-slate-900 font-mono">
                  {formatCurrency(totals.directTotal, config.currency)}
                </td>
                <td className="py-3 px-4 text-center text-slate-500">100%</td>
                <td className="py-3 px-4 text-right text-emerald-700 font-mono">
                  {formatCurrency(totals.totalPaid, config.currency)}
                </td>
                <td />
              </tr>

              <tr className="border-b border-slate-200 bg-amber-50/60 text-amber-950">
                <td colSpan={2} className="py-2.5 px-4 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-600" />
                  Réserve de Sécurité (+10%)
                </td>
                <td className="py-2.5 px-4 text-right font-bold font-mono text-amber-800">
                  +{formatCurrency(totals.reserveImprevus, config.currency)}
                </td>
                <td className="py-2.5 px-4 text-center text-amber-800">+10%</td>
                <td colSpan={2} />
              </tr>

              <tr className="bg-slate-950 text-white font-bold">
                <td colSpan={2} className="py-3.5 px-4 text-sm font-serif">
                  BUDGET GLOBAL RECOMMANDÉ
                </td>
                <td className="py-3.5 px-4 text-right text-sm sm:text-base font-serif font-bold text-amber-300 font-mono">
                  {formatCurrency(totals.totalGeneral, config.currency)}
                </td>
                <td className="py-3.5 px-4 text-center text-xs text-slate-400">Total</td>
                <td className="py-3.5 px-4 text-right text-xs text-amber-200 font-normal">
                  Reste : {formatCurrency(totals.remainingToPay, config.currency)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Safety info notice matching Streamlit st.info */}
      <div className="bg-blue-50/80 border border-blue-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-blue-900 shadow-2xs">
        <div className="p-1 rounded-lg bg-blue-100 text-blue-700 shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold text-blue-950">
            💡 Conseil d'expert en organisation de mariage :
          </p>
          <p className="text-blue-800/90 leading-relaxed">
            Une réserve de sécurité de 10% (
            <strong>{formatCurrency(totals.reserveImprevus, config.currency)}</strong>) est
            fortement recommandée pour pallier les ajustements de dernière minute (surcoût
            boissons, rallonge horaire de la salle, invités non annoncés, transports d’urgence des
            familles).
          </p>
        </div>
      </div>
    </div>
  );
};
