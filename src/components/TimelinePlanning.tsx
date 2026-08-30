import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  ChevronDown,
  ChevronUp,
  Sparkles,
  CalendarPlus,
  Trash2,
} from 'lucide-react';
import { Milestone, WeddingConfig } from '../types';
import { calculateTargetDate } from '../utils/formatters';

interface TimelinePlanningProps {
  milestones: Milestone[];
  config: WeddingConfig;
  onToggleMilestone: (id: string) => void;
  onUpdateMilestone: (id: string, updates: Partial<Milestone>) => void;
  onAddMilestone: (m: Milestone) => void;
  onDeleteMilestone: (id: string) => void;
}

export const TimelinePlanning: React.FC<TimelinePlanningProps> = ({
  milestones,
  config,
  onToggleMilestone,
  onUpdateMilestone,
  onAddMilestone,
  onDeleteMilestone,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(milestones[0]?.id || null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newPeriod, setNewPeriod] = useState('M-3');
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Général');

  const completedCount = milestones.filter((m) => m.completed).length;
  const progressPct = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newM: Milestone = {
      id: `task_${Date.now()}`,
      period: newPeriod,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Tâche personnalisée pour votre mariage.',
      targetMonthsBefore: 3,
      completed: false,
      category: newCategory,
      notes: 'Ajouté par les organisateurs',
    };

    onAddMilestone(newM);
    setIsAddingTask(false);
    setNewTitle('');
    setNewDesc('');
  };

  // Generate .ICS file for calendar integration
  const handleExportICS = () => {
    if (!config.weddingDate) return;
    const wDate = new Date(config.weddingDate);

    let icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Simulateur Mariage//FR\nCALSCALE:GREGORIAN\n`;

    milestones.forEach((m) => {
      const targetDays = Math.round(m.targetMonthsBefore * 30.4375);
      const milestoneDate = new Date(wDate.getTime() - targetDays * 24 * 60 * 60 * 1000);
      const dateStr = milestoneDate.toISOString().replace(/[-:]/g, '').split('T')[0];

      icsContent += `BEGIN:VEVENT\nSUMMARY:Mariage [${m.period}] : ${m.title}\nDESCRIPTION:${m.description}\nDTSTART;VALUE=DATE:${dateStr}\nDTEND;VALUE=DATE:${dateStr}\nSTATUS:CONFIRMED\nEND:VEVENT\n`;
    });

    icsContent += `END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `retroplanning_mariage_${config.coupleNames.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Progress and Action Controls */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 font-serif">
              Les Étapes Clés pour Démarrer & Réussir
            </h3>
            <span className="bg-amber-100 text-amber-900 text-xs font-semibold px-2 py-0.5 rounded-full border border-amber-300">
              {completedCount} / {milestones.length} validées ({progressPct}%)
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Rétroplanning temporel calé automatiquement sur votre date du{' '}
            <strong>
              {config.weddingDate
                ? new Date(config.weddingDate).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : 'mariage'}
            </strong>
          </p>

          {/* Progress bar */}
          <div className="w-full max-w-md h-2.5 bg-slate-100 rounded-full overflow-hidden mt-2">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportICS}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            title="Exporter dans Google Calendar / Apple Calendar"
          >
            <CalendarPlus className="w-4 h-4 text-slate-600" />
            Exporter Calendrier (.ics)
          </button>
          <button
            onClick={() => setIsAddingTask(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors cursor-pointer shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            Ajouter un jalon
          </button>
        </div>
      </div>

      {/* Add Custom Task Form */}
      {isAddingTask && (
        <form
          onSubmit={handleCreateMilestone}
          className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          <div className="sm:col-span-3 flex items-center justify-between pb-2 border-b border-amber-200/60">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700" />
              Nouveau Jalon de Préparation
            </h4>
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              Fermer
            </button>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Période / Timing
            </label>
            <input
              type="text"
              required
              value={newPeriod}
              onChange={(e) => setNewPeriod(e.target.value)}
              placeholder="Ex: M-5 ou Semaine -1"
              className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2 focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Intitulé de l'étape *
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Ex: Réserver la coiffeuse & maquilleuse VIP"
              className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2 focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Détails & Recommandations
            </label>
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Ex: Faire une séance d'essai coiffure et valider le timing pour le matin du jour J"
              className="w-full text-xs bg-white border border-slate-200 rounded-xl p-2 focus:border-amber-500"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsAddingTask(false)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold cursor-pointer"
            >
              Ajouter au rétroplanning
            </button>
          </div>
        </form>
      )}

      {/* Timeline Steps List */}
      <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
        {milestones.map((m, idx) => {
          const isExpanded = expandedId === m.id;
          const targetDateStr = calculateTargetDate(config.weddingDate, m.targetMonthsBefore);

          return (
            <div
              key={m.id}
              className={`relative bg-white rounded-2xl border transition-all duration-200 shadow-xs ${
                m.completed
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : isExpanded
                  ? 'border-amber-300 ring-1 ring-amber-200'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Step indicator circle */}
              <button
                type="button"
                onClick={() => onToggleMilestone(m.id)}
                className={`absolute -left-6 sm:-left-8 top-4.5 w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                  m.completed
                    ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                    : 'bg-white text-slate-400 border-2 border-slate-300 ring-4 ring-slate-50'
                }`}
                title={m.completed ? 'Marquer comme non fait' : 'Valider cette étape'}
              >
                {m.completed ? (
                  <CheckCircle2 className="w-4 h-4 fill-emerald-600 text-white" />
                ) : (
                  <Circle className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Step Header */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : m.id)}
                >
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="font-bold text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-mono">
                      {m.period}
                    </span>

                    {targetDateStr && (
                      <span className="text-xs font-medium text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/80 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        Cible : ~{targetDateStr}
                      </span>
                    )}

                    {m.category && (
                      <span className="text-[11px] text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        {m.category}
                      </span>
                    )}
                  </div>

                  <h4
                    className={`text-sm sm:text-base font-bold mt-1.5 transition-colors ${
                      m.completed ? 'text-emerald-900 line-through' : 'text-slate-900'
                    }`}
                  >
                    {m.title}
                  </h4>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => onToggleMilestone(m.id)}
                    className={`text-xs font-semibold px-3 py-1 rounded-xl transition-colors cursor-pointer ${
                      m.completed
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {m.completed ? '✓ Fait' : 'À faire'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : m.id)}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                    aria-label="Détails"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Step Expanded Content */}
              {isExpanded && (
                <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-100 space-y-3">
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {m.description}
                  </p>

                  {/* Practical Advisory Note */}
                  {m.notes && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                      <strong className="text-slate-900 font-semibold block">
                        💡 Recommandation pratique :
                      </strong>
                      <p>{m.notes}</p>
                    </div>
                  )}

                  {/* Personal Step Note */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-500">
                      Étape n°{idx + 1} du rétroplanning
                    </span>

                    {m.id.startsWith('task_') && (
                      <button
                        type="button"
                        onClick={() => onDeleteMilestone(m.id)}
                        className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Supprimer ce jalon
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
