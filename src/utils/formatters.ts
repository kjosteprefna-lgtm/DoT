import { BudgetItem, Milestone, WeddingConfig } from '../types';

export function formatCurrency(amount: number, currency: string = 'XAF'): string {
  if (currency === 'EUR') {
    // Approx 1 EUR = 655.957 XAF
    const inEur = amount / 655.957;
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(inEur);
  } else if (currency === 'USD') {
    // Approx 1 USD = 605 XAF
    const inUsd = amount / 605;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(inUsd);
  }
  
  // Default XAF / FCFA
  return `${new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(amount)} XAF`;
}

export function computeBudgetTotals(items: BudgetItem[]) {
  const directTotal = items.reduce((acc, item) => {
    const val = item.customAmount !== undefined ? item.customAmount : item.baseAmount;
    return acc + (Number(val) || 0);
  }, 0);

  const reserveImprevus = Math.round(directTotal * 0.10);
  const totalGeneral = directTotal + reserveImprevus;

  const totalPaid = items.reduce((acc, item) => acc + (Number(item.paidAmount) || 0), 0);
  const remainingToPay = totalGeneral - totalPaid;

  return {
    directTotal,
    reserveImprevus,
    totalGeneral,
    totalPaid,
    remainingToPay,
  };
}

export function calculateTargetDate(weddingDateStr: string, monthsBefore: number): string {
  if (!weddingDateStr) return '';
  const d = new Date(weddingDateStr);
  if (isNaN(d.getTime())) return '';
  
  const targetDays = Math.round(monthsBefore * 30.4375);
  const targetDate = new Date(d.getTime() - targetDays * 24 * 60 * 60 * 1000);
  
  return targetDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function generateCSV(items: BudgetItem[], config: WeddingConfig): string {
  const totals = computeBudgetTotals(items);
  
  const headers = ['Rubrique', 'Poste de Dépense', 'Estimation (XAF)', 'Statut / Note'];
  const rows = items.map((i) => {
    const amount = i.customAmount !== undefined ? i.customAmount : i.baseAmount;
    const safeNote = (i.note || '').replace(/"/g, '""');
    return `"${i.rubric}","${i.item.replace(/"/g, '""')}",${amount},"${safeNote}"`;
  });

  rows.push('');
  rows.push(`"RÉCAPITULATIF","Total Direct (Hors Réserve)",${totals.directTotal},""`);
  rows.push(`"RÉCAPITULATIF","Réserve de Sécurité (10%)",${totals.reserveImprevus},"Pour pallier les ajustements de dernière minute"`);
  rows.push(`"RÉCAPITULATIF","BUDGET GLOBAL RECOMMANDÉ",${totals.totalGeneral},"Estimation complète recommandée"`);
  rows.push('');
  rows.push(`"PARAMÈTRES","Ville : ${config.ville === 'Autre' ? config.customCity : config.ville} | Invités : ${config.nbInvites} | Standing : ${config.standing}",,""`);

  return [headers.join(','), ...rows].join('\n');
}

export function downloadCSVFile(content: string, filename = 'simulation_budget_mariage.csv') {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function generateShareableWhatsAppText(
  config: WeddingConfig,
  items: BudgetItem[],
  totals: { directTotal: number; reserveImprevus: number; totalGeneral: number }
): string {
  const city = config.ville === 'Autre' ? config.customCity || 'Autre' : config.ville;
  const costPerGuest = Math.round(totals.directTotal / (config.nbInvites || 1));
  
  let text = `💍 *SIMULATION & PLANNING DE MARIAGE* 💍\n`;
  if (config.coupleNames) text += `🤵👰 *${config.coupleNames}*\n`;
  text += `📍 *Ville :* ${city}\n`;
  text += `👥 *Nombre d'invités :* ${config.nbInvites} personnes\n`;
  text += `🌟 *Gamme :* ${config.standing}\n`;
  text += `🏛️ *Cadre :* ${config.typeLieu}\n\n`;

  text += `📋 *DÉTAIL DU BUDGET ESTIMÉ :*\n`;
  items.forEach((item, idx) => {
    const amount = item.customAmount !== undefined ? item.customAmount : item.baseAmount;
    text += `${idx + 1}. *${item.rubric}* (${item.item}) : ${amount.toLocaleString('fr-FR')} XAF\n`;
  });

  text += `\n━━━━━━━━━━━━━━━━━━━━\n`;
  text += `💰 *Budget Estimé Direct :* ${totals.directTotal.toLocaleString('fr-FR')} XAF\n`;
  text += `🛡️ *Réserve de Sécurité (+10%) :* ${totals.reserveImprevus.toLocaleString('fr-FR')} XAF\n`;
  text += `🏆 *BUDGET GLOBAL CONSEILLÉ :* ${totals.totalGeneral.toLocaleString('fr-FR')} XAF\n`;
  text += `📊 *Moyenne / Invité :* ~${costPerGuest.toLocaleString('fr-FR')} XAF / pers.\n`;
  text += `━━━━━━━━━━━━━━━━━━━━\n`;
  text += `_Généré via le Simulateur & Planner Intelligent de Mariage_ ✨`;

  return text;
}
