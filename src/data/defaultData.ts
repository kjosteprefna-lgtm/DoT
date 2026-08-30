import { BudgetItem, DoteItem, Milestone, WeddingConfig, StandingLevel, GuestItem } from '../types';

export const INITIAL_CONFIG: WeddingConfig = {
  ville: 'Pointe-Noire',
  customCity: '',
  nbInvites: 400, // 200 couples
  typeLieu: 'Pelouse / Jardin plein air',
  inclusCoutumier: true,
  inclusReligieux: true,
  standing: 'Standard / Équilibré',
  weddingDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  coupleNames: 'Judia Mpembele & Joste Kodia',
  currency: 'XAF',
  usdToXafRate: 600,
};

export const STANDING_RATES = {
  cout_couvert: {
    'Économique': 3500,
    'Standard / Équilibré': 5500,
    'Haut de Gamme / VIP': 9000,
  },
  cout_lieu: {
    'Économique': 300000,
    'Standard / Équilibré': 500000,
    'Haut de Gamme / VIP': 1000000,
  },
  cout_deco: {
    'Économique': 350000,
    'Standard / Équilibré': 700000,
    'Haut de Gamme / VIP': 1500000,
  },
  cout_coutumier: {
    'Économique': 800000,
    'Standard / Équilibré': 1200000,
    'Haut de Gamme / VIP': 1200000,
  },
  cout_tenues: {
    'Économique': 600000,
    'Standard / Équilibré': 1000000,
    'Haut de Gamme / VIP': 1000000,
  },
  cout_animation: {
    'Économique': 500000,
    'Standard / Équilibré': 850000,
    'Haut de Gamme / VIP': 850000,
  },
  cout_religieux: 200000,
};

export const DEFAULT_DOTE_ITEMS: DoteItem[] = [
  // 1. Côté Papa (18 items)
  { id: 'p1', code: '1.1', category: 'papa', article: 'Costume complet + couture', usd: 100, statut: 'À acheter', note: 'Sur-mesure chez maître tailleur' },
  { id: 'p2', code: '1.2', category: 'papa', article: 'Paire de souliers', usd: 30, statut: 'À acheter', note: 'Cuir noir ou marron' },
  { id: 'p3', code: '1.3', category: 'papa', article: 'Chemise + cravate + ceinture', usd: 15, statut: 'À acheter', note: 'Ensemble coordonné' },
  { id: 'p4', code: '1.4', category: 'papa', article: '1 Pièce super wax hollandais + babouche + mouchoir', usd: 60, statut: 'À acheter', note: 'Motif authentique Vlisco' },
  { id: 'p5', code: '1.5', category: 'papa', article: '20 Casiers bières (5 sucres / 15 bières)', usd: 200, statut: 'À acheter', note: 'Achat direct au dépôt grossiste' },
  { id: 'p6', code: '1.6', category: 'papa', article: 'Espèces (bières / sucres)', usd: 100, statut: 'En réserve', note: 'Enveloppe compensation' },
  { id: 'p7', code: '1.7', category: 'papa', article: '1 Bassin', usd: 25, statut: 'À acheter', note: 'Grand format émaillé/plastique' },
  { id: 'p8', code: '1.8', category: 'papa', article: '1 Dame-jeanne vin rouge', usd: 40, statut: 'À acheter', note: 'Vin de fête' },
  { id: 'p9', code: '1.9', category: 'papa', article: '1 Johny Walker', usd: 10, statut: 'À acheter', note: 'Bouteille de prestige' },
  { id: 'p10', code: '1.10', category: 'papa', article: '1 Farde cigarette', usd: 1, statut: 'À acheter', note: 'Symbole coutumier' },
  { id: 'p11', code: '1.11', category: 'papa', article: '1 Coq + poule (vivants)', usd: 5, statut: 'À acheter', note: 'Achat marché local Kasangulu/Kin' },
  { id: 'p12', code: '1.12', category: 'papa', article: '1 Machette', usd: 10, statut: 'À acheter', note: 'Outil traditionnel neuf' },
  { id: 'p13', code: '1.13', category: 'papa', article: '1 Carton poissons salés', usd: 60, statut: 'À acheter', note: 'Makayabu première qualité' },
  { id: 'p14', code: '1.14', category: 'papa', article: '1 Sachet sucre', usd: 10, statut: 'À acheter', note: 'Sucre de canne' },
  { id: 'p15', code: '1.15', category: 'papa', article: '1 Sac sel', usd: 15, statut: 'À acheter', note: 'Sac scellé' },
  { id: 'p16', code: '1.16', category: 'papa', article: '1 Couverture léopard', usd: 40, statut: 'À acheter', note: 'Couverture chaude d’honneur' },
  { id: 'p17', code: '1.17', category: 'papa', article: '1 Groupe électrogène', usd: 230, statut: 'À acheter', note: 'Générateur essence autonome' },
  { id: 'p18', code: '1.18', category: 'papa', article: 'Dot en espèces (retenu)', usd: 1000, statut: 'En réserve', note: 'Négocié de 1500$ à 1000$' },

  // 2. Côté Maman (12 items)
  { id: 'm1', code: '2.1', category: 'maman', article: '1 Pièce super wax hollandais + couture', usd: 50, statut: 'À acheter', note: 'Pagne de cérémonie' },
  { id: 'm2', code: '2.2', category: 'maman', article: '1 Foulard + 2 babouches', usd: 20, statut: 'À acheter', note: 'Accessoires complets' },
  { id: 'm3', code: '2.3', category: 'maman', article: '1 Marmite ma famille', usd: 25, statut: 'À acheter', note: 'Grande marmite aluminium' },
  { id: 'm4', code: '2.4', category: 'maman', article: '1 Sac sel', usd: 15, statut: 'À acheter', note: 'Pur symbole de paix' },
  { id: 'm5', code: '2.5', category: 'maman', article: '1 Bassin libala bosembo', usd: 60, statut: 'À acheter', note: 'Bassin nuptial garni' },
  { id: 'm6', code: '2.6', category: 'maman', article: '1 Sac sucre (50 kg)', usd: 40, statut: 'À acheter', note: 'Sac 50kg raffinerie' },
  { id: 'm7', code: '2.7', category: 'maman', article: '1 Couverture léopard', usd: 40, statut: 'À acheter', note: 'Symbole de dignité et de chaleur' },
  { id: 'm8', code: '2.8', category: 'maman', article: '1 Pardessus chef de famille', usd: 10, statut: 'À acheter', note: 'Veste chaude' },
  { id: 'm9', code: '2.9', category: 'maman', article: '1 Houe + machette', usd: 10, statut: 'À acheter', note: 'Outils de culture' },
  { id: 'm10', code: '2.10', category: 'maman', article: '1 Coq vivant', usd: 3, statut: 'À acheter', note: 'Bel oiseau sain' },
  { id: 'm11', code: '2.11', category: 'maman', article: '9 Casiers (7 sucres / 7 bières) + Espèces', usd: 135, statut: 'À acheter', note: 'Boissons fraîches pour la famille maternelle' },
  { id: 'm12', code: '2.12', category: 'maman', article: 'Dot en espèces (retenu)', usd: 700, statut: 'En réserve', note: 'Négocié de 1000$ à 700$' },

  // 3. Imprévus & Logistique Coutumière (6 items)
  { id: 'i1', code: '3.1', category: 'imprevus', article: 'Amendes coutumières & Retards (Protocoles / Oncles)', usd: 100, statut: 'Réserve cash', note: 'Pour le porte-parole / marieur' },
  { id: 'i2', code: '3.2', category: 'imprevus', article: "Frais d'ouverture de porte & Entrée cortège (Portier)", usd: 50, statut: 'Réserve cash', note: 'Enveloppe en petites coupures' },
  { id: 'i3', code: '3.3', category: 'imprevus', article: 'Enveloppes surprise (Demandes tantes / grands-parents)', usd: 100, statut: 'Réserve cash', note: 'Droit de parole et bénédictions' },
  { id: 'i4', code: '3.4', category: 'imprevus', article: 'Fluctuation des prix du marché local (Vivres / Bétail)', usd: 75, statut: 'En réserve', note: 'Marge hausses ponctuelles' },
  { id: 'i5', code: '3.5', category: 'imprevus', article: 'Manutention, Transport & Emballage des biens', usd: 100, statut: 'À acheter', note: 'Location camionnette et porteurs' },
  { id: 'i6', code: '3.6', category: 'imprevus', article: 'Restauration rapide & Boissons des porteurs', usd: 50, statut: 'À acheter', note: 'Rafraîchissements équipe cortège' },
];

export function generateDefaultBudget(config: WeddingConfig): BudgetItem[] {
  const standing = config.standing as StandingLevel;
  const items: BudgetItem[] = [];

  if (config.inclusCoutumier) {
    items.push({
      id: 'coutumier_rdc',
      rubric: 'Mariage Coutumier RDC',
      item: 'Dot, Traversée Brazza-Kin & Réception Kasangulu',
      baseAmount: STANDING_RATES.cout_coutumier[standing],
      note: 'Dote officielle négociée, billets canot/traversée VIP, séjour hébergement et banquet coutumier',
    });
  }

  if (config.inclusReligieux) {
    items.push({
      id: 'religieux',
      rubric: 'Formalités & Église',
      item: 'Mairie de Pointe-Noire, Publication des bans & Paroisse',
      baseAmount: STANDING_RATES.cout_religieux,
      note: 'Dossier d’état civil, timbres fiscaux, quittance mairie, célébration religieuse et chorale',
    });
  }

  items.push(
    {
      id: 'tenues',
      rubric: 'Tenues & Beauté',
      item: 'Costumes Marié/Enfants, Robe Mariée, Make-up & Alliances Or',
      baseAmount: STANDING_RATES.cout_tenues[standing],
      note: 'Location robe mariée VIP, costume 3 pièces marié, tenues enfants, pagnes de cérémonie parents & alliances 18K',
    },
    {
      id: 'lieu',
      rubric: 'Lieu & Mobilier (Pelouse)',
      item: `Espace Pelouse, Chapiteaux VIP, 400 Chaises habillées & Tables rondes`,
      baseAmount: STANDING_RATES.cout_lieu[standing],
      note: `Cadre sélectionné: ${config.typeLieu} (${config.ville === 'Autre' ? config.customCity || 'Pointe-Noire' : config.ville})`,
    },
    {
      id: 'restauration',
      rubric: 'Restauration & Bar',
      item: `Buffet chaud complet & Boissons en gros (${config.nbInvites} invités / 200 couples)`,
      baseAmount: config.nbInvites * STANDING_RATES.cout_couvert[standing],
      note: `Base calculée à ${STANDING_RATES.cout_couvert[standing].toLocaleString('fr-FR')} XAF / invité (cocktail, entrées, 3 plats chauds, desserts et boissons)`,
    },
    {
      id: 'rotisserie',
      rubric: 'Restauration & Bar',
      item: 'Rôtisserie Live : 1 Porc entier + 1 Mouton braisé & Maître rôtisseur',
      baseAmount: 250000,
      note: 'Achat direct bétail + prestation charbon et découpe en direct devant les invités',
    },
    {
      id: 'deco',
      rubric: 'Décoration & Ambience',
      item: 'Scénographie Pelouse, Coin Mariés avec Photo, Guirlandes Warm & Vaisselle',
      baseAmount: STANDING_RATES.cout_deco[standing],
      note: 'Photocall personnalisé, allée de tapis, fleurs, chandeliers dorés et vaisselle complète',
    },
    {
      id: 'animation',
      rubric: 'Animation & Média',
      item: 'Sonorisation Extérieure, DJ Pro, MC & Couverture Photo/Vidéo HD',
      baseAmount: STANDING_RATES.cout_animation[standing],
      note: 'Maître de cérémonie (MC), sonorisation plein air, 2 photographes/vidéastes, album VIP et film HD',
    },
    {
      id: 'securite',
      rubric: 'Sécurité & Logistique',
      item: '4 Vigiles filtrage entrée pelouse & Carburant cortège',
      baseAmount: 200000,
      note: 'Contrôle strict des invitations et gestion des flux parking',
    }
  );

  return items;
}

export const DEFAULT_MILESTONES: Milestone[] = [
  {
    id: 'm1',
    period: 'M-12 à M-8',
    title: 'Vision, Budget Cible & Liste Invités',
    description: 'Fixer le budget cible (8,8M à 11,8M XAF), déterminer la jauge de 200 couples (400 invités) et caler les dates du coutumier en RDC et de la réception à Pointe-Noire.',
    targetMonthsBefore: 10,
    completed: false,
    category: 'Général',
    notes: 'Réunir les comités d’organisation des deux familles pour harmoniser les attentes.',
  },
  {
    id: 'm2',
    period: 'M-8 à M-6',
    title: 'Réservation Pelouse & Traiteur Principal',
    description: 'Bloquer l’espace pelouse à Pointe-Noire (ex: Côte Sauvage ou jardin privé), négocier le package chapiteaux + 400 chaises et valider le menu buffet.',
    targetMonthsBefore: 7,
    completed: false,
    category: 'Logistique',
    notes: 'Verser l’acompte et vérifier la disponibilité d’un groupe électrogène autonome de secours.',
  },
  {
    id: 'm3',
    period: 'M-6 à M-4',
    title: 'Tenues, Robe VIP, Alliances & Achats Dote',
    description: 'Confectionner les tenues sur-mesure (costume marié, pagnes hollandais), louer la robe de mariée VIP, commander les alliances 18K et préparer les achats dote Côté Papa/Maman.',
    targetMonthsBefore: 5,
    completed: false,
    category: 'Beauté & Dote',
    notes: 'Acheter les pièces de super wax et négocier les articles de la facture dote.',
  },
  {
    id: 'm4',
    period: 'M-4 à M-2',
    title: 'Formalités Mairie, Église & Billets Traversée RDC',
    description: 'Déposer le dossier d’état civil à la Mairie de Pointe-Noire, caler la messe de bénédiction et réserver les billets canot/traversée VIP pour Kinshasa / Kasangulu.',
    targetMonthsBefore: 3,
    completed: false,
    category: 'Administratif',
    notes: 'Vérifier la validité des passeports/laissez-passer et certificats de vaccination.',
  },
  {
    id: 'm5',
    period: 'M-2 à M-1',
    title: 'Célébration Coutumière RDC & Envoi Faire-part',
    description: 'Célébrer la dote en RDC avec remise théâtralisée des biens, finaliser la déco lumineuse pelouse, le DJ/MC et diffuser les 200 invitations couples.',
    targetMonthsBefore: 1.5,
    completed: false,
    category: 'Cérémonie & Prestataires',
    notes: 'Garder l’enveloppe de réserve en petites coupures pour les amendes et portiers.',
  },
  {
    id: 'm6',
    period: 'J-15 à J-2',
    title: 'Plan de Table, Achat Boissons Gros & Rôtisserie',
    description: 'Acheter les casiers et cartons de vin en gros, réserver le cochon et le mouton avec le maître rôtisseur, et briefer les 4 vigiles à l’entrée.',
    targetMonthsBefore: 0.5,
    completed: false,
    category: 'Finitions',
    notes: 'Désigner le marieur/coordinateur du Jour J pour la supervision.',
  },
  {
    id: 'm7',
    period: 'Jour J',
    title: 'Mairie, Bénédiction & Grande Soirée Pelouse',
    description: 'Profiter pleinement de chaque instant avec vos 400 invités, déguster les grillades en direct et célébrer votre union dans la joie !',
    targetMonthsBefore: 0,
    completed: false,
    category: 'Célébration',
    notes: 'Hydratez-vous, souriez aux caméras et créez des souvenirs inoubliables !',
  }
];

export const AI_VISUAL_PRESETS = [
  {
    id: 'invitation_luxury',
    title: "Carte d'Invitation Luxe (Cadre Photo Réservé)",
    support: "Invitation A5 / Numérique",
    promptTemplate: "Luxury wedding invitation card placed on a textured linen table, surrounded by tropical green leaves, eucalyptus, and white orchids. In the center, an elegant blank oval frame placeholder with soft shadow, labeled 'PHOTO MARIÉS ICI'. Refined gold foil calligraphy reading '{names}', high resolution, photorealistic, 8k, wedding stationery mockup.",
    description: "Parfait pour imprimer sur papier texturé avec dorure à chaud et insérer la photo de Judia Mpembele & Joste Kodia."
  },
  {
    id: 'welcome_board',
    title: "Bannière d'Entrée Pelouse / Grand Format",
    support: "Panneau d'Accueil A1 / X-Banner",
    promptTemplate: "A large vertical wedding welcome board standing at the entrance of a lush green lawn garden reception in Kasangulu / Pointe-Noire. Decorated with a majestic arch of pampas grass, monstera leaves and white roses. In the center, a clean rectangular blank area with subtle border for couple photo insertion. Elegant typography reading 'WELCOME TO THE WEDDING OF {names}', golden hour sunset lighting, photorealistic --ar 9:16",
    description: "Placée à l'entrée de la pelouse avec éclairage guirlandes et coin photo."
  },
  {
    id: 'table_menu',
    title: "Menu de Table Individuel & Carte Chevalet",
    support: "Menu Assiette / Chevalet de Table",
    promptTemplate: "An elegant wedding dinner menu card resting on a gold rimmed porcelain plate, surrounded by crystal glassware, gold cutlery and linen napkin. Top center features a subtle blank circular medallion photo frame placeholder for the bride and groom portrait. Fine calligraphy typography reading '{names}', warm candlelit ambient lighting, highly detailed 8k.",
    description: "Posé sur les 40 tables rondes avec le menu détaillé des 3 plats et rôtisserie."
  },
  {
    id: 'lawn_decor',
    title: "Scénographie Pelouse Écrin Vert & Guirlandes",
    support: "Vue d'ensemble Décoration Extérieure",
    promptTemplate: "Cinematic wide angle view of an outdoor luxury African wedding reception on a manicured green lawn in Pointe-Noire. Open white draped marquees with sheer peach chiffon fabrics, wooden dance floor, hanging fairy lights string lights glowing in the twilight. Bamboo ceremonial arch adorned with orchids and tropical palms, 40 round banquet tables with gold chairs, photorealistic 8k.",
    description: "Aménagement complet de l'espace extérieur avec piste de danse et chapiteaux ouverts."
  }
];

export const CITY_TIPS: Record<string, string> = {
  'Pointe-Noire': 'À Ponton la belle, privilégiez les lieux en bord de côte (Côte Sauvage, Mpita) ou les jardins pelouse aérés. Négociez le forfait chapiteaux + chaises auprès d’un loueur unique.',
  'Brazzaville': 'À Brazza, anticipez les embouteillages vers Bacongo, Moungali ou Poto-Poto pour le cortège. Prévoyez une sonorisation puissante.',
  'Kinshasa': 'À Kinshasa, prévoyez une marge d’invités supplémentaire (+15%) et un dispositif de sécurité rigoureux à l’entrée de la salle.',
  'Kasangulu': 'À Kasangulu (Bas-Congo), prévoyez les achats de vivres et bétail au marché local et une réserve cash en petites coupures pour le protocole coutumier.',
  'Autre': 'Assurez-vous de la disponibilité d’un groupe électrogène de secours et d’une réserve d’eau pour la cuisine et les sanitaires.',
};

export const IDEES_PLUS_MEILLEUR = [
  {
    id: 'idea1',
    icon: '🌸',
    title: 'Signature Olfactive & Bougies Souvenirs',
    category: 'Expérience Sensorielle',
    description: 'Diffuser un parfum subtil et envoûtant (notes de fleurs de tiaré, vanille et musc blanc) à l’entrée sous les chapiteaux. Offrir à chaque couple invité une mini-bougie personnalisée assortie.',
    benefit: 'Chaque invité associera à jamais cette fragrance au jour mémorable de votre mariage.',
    estimatedCost: '150 000 XAF',
  },
  {
    id: 'idea2',
    icon: '🥁',
    title: 'Présentation Scénarisée & Rythmée de la Dote',
    category: 'Tradition & Spectacle',
    description: 'Transformer la remise des biens de la dote (costume complet, pagnes wax, groupe électrogène, bétail) en un véritable défilé dansé et chanté, où chaque porteur met en scène son présent devant la belle-famille.',
    benefit: 'Crée une ambiance festive électrisante qui honore profondément la tradition et détend les négociations.',
    estimatedCost: '50 000 XAF',
  },
  {
    id: 'idea3',
    icon: '📺',
    title: 'Écran Géant LED & Live Feed Vidéo',
    category: 'Média & Confort Invités',
    description: 'Installer un écran LED extérieur pour que les 400 invités (200 couples) profitent pleinement de la cérémonie sans se lever. Diffuser juste après un mini-film récapitulatif de la dote en RDC.',
    benefit: 'Garantit que chaque invité, même au fond de la pelouse, voie les sourires, les vœux et les échanges des bagues.',
    estimatedCost: '300 000 XAF',
  },
  {
    id: 'idea4',
    icon: '🥩',
    title: 'Rôtisserie Live & Show Cooking Pelouse',
    category: 'Gastronomie & Convivialité',
    description: 'Mettre en scène un atelier grillade en plein air avec le cochon entier et le mouton rôtis sur braises de bois par un chef rôtisseur professionnel en tenue blanche.',
    benefit: 'Un spectacle culinaire impressionnant et des viandes ultra-savoureuses servies croustillantes et chaudes.',
    estimatedCost: 'Inclus dans le budget',
  },
  {
    id: 'idea5',
    icon: '🌿',
    title: 'L’Alcôve VIP des Mariés avec Balançoire Florale',
    category: 'Scénographie & Photocall',
    description: 'Remplacer les traditionnels fauteuils isolés par une alcôve à ciel ouvert sur la pelouse, équipée d’une balançoire décorée de lianes fleuries, de voilages doux et d’un grand cadre photo personnalisé.',
    benefit: 'Un coin photo spectaculaire pour le couple et des souvenirs magiques pour les albums photo et réseaux.',
    estimatedCost: '200 000 XAF',
  },
  {
    id: 'idea6',
    icon: '🌱',
    title: 'Le Cadeau "Vivant" (Plantes Succulentes Gravées)',
    category: 'Cadeau Invités Éco-Chic',
    description: 'Remplacer les dragées classiques par de ravissantes petites plantes succulentes en pot de terre cuite ou céramique marquée "Mama Judia & Ndombe - Que notre amour grandisse".',
    benefit: 'Un souvenir vivant et durable que chaque foyer conservera chez soi pendant des années.',
    estimatedCost: '180 000 XAF',
  },
  {
    id: 'idea7',
    icon: '⏱️',
    title: 'Protocole Fluidifié & Zéro Temps Morts',
    category: 'Organisation & Rythme',
    description: 'Confier l’ordonnancement à un maître de cérémonie (MC) charismatique avec un timing strict (transition de 30 min max entre cérémonie civile et cocktail) avec fond musical acoustique.',
    benefit: 'Évite la fatigue des invités, maintient une énergie festive continue jusqu’à la fin de la nuit.',
    estimatedCost: 'Inclus MC',
  },
];

export const DEFAULT_GUESTS: GuestItem[] = [
  {
    id: 'g1',
    type: 'Couple',
    nomCouple: 'M. & Mme Kodia',
    prenom: 'Joste & Épouse',
    nombrePersonnes: 2,
    cote: 'Marié',
    statut: 'Confirmé',
    tableAllocation: 'Table Honorifique',
    telephone: '+242 06 000 0000',
    notes: 'Famille proche / Témoin',
    whatsappSentAt: '2026-08-15 10:30',
    confirmationDate: '2026-08-15 14:20',
    confirmedCount: 2,
    rsvpMessage: 'Félicitations aux futurs mariés ! Nous serons bien présents tous les deux au premier rang.',
    rsvpResponseMethod: 'WhatsApp',
  },
  {
    id: 'g2',
    type: 'Couple',
    nomCouple: 'Famille Mpembele',
    prenom: 'Grands-Parents & Suite',
    nombrePersonnes: 4,
    cote: 'Mariée',
    statut: 'Confirmé',
    tableAllocation: 'Table Famille Mariée',
    telephone: '+243 81 000 0000',
    notes: 'Délégation Kasangulu RDC',
    whatsappSentAt: '2026-08-16 09:15',
    confirmationDate: '2026-08-16 11:45',
    confirmedCount: 4,
    rsvpMessage: 'Toute la famille de Kasangulu confirme sa venue. Bénédiction sur Judia et Joste !',
    rsvpResponseMethod: 'WhatsApp',
  },
  {
    id: 'g3',
    type: 'Individuel',
    nomCouple: 'Mboungou',
    prenom: 'Wilfrid',
    nombrePersonnes: 1,
    cote: 'Marié',
    statut: 'Confirmé',
    tableAllocation: 'Table VIP 1',
    telephone: '+242 05 500 1122',
    notes: 'Collègue & Ami d’enfance',
    whatsappSentAt: '2026-08-18 16:00',
    confirmationDate: '2026-08-19 08:30',
    confirmedCount: 1,
    rsvpMessage: 'Présent avec grand plaisir pour soutenir mon frère Joste.',
    rsvpResponseMethod: 'Lien en ligne',
  },
  {
    id: 'g4',
    type: 'Couple',
    nomCouple: 'M. & Mme Makosso',
    prenom: 'Jean-Pierre & Claire',
    nombrePersonnes: 2,
    cote: 'Mariée',
    statut: 'Invité',
    tableAllocation: 'Table VIP 2',
    telephone: '+242 06 612 3456',
    notes: 'Carton doré remis en main propre',
    whatsappSentAt: '2026-08-20 12:00',
  },
  {
    id: 'g5',
    type: 'Famille/Groupe',
    nomCouple: 'Délégation Oncles Bas-Congo',
    prenom: 'Chef de famille & Notables',
    nombrePersonnes: 6,
    cote: 'Mariée',
    statut: 'Confirmé',
    tableAllocation: 'Table Coutume RDC',
    telephone: '+243 89 777 8899',
    notes: 'Protocole & Porte-paroles dote',
    whatsappSentAt: '2026-08-10 14:00',
    confirmationDate: '2026-08-12 18:00',
    confirmedCount: 6,
    rsvpMessage: 'Délégation coutumière au complet pour la remise et la bénédiction.',
    rsvpResponseMethod: 'Appel / Direct',
  },
  {
    id: 'g6',
    type: 'Couple',
    nomCouple: 'Dr. & Mme Loubaki',
    prenom: 'Alain & Mireille',
    nombrePersonnes: 2,
    cote: 'Commun / VIP',
    statut: 'Confirmé',
    tableAllocation: 'Table VIP 1',
    telephone: '+242 05 123 4567',
    notes: 'Parrain & Marraine spirituels',
    whatsappSentAt: '2026-08-14 09:00',
    confirmationDate: '2026-08-14 15:30',
    confirmedCount: 2,
    rsvpMessage: 'Avec toutes nos prières et notre joie partagée !',
    rsvpResponseMethod: 'WhatsApp',
  },
  {
    id: 'g7',
    type: 'Couple',
    nomCouple: 'M. & Mme Samba',
    prenom: 'Patrick & Solange',
    nombrePersonnes: 2,
    cote: 'Marié',
    statut: 'À inviter',
    tableAllocation: 'Table Amis Marié',
    telephone: '+242 06 900 1122',
    notes: 'À relancer pour le faire-part',
  },
  {
    id: 'g8',
    type: 'Individuel',
    nomCouple: 'Massamba',
    prenom: 'Chantal',
    nombrePersonnes: 1,
    cote: 'Mariée',
    statut: 'Invité',
    tableAllocation: 'Table Amies Mariée',
    telephone: '+242 04 444 5566',
    notes: 'Demoiselle d’honneur',
    whatsappSentAt: '2026-08-22 17:10',
  },
];


