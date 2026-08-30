import React, { useState } from 'react';
import { PieChart, DollarSign, TrendingUp, Info } from 'lucide-react';
import { BudgetItem, WeddingConfig } from '../types';
import { formatCurrency } from '../utils/formatters';

interface BudgetVisualsProps {
  items: BudgetItem[];
  config: WeddingConfig;
  directTotal: number;
}

const COLORS = [
  '#d97706', // amber-600
  '#0f172a', // slate-900
  '#2563eb', // blue-600
  '#059669', // emerald-600
  '#7c3aed', // purple-600
  '#f59e0b', // amber-500
  '#4f46e5', // indigo-600
  '#0891b2', // cyan-600
  '#64748b', // slate-500
];

export const BudgetVisuals: React.FC<BudgetVisualsProps> = ({ items, config, directTotal }) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Group items by rubric
  const categoryTotals: Record<string, { amount: number; count: number; items: string[] }> = {};
  items.forEach((i) => {
    const amt = i.customAmount !== undefined ? i.customAmount : i.baseAmount;
    if (!categoryTotals[i.rubric]) {
      categoryTotals[i.rubric] = { amount: 0, count: 0, items: [] };
    }
    categoryTotals[i.rubric].amount += amt;
    categoryTotals[i.rubric].count += 1;
    categoryTotals[i.rubric].items.push(i.item);
  });

  const categories = Object.keys(categoryTotals).map((rubric, idx) => {
    const amount = categoryTotals[rubric].amount;
    const percentage = directTotal > 0 ? (amount / directTotal) * 100 : 0;
    const color = COLORS[idx % COLORS.length];
    return {
      rubric,
      amount,
      percentage,
      color,
      count: categoryTotals[rubric].count,
      items: categoryTotals[rubric].items,
      costPerGuest: config.nbInvites > 0 ? Math.round(amount / config.nbInvites) : 0,
    };
  });

  // Sort descending by amount
  categories.sort((a, b) => b.amount - a.amount);

  // SVG Donut calculation
  let cumulativeAngle = 0;
  const donutSlices = categories.map((cat) => {
    const sliceAngle = (cat.percentage / 100) * 360;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + sliceAngle;
    cumulativeAngle = endAngle;

    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const outerR = 90;
    const innerR = 55;
    const cx = 100;
    const cy = 100;

    const x1 = cx + outerR * Math.cos(startRad);
    const y1 = cy + outerR * Math.sin(startRad);
    const x2 = cx + outerR * Math.cos(endRad);
    const y2 = cy + outerR * Math.sin(endRad);

    const x3 = cx + innerR * Math.cos(endRad);
    const y3 = cy + innerR * Math.sin(endRad);
    const x4 = cx + innerR * Math.cos(startRad);
    const y4 = cy + innerR * Math.sin(startRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;

    const pathData =
      sliceAngle >= 359.9
        ? `M ${cx} ${cy - outerR} A ${outerR} ${outerR} 0 1 0 ${cx} ${cy + outerR} A ${outerR} ${outerR} 0 1 0 ${cx} ${cy - outerR} M ${cx} ${cy - innerR} A ${innerR} ${innerR} 0 1 1 ${cx} ${cy + innerR} A ${innerR} ${innerR} 0 1 1 ${cx} ${cy - innerR} Z`
        : `M ${x1} ${y1} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x4} ${y4} Z`;

    return {
      ...cat,
      pathData,
      startAngle,
      endAngle,
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Cards: Visual Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Donut Chart */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-between mb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PieChart className="w-4 h-4 text-amber-600" />
              Diagramme de Répartition
            </h3>
            <span className="text-[11px] text-slate-500">Sur {categories.length} rubriques</span>
          </div>

          <div className="relative w-56 h-56 my-2">
            <svg viewBox="0 0 200 200" className="w-full h-full transform transition-all">
              {donutSlices.map((slice) => {
                const isHovered = hoveredCategory === slice.rubric;
                return (
                  <path
                    key={slice.rubric}
                    d={slice.pathData}
                    fill={slice.color}
                    opacity={hoveredCategory ? (isHovered ? 1 : 0.4) : 0.9}
                    stroke="#ffffff"
                    strokeWidth={2}
                    className="cursor-pointer transition-all duration-200 hover:opacity-100"
                    onMouseEnter={() => setHoveredCategory(slice.rubric)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  />
                );
              })}
            </svg>

            {/* Donut Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
              {hoveredCategory ? (
                (() => {
                  const active = categories.find((c) => c.rubric === hoveredCategory);
                  return active ? (
                    <div>
                      <span className="text-[10px] text-slate-600 font-medium line-clamp-1">
                        {active.rubric}
                      </span>
                      <strong className="text-sm font-bold text-slate-900 block font-mono">
                        {Math.round(active.percentage)}%
                      </strong>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {formatCurrency(active.amount, config.currency)}
                      </span>
                    </div>
                  ) : null;
                })()
              ) : (
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                    Total
                  </span>
                  <span className="text-xs font-bold text-slate-900 block font-mono">
                    {formatCurrency(directTotal, config.currency)}
                  </span>
                  <span className="text-[10px] text-slate-500">{config.nbInvites} pers.</span>
                </div>
              )}
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center mt-1">
            Survolez une section pour afficher les montants par rubrique
          </p>
        </div>

        {/* Right: Detailed Category Distribution Bars */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              Poids Budgétaire par Rubrique
            </h3>
            <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              Poste Majeur : {categories[0]?.rubric || 'N/A'}
            </span>
          </div>

          <div className="space-y-3 flex-1 justify-center flex flex-col">
            {categories.map((cat) => {
              const isHovered = hoveredCategory === cat.rubric;
              return (
                <div
                  key={cat.rubric}
                  className={`p-2 rounded-xl transition-all ${
                    isHovered ? 'bg-slate-100 ring-1 ring-slate-300' : 'hover:bg-slate-50'
                  }`}
                  onMouseEnter={() => setHoveredCategory(cat.rubric)}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="flex justify-between items-center text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="font-semibold text-slate-800">{cat.rubric}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 text-[11px]">
                        ~{formatCurrency(cat.costPerGuest, config.currency)}/pers.
                      </span>
                      <strong className="font-bold text-slate-900 font-mono">
                        {formatCurrency(cat.amount, config.currency)}
                      </strong>
                      <span className="font-bold text-amber-600 w-10 text-right">
                        {cat.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${cat.percentage}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Guest Ratio Analysis Banner */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-xs font-semibold text-slate-500 block uppercase">
            Restauration & Boissons / Invité
          </span>
          <div className="text-xl font-bold text-slate-900 mt-1 font-serif">
            {formatCurrency(
              categoryTotals['Restauration & Bar']
                ? Math.round(categoryTotals['Restauration & Bar'].amount / config.nbInvites)
                : 0,
              config.currency
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Buffet chaud, cocktail, desserts & cave à vins
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-xs font-semibold text-slate-500 block uppercase">
            Lieu & Cadre / Invité
          </span>
          <div className="text-xl font-bold text-slate-900 mt-1 font-serif">
            {formatCurrency(
              categoryTotals['Lieu & Mobilier']
                ? Math.round(categoryTotals['Lieu & Mobilier'].amount / config.nbInvites)
                : 0,
              config.currency
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {config.typeLieu} (chaises, chapiteaux, tables)
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
          <span className="text-xs font-semibold text-slate-500 block uppercase">
            Décoration & Scénographie / Invité
          </span>
          <div className="text-xl font-bold text-slate-900 mt-1 font-serif">
            {formatCurrency(
              categoryTotals['Décoration & Ambience']
                ? Math.round(categoryTotals['Décoration & Ambience'].amount / config.nbInvites)
                : 0,
              config.currency
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Arches florales, pupitres, nappes & lumières
          </p>
        </div>
      </div>
    </div>
  );
};
