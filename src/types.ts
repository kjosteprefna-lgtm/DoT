export type StandingLevel = 'Économique' | 'Standard / Équilibré' | 'Haut de Gamme / VIP';

export type City = 'Pointe-Noire' | 'Brazzaville' | 'Kinshasa' | 'Kasangulu' | 'Autre';

export type VenueType = 'Pelouse / Jardin plein air' | 'Salle des fêtes VIP' | 'Espace mixte';

export interface BudgetItem {
  id: string;
  rubric: string;
  item: string;
  baseAmount: number;
  customAmount?: number;
  note?: string;
  paidAmount?: number;
  isCustom?: boolean;
}

export type DoteStatus = 'À acheter' | 'En réserve' | 'Réserve cash' | 'Négocié' | 'Payé / Acheté';

export interface DoteItem {
  id: string;
  code: string;
  category: 'papa' | 'maman' | 'imprevus';
  article: string;
  usd: number;
  statut: DoteStatus;
  note?: string;
  isCustom?: boolean;
}

export interface Milestone {
  id: string;
  period: string;
  title: string;
  description: string;
  targetMonthsBefore: number;
  completed: boolean;
  notes?: string;
  category?: string;
}

export type GuestType = 'Individuel' | 'Couple' | 'Famille/Groupe';
export type GuestSide = 'Marié' | 'Mariée' | 'Commun / VIP';
export type GuestStatus = 'À inviter' | 'Invité' | 'Confirmé' | 'Décliné';

export interface GuestItem {
  id: string;
  type: GuestType;
  nomCouple: string; // Nom / Nom du couple
  prenom?: string;
  nombrePersonnes: number;
  cote: GuestSide;
  statut: GuestStatus;
  tableAllocation: string;
  telephone?: string;
  notes?: string;
  whatsappSentAt?: string;
  confirmationDate?: string;
  confirmedCount?: number;
  rsvpMessage?: string;
  rsvpResponseMethod?: 'WhatsApp' | 'Lien en ligne' | 'Appel / Direct';
}

export interface WeddingConfig {
  ville: City;
  customCity: string;
  nbInvites: number;
  typeLieu: VenueType;
  inclusCoutumier: boolean;
  inclusReligieux: boolean;
  standing: StandingLevel;
  weddingDate: string;
  coupleNames: string;
  currency: 'XAF' | 'EUR' | 'USD';
  usdToXafRate: number;
}
