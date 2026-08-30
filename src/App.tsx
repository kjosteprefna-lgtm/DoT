import React, { useState } from 'react';
import {
  PieChart,
  Calendar,
  Download,
  BookOpen,
  SlidersHorizontal,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Share2,
  Heart,
  ImageIcon,
  Shirt,
  Lightbulb,
  FileSpreadsheet,
  Users,
} from 'lucide-react';
import { WeddingConfig, BudgetItem, Milestone, DoteItem, GuestItem } from './types';
import {
  INITIAL_CONFIG,
  DEFAULT_MILESTONES,
  DEFAULT_DOTE_ITEMS,
  DEFAULT_GUESTS,
  generateDefaultBudget,
} from './data/defaultData';
import { computeBudgetTotals } from './utils/formatters';
import { Header } from './components/Header';
import { ConfigSidebar } from './components/ConfigSidebar';
import { KPISummary } from './components/KPISummary';
import { BudgetTable } from './components/BudgetTable';
import { BudgetVisuals } from './components/BudgetVisuals';
import { TimelinePlanning } from './components/TimelinePlanning';
import { ExportPanel } from './components/ExportPanel';
import { DoteManager } from './components/DoteManager';
import { AIPromptStudio } from './components/AIPromptStudio';
import { DecorOutfitsViewer } from './components/DecorOutfitsViewer';
import { BestIdeasPanel } from './components/BestIdeasPanel';
import { GuestListManager } from './components/GuestListManager';
import { useWeddingSync } from './lib/useWeddingSync';

export default function App() {
  // Real-time Cloud Sync + Local Persistence Hook
  const {
    config,
    items,
    doteItems,
    guests,
    milestones,
    setConfig,
    setItems,
    setDoteItems,
    setGuests,
    setMilestones,
    updateConfigAndItems,
    resetAllToDefaults,
    syncStatus,
    lastSyncTime,
  } = useWeddingSync();

  const [activeTab, setActiveTab] = useState<
    'dote' | 'invites' | 'budget' | 'prompts' | 'decor' | 'ideas' | 'planning' | 'export'
  >('dote');
  const [budgetSubTab, setBudgetSubTab] = useState<'table' | 'charts' | 'both'>('both');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Handle configuration changes and update base rates automatically
  const handleConfigChange = (updated: Partial<WeddingConfig>) => {
    const newConfig = { ...config, ...updated };

    // Update base amounts for standard items according to the new config
    const newBaseList = generateDefaultBudget(newConfig);
    const newItemsMap = new Map(newBaseList.map((item) => [item.id, item]));
    const updatedList: BudgetItem[] = [];

    items.forEach((oldItem) => {
      if (newItemsMap.has(oldItem.id)) {
        const freshBase = newItemsMap.get(oldItem.id)!;
        updatedList.push({
          ...oldItem,
          baseAmount: freshBase.baseAmount,
          rubric: freshBase.rubric,
          item: freshBase.item,
          note: oldItem.customAmount ? oldItem.note : freshBase.note,
        });
        newItemsMap.delete(oldItem.id);
      } else if (oldItem.isCustom) {
        updatedList.push(oldItem);
      }
    });

    newItemsMap.forEach((freshItem) => {
      updatedList.push(freshItem);
    });

    updateConfigAndItems(newConfig, updatedList);
  };

  // Reset to default
  const handleReset = () => {
    if (window.confirm('Voulez-vous réinitialiser tous les calculs aux paramètres par défaut (Mama Judia & Ndombe) sur tous les appareils ?')) {
      resetAllToDefaults();
    }
  };

  // Budget Item modifications
  const handleUpdateItem = (id: string, updates: Partial<BudgetItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleAddItem = (newItem: BudgetItem) => {
    setItems((prev) => [...prev, newItem]);
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Dote Item modifications
  const handleUpdateDoteItem = (id: string, updates: Partial<DoteItem>) => {
    setDoteItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleAddDoteItem = (newItem: DoteItem) => {
    setDoteItems((prev) => [...prev, newItem]);
  };

  const handleDeleteDoteItem = (id: string) => {
    setDoteItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetDoteItems = () => {
    if (window.confirm('Voulez-vous réinitialiser la liste dote aux 36 articles officiels ?')) {
      setDoteItems(DEFAULT_DOTE_ITEMS);
    }
  };

  // Milestone modifications
  const handleToggleMilestone = (id: string) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m))
    );
  };

  const handleUpdateMilestone = (id: string, updates: Partial<Milestone>) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  const handleAddMilestone = (newM: Milestone) => {
    setMilestones((prev) => [...prev, newM]);
  };

  const handleDeleteMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  // Computed Totals
  const totals = computeBudgetTotals(items);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Header with real-time Cloud sync status */}
      <Header
        config={config}
        onChangeConfig={(newCfg) => setConfig(newCfg)}
        onReset={handleReset}
        syncStatus={syncStatus}
        lastSyncTime={lastSyncTime}
      />

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 space-y-6">
        {/* Top KPI Banner */}
        <section aria-label="Indicateurs Clés">
          <KPISummary
            nbInvites={config.nbInvites}
            totalDirect={totals.directTotal}
            reserveImprevus={totals.reserveImprevus}
            totalGeneral={totals.totalGeneral}
            currency={config.currency}
          />
        </section>

        {/* Mobile Sidebar Toggle Button */}
        <div className="lg:hidden flex items-center justify-between bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs no-print">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800"
          >
            <SlidersHorizontal className="w-4 h-4 text-amber-600" />
            <span>
              {isMobileSidebarOpen ? 'Masquer les paramètres' : 'Modifier les paramètres du mariage'}
            </span>
          </button>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            {config.standing} • {config.nbInvites} pers.
          </span>
        </div>

        {/* Main Content Layout with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Sidebar Parameters (4 cols) */}
          <div
            className={`lg:col-span-4 no-print ${
              isMobileSidebarOpen ? 'block' : 'hidden lg:block'
            }`}
          >
            <ConfigSidebar config={config} onChange={handleConfigChange} />
          </div>

          {/* Right Column: Main Tabs & Views (8 cols) */}
          <div className="lg:col-span-8 space-y-5">
            {/* Primary Navigation Tabs */}
            <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-1 overflow-x-auto no-print">
              <button
                onClick={() => setActiveTab('dote')}
                className={`min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'dote'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Heart className="w-4 h-4 text-rose-400" />
                <span>💍 Dote RDC</span>
              </button>

              <button
                id="tab-invites"
                onClick={() => setActiveTab('invites')}
                className={`min-w-[140px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer relative ${
                  activeTab === 'invites'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Users className="w-4 h-4 text-indigo-400" />
                <span>👥 Liste Invités</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    activeTab === 'invites'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {guests.reduce((acc, g) => acc + (Number(g.nombrePersonnes) || 1), 0)}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('budget')}
                className={`min-w-[140px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'budget'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <PieChart className="w-4 h-4 text-amber-500" />
                <span>📊 Budget Réception</span>
              </button>

              <button
                onClick={() => setActiveTab('prompts')}
                className={`min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'prompts'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-purple-500" />
                <span>📸 Prompts IA</span>
              </button>

              <button
                onClick={() => setActiveTab('decor')}
                className={`min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'decor'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Shirt className="w-4 h-4 text-blue-500" />
                <span>🎨 Déco & Tenues</span>
              </button>

              <button
                onClick={() => setActiveTab('ideas')}
                className={`min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'ideas'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>✨ 7 Idées Clés</span>
              </button>

              <button
                onClick={() => setActiveTab('planning')}
                className={`min-w-[130px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'planning'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span>📅 Rétroplanning</span>
              </button>

              <button
                onClick={() => setActiveTab('export')}
                className={`min-w-[110px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'export'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Download className="w-4 h-4 text-slate-400" />
                <span>📥 Exporter</span>
              </button>
            </div>

            {/* TAB 1: DOTE MANAGER (CÔTÉ PAPA, MAMAN & IMPRÉVUS) */}
            {activeTab === 'dote' && (
              <DoteManager
                doteItems={doteItems}
                config={config}
                onChangeRate={(newRate) => handleConfigChange({ usdToXafRate: newRate })}
                onUpdateDoteItem={handleUpdateDoteItem}
                onAddDoteItem={handleAddDoteItem}
                onDeleteDoteItem={handleDeleteDoteItem}
                onResetDoteItems={handleResetDoteItems}
              />
            )}

            {/* TAB 2: GUEST LIST MANAGER (LISTE DYNAMIQUE DES INVITÉS & COUPLES) */}
            {activeTab === 'invites' && (
              <GuestListManager
                guests={guests}
                onUpdateGuests={setGuests}
                config={config}
              />
            )}

            {/* TAB 2: GLOBAL BUDGET & RECEPTION (400 GUESTS) */}
            {activeTab === 'budget' && (
              <div className="space-y-5">
                <div className="flex items-center justify-between no-print">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Détail des Postes de Dépense & Graphiques
                  </div>
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                    <button
                      onClick={() => setBudgetSubTab('both')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                        budgetSubTab === 'both'
                          ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Vue Combinée
                    </button>
                    <button
                      onClick={() => setBudgetSubTab('table')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                        budgetSubTab === 'table'
                          ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Tableau Seul
                    </button>
                    <button
                      onClick={() => setBudgetSubTab('charts')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                        budgetSubTab === 'charts'
                          ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Graphiques Seuls
                    </button>
                  </div>
                </div>

                {(budgetSubTab === 'charts' || budgetSubTab === 'both') && (
                  <BudgetVisuals
                    items={items}
                    config={config}
                    directTotal={totals.directTotal}
                  />
                )}

                {(budgetSubTab === 'table' || budgetSubTab === 'both') && (
                  <BudgetTable
                    items={items}
                    config={config}
                    onUpdateItem={handleUpdateItem}
                    onAddItem={handleAddItem}
                    onDeleteItem={handleDeleteItem}
                    onResetItems={() => setItems(generateDefaultBudget(config))}
                    totals={totals}
                  />
                )}
              </div>
            )}

            {/* TAB 3: AI PROMPT STUDIO */}
            {activeTab === 'prompts' && <AIPromptStudio config={config} />}

            {/* TAB 4: DECORATION & OUTFITS */}
            {activeTab === 'decor' && <DecorOutfitsViewer config={config} />}

            {/* TAB 5: 7 IDEAS PLUS MEILLEUR */}
            {activeTab === 'ideas' && <BestIdeasPanel config={config} />}

            {/* TAB 6: TIMELINE RETROPLANNING */}
            {activeTab === 'planning' && (
              <TimelinePlanning
                milestones={milestones}
                config={config}
                onToggleMilestone={handleToggleMilestone}
                onUpdateMilestone={handleUpdateMilestone}
                onAddMilestone={handleAddMilestone}
                onDeleteMilestone={handleDeleteMilestone}
              />
            )}

            {/* TAB 7: EXPORT & SHARE */}
            {activeTab === 'export' && (
              <ExportPanel
                items={items}
                milestones={milestones}
                config={config}
                totals={totals}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-8 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-800">
              Simulateur & Planning de Mariage
            </span>
            <span>•</span>
            <span>Kasangulu • Kinshasa • Pointe-Noire</span>
          </div>
          <p>
            Édition personnalisée : {config.coupleNames} (Coutumier RDC + Réception Pelouse 400 pers.)
          </p>
        </div>
      </footer>
    </div>
  );
}
