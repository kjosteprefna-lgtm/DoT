import React, { useState, useMemo } from 'react';
import { 
  Users, UserPlus, Search, Download, Copy, CheckCircle2, 
  Trash2, Edit3, Heart, Phone, Sparkles, Check, Send, 
  MessageSquare, MessageCircle, Clock, Calendar, CheckSquare,
  Share2, ArrowUpRight, AlertCircle, Eye, XCircle
} from 'lucide-react';
import { GuestItem, GuestType, GuestSide, GuestStatus, WeddingConfig } from '../types';

interface GuestListManagerProps {
  guests: GuestItem[];
  onUpdateGuests: (guests: GuestItem[]) => void;
  config: WeddingConfig;
}

export const GuestListManager: React.FC<GuestListManagerProps> = ({
  guests,
  onUpdateGuests,
  config,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'liste' | 'retours' | 'envois'>('liste');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('Tous');
  const [filterSide, setFilterSide] = useState<string>('Tous');
  const [filterStatus, setFilterStatus] = useState<string>('Tous');
  const [filterTable, setFilterTable] = useState<string>('Tous');
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [editingGuestId, setEditingGuestId] = useState<string | null>(null);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRecordRsvpModalOpen, setIsRecordRsvpModalOpen] = useState(false);
  const [selectedGuestForRsvp, setSelectedGuestForRsvp] = useState<GuestItem | null>(null);
  const [isRsvpPreviewModalOpen, setIsRsvpPreviewModalOpen] = useState(false);
  const [previewGuest, setPreviewGuest] = useState<GuestItem | null>(null);

  // Form state for adding/editing a guest
  const [formData, setFormData] = useState<Omit<GuestItem, 'id'>>({
    type: 'Couple',
    nomCouple: '',
    prenom: '',
    nombrePersonnes: 2,
    cote: 'Marié',
    statut: 'Invité',
    tableAllocation: 'Table VIP 1',
    telephone: '',
    notes: '',
  });

  // State for recording an RSVP return
  const [rsvpReturnData, setRsvpReturnData] = useState({
    statut: 'Confirmé' as GuestStatus,
    confirmedCount: 2,
    rsvpResponseMethod: 'WhatsApp' as 'WhatsApp' | 'Lien en ligne' | 'Appel / Direct',
    rsvpMessage: '',
  });

  // Formatted wedding date
  const formattedWeddingDate = useMemo(() => {
    try {
      const date = new Date(config.weddingDate);
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return config.weddingDate;
    }
  }, [config.weddingDate]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalPersons = guests.reduce((acc, g) => acc + (Number(g.nombrePersonnes) || 1), 0);
    const confirmedPersons = guests
      .filter((g) => g.statut === 'Confirmé')
      .reduce((acc, g) => acc + (Number(g.confirmedCount !== undefined ? g.confirmedCount : g.nombrePersonnes) || 1), 0);
    const invitedPersons = guests
      .filter((g) => g.statut === 'Invité')
      .reduce((acc, g) => acc + (Number(g.nombrePersonnes) || 1), 0);
    const toInvitePersons = guests
      .filter((g) => g.statut === 'À inviter')
      .reduce((acc, g) => acc + (Number(g.nombrePersonnes) || 1), 0);
    const declinedPersons = guests
      .filter((g) => g.statut === 'Décliné')
      .reduce((acc, g) => acc + (Number(g.nombrePersonnes) || 1), 0);

    const totalCouples = guests.filter((g) => g.type === 'Couple').length;
    const totalCards = guests.length;

    const marieCount = guests
      .filter((g) => g.cote === 'Marié')
      .reduce((acc, g) => acc + (Number(g.nombrePersonnes) || 1), 0);
    const marieeCount = guests
      .filter((g) => g.cote === 'Mariée')
      .reduce((acc, g) => acc + (Number(g.nombrePersonnes) || 1), 0);
    const vipCount = guests
      .filter((g) => g.cote === 'Commun / VIP')
      .reduce((acc, g) => acc + (Number(g.nombrePersonnes) || 1), 0);

    const confirmedGuestsList = guests.filter((g) => g.statut === 'Confirmé');
    const pendingGuestsList = guests.filter((g) => g.statut === 'Invité');
    const sentViaWhatsAppCount = guests.filter((g) => !!g.whatsappSentAt).length;

    // Group by table
    const tableCounts: Record<string, number> = {};
    guests.forEach((g) => {
      const table = g.tableAllocation || 'Non assigné';
      tableCounts[table] = (tableCounts[table] || 0) + (Number(g.nombrePersonnes) || 1);
    });

    return {
      totalPersons,
      confirmedPersons,
      invitedPersons,
      toInvitePersons,
      declinedPersons,
      totalCouples,
      totalCards,
      marieCount,
      marieeCount,
      vipCount,
      tableCounts,
      confirmedGuestsList,
      pendingGuestsList,
      sentViaWhatsAppCount,
      confirmationRate: totalPersons > 0 ? Math.round((confirmedPersons / totalPersons) * 100) : 0,
    };
  }, [guests]);

  // Clean phone number for WhatsApp link with international Congo prefix support
  const sanitizePhoneForWhatsApp = (phone?: string) => {
    if (!phone) return '';
    let cleaned = phone.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('00')) {
      cleaned = cleaned.substring(2);
    }
    // Handle Congo Brazzaville (9 digits starting with 0: 06... / 05... / 04...)
    if (cleaned.startsWith('0') && cleaned.length === 9) {
      cleaned = '242' + cleaned.substring(1);
    } else if (cleaned.startsWith('0') && cleaned.length === 10) {
      // Handle Congo RDC (10 digits starting with 0: 081... / 082...)
      cleaned = '243' + cleaned.substring(1);
    }
    return cleaned;
  };

  // Generate Personalized WhatsApp Message for a Guest
  const generateWhatsAppMessage = (guest: GuestItem) => {
    const names = config.coupleNames || 'Judia Mpembele & Joste Kodia';
    const location = `${config.ville || 'Pointe-Noire'} (${config.typeLieu || 'Pelouse / Jardin'})`;
    
    return `💍 *INVITATION OFFICIELLE AU MARIAGE* 💍

Chèr(e) *${guest.nomCouple}* ${guest.prenom ? `(${guest.prenom})` : ''},

*${names}* ont l'immense joie de vous convier à la célébration de leur mariage !

📅 *Date :* ${formattedWeddingDate}
📍 *Lieu :* ${location}
👥 *Invitation valable pour :* ${guest.nombrePersonnes} personne(s)
🪑 *Table réservée :* ${guest.tableAllocation || 'Table d’Honneur'}

━━━━━━━━━━━━━━━━━━━━
✨ *CONFIRMATION DE VOTRE PRÉSENCE (RSVP) :*
Pour nous permettre de parfaire notre accueil et le service de réception, merci de nous confirmer votre présence dès que possible.

👉 *Répondez simplement à ce message :*
"✅ OUI, NOUS SERONS PRÉSENTS (${guest.nombrePersonnes} personne(s))"
ou
"❌ Malheureusement nous ne pourrons pas être présents"

Au grand plaisir de célébrer ce moment inoubliable ensemble ! ✨❤️`;
  };

  // Trigger Send WhatsApp directly
  const handleSendWhatsAppInvitation = (guest: GuestItem) => {
    const rawPhone = guest.telephone || '';
    const cleanPhone = sanitizePhoneForWhatsApp(rawPhone);
    const message = generateWhatsAppMessage(guest);
    const encoded = encodeURIComponent(message);

    // Update timestamp of sending
    const updated = guests.map((g) =>
      g.id === guest.id
        ? { ...g, whatsappSentAt: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) }
        : g
    );
    onUpdateGuests(updated);

    // Copy to clipboard silently as safety backup
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message).catch(() => {});
    }

    // Direct WhatsApp Web / Mobile redirect URL
    const waUrl = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Open RSVP Record Modal
  const openRecordRsvpModal = (guest: GuestItem) => {
    setSelectedGuestForRsvp(guest);
    setRsvpReturnData({
      statut: guest.statut === 'Décliné' ? 'Décliné' : 'Confirmé',
      confirmedCount: guest.confirmedCount || guest.nombrePersonnes,
      rsvpResponseMethod: guest.rsvpResponseMethod || 'WhatsApp',
      rsvpMessage: guest.rsvpMessage || '',
    });
    setIsRecordRsvpModalOpen(true);
  };

  // Save RSVP Confirmation Return
  const handleSaveRsvpReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuestForRsvp) return;

    const now = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const updated = guests.map((g) => {
      if (g.id === selectedGuestForRsvp.id) {
        return {
          ...g,
          statut: rsvpReturnData.statut,
          confirmedCount: rsvpReturnData.statut === 'Confirmé' ? Number(rsvpReturnData.confirmedCount) : 0,
          rsvpResponseMethod: rsvpReturnData.rsvpResponseMethod,
          rsvpMessage: rsvpReturnData.rsvpMessage,
          confirmationDate: now,
        };
      }
      return g;
    });

    onUpdateGuests(updated);
    setIsRecordRsvpModalOpen(false);
    setSelectedGuestForRsvp(null);
  };

  // Filtered guests
  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      const matchSearch =
        searchTerm === '' ||
        g.nomCouple.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (g.prenom && g.prenom.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (g.telephone && g.telephone.includes(searchTerm)) ||
        (g.tableAllocation && g.tableAllocation.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (g.notes && g.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (g.rsvpMessage && g.rsvpMessage.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchType = filterType === 'Tous' || g.type === filterType;
      const matchSide = filterSide === 'Tous' || g.cote === filterSide;
      const matchStatus = filterStatus === 'Tous' || g.statut === filterStatus;
      const matchTable = filterTable === 'Tous' || g.tableAllocation === filterTable;

      return matchSearch && matchType && matchSide && matchStatus && matchTable;
    });
  }, [guests, searchTerm, filterType, filterSide, filterStatus, filterTable]);

  // Handle Quick Status Change
  const handleStatusChange = (id: string, newStatus: GuestStatus) => {
    const updated = guests.map((g) => {
      if (g.id === id) {
        const now = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
        return {
          ...g,
          statut: newStatus,
          confirmationDate: newStatus === 'Confirmé' ? (g.confirmationDate || now) : g.confirmationDate,
          confirmedCount: newStatus === 'Confirmé' ? (g.confirmedCount || g.nombrePersonnes) : g.confirmedCount,
        };
      }
      return g;
    });
    onUpdateGuests(updated);
  };

  // Handle Inline Change
  const handleFieldChange = (id: string, field: keyof GuestItem, value: any) => {
    const updated = guests.map((g) => (g.id === id ? { ...g, [field]: value } : g));
    onUpdateGuests(updated);
  };

  // Handle Delete
  const handleDeleteGuest = (id: string) => {
    if (confirm('Voulez-vous vraiment retirer cet invité de la liste ?')) {
      const updated = guests.filter((g) => g.id !== id);
      onUpdateGuests(updated);
    }
  };

  // Handle Save Form (Add or Edit)
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nomCouple.trim()) {
      alert('Veuillez renseigner le Nom ou Nom du Couple');
      return;
    }

    if (editingGuestId) {
      const updated = guests.map((g) =>
        g.id === editingGuestId ? { ...g, ...formData } : g
      );
      onUpdateGuests(updated);
      setEditingGuestId(null);
    } else {
      const newGuest: GuestItem = {
        id: 'g_' + Date.now(),
        ...formData,
      };
      onUpdateGuests([newGuest, ...guests]);
    }

    // Reset
    setFormData({
      type: 'Couple',
      nomCouple: '',
      prenom: '',
      nombrePersonnes: 2,
      cote: 'Marié',
      statut: 'Invité',
      tableAllocation: 'Table VIP 1',
      telephone: '',
      notes: '',
    });
    setIsAddModalOpen(false);
  };

  const openEditModal = (guest: GuestItem) => {
    setEditingGuestId(guest.id);
    setFormData({
      type: guest.type,
      nomCouple: guest.nomCouple,
      prenom: guest.prenom || '',
      nombrePersonnes: guest.nombrePersonnes,
      cote: guest.cote,
      statut: guest.statut,
      tableAllocation: guest.tableAllocation,
      telephone: guest.telephone || '',
      notes: guest.notes || '',
    });
    setIsAddModalOpen(true);
  };

  // Export CSV / Excel compatible
  const exportGuestsCSV = () => {
    const headers = [
      'Type',
      'Nom / Nom du Couple',
      'Prénom',
      'Nombre Invités Prévus',
      'Nombre Confirmé Réel',
      'Côté',
      'Statut Invitation',
      'Date Confirmation RSVP',
      'Mode de Réponse',
      'Message des Invités',
      'Date Envoi WhatsApp',
      'Table Allocation',
      'Téléphone',
      'Notes',
    ];

    const rows = guests.map((g) => [
      `"${g.type}"`,
      `"${g.nomCouple.replace(/"/g, '""')}"`,
      `"${(g.prenom || '').replace(/"/g, '""')}"`,
      g.nombrePersonnes,
      g.confirmedCount !== undefined ? g.confirmedCount : (g.statut === 'Confirmé' ? g.nombrePersonnes : 0),
      `"${g.cote}"`,
      `"${g.statut}"`,
      `"${g.confirmationDate || ''}"`,
      `"${g.rsvpResponseMethod || ''}"`,
      `"${(g.rsvpMessage || '').replace(/"/g, '""')}"`,
      `"${g.whatsappSentAt || ''}"`,
      `"${(g.tableAllocation || '').replace(/"/g, '""')}"`,
      `"${(g.telephone || '').replace(/"/g, '""')}"`,
      `"${(g.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Liste_Invites_RSVP_${config.coupleNames.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy WhatsApp Summary
  const copyWhatsAppList = () => {
    let msg = `*💍 LISTE DES INVITÉS & RETOURS RSVP - ${config.coupleNames.toUpperCase()}*\n`;
    msg += `📍 Célébration : ${config.ville} (${config.typeLieu})\n`;
    msg += `👥 Total Personnes : ${stats.totalPersons} prévues | *${stats.confirmedPersons} CONFIRMÉES (${stats.confirmationRate}%)*\n`;
    msg += `💌 Cartons/Foyers : ${stats.totalCards} | 📲 Invitations WhatsApp envoyées : ${stats.sentViaWhatsAppCount}\n\n`;

    msg += `*✅ RETOURS CONFIRMÉS (${stats.confirmedGuestsList.length} foyers) :*\n`;
    stats.confirmedGuestsList.forEach((g, idx) => {
      msg += `${idx + 1}. ${g.nomCouple} ${g.prenom ? `(${g.prenom})` : ''} - *${g.confirmedCount || g.nombrePersonnes} pers.* [${g.tableAllocation}]`;
      if (g.rsvpMessage) msg += ` - "${g.rsvpMessage}"`;
      msg += `\n`;
    });

    if (stats.pendingGuestsList.length > 0) {
      msg += `\n*⏳ EN ATTENTE DE CONFIRMATION (${stats.pendingGuestsList.length} foyers) :*\n`;
      stats.pendingGuestsList.forEach((g, idx) => {
        msg += `${idx + 1}. ${g.nomCouple} - ${g.nombrePersonnes} pers. (Tél: ${g.telephone || 'Non renseigné'})\n`;
      });
    }

    navigator.clipboard.writeText(msg);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 3000);
  };

  return (
    <div className="space-y-6" id="guest-list-manager">
      {/* Header & Subtitle */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Gestion des Invités & Retours de Confirmation RSVP
              </h2>
              <p className="text-sm text-slate-500">
                Envoyez les invitations via WhatsApp et suivez en temps réel les confirmations de présence reçues des 400 invités.
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-add-guest"
            onClick={() => {
              setEditingGuestId(null);
              setFormData({
                type: 'Couple',
                nomCouple: '',
                prenom: '',
                nombrePersonnes: 2,
                cote: 'Marié',
                statut: 'Invité',
                tableAllocation: 'Table VIP 1',
                telephone: '',
                notes: '',
              });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition shadow-sm cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            Ajouter un Invité
          </button>

          <button
            id="btn-export-guests-csv"
            onClick={exportGuestsCSV}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition border border-slate-200 cursor-pointer"
            title="Exporter au format Excel / CSV"
          >
            <Download className="w-4 h-4" />
            Excel / CSV
          </button>

          <button
            id="btn-copy-guests-whatsapp"
            onClick={copyWhatsAppList}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium rounded-xl transition border cursor-pointer ${
              copiedWhatsApp
                ? 'bg-slate-100 text-slate-800 border-slate-300'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent'
            }`}
          >
            {copiedWhatsApp ? (
              <>
                <Check className="w-4 h-4" /> Copié pour WhatsApp !
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Synthèse WhatsApp
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('liste')}
          className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'liste'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Tableau Principal & Tables</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full ${activeSubTab === 'liste' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-700'}`}>
            {guests.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('retours')}
          className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer relative ${
            activeSubTab === 'retours'
              ? 'bg-slate-800 text-white shadow-xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>📬 Retours de Confirmation RSVP</span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${activeSubTab === 'retours' ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-800'}`}>
            {stats.confirmedPersons} pers. confirmées
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('envois')}
          className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'envois'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          <span>📲 Envois & Relances WhatsApp</span>
          <span className={`text-[11px] px-2 py-0.5 rounded-full ${activeSubTab === 'envois' ? 'bg-indigo-800 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
            {stats.sentViaWhatsAppCount} envoyés
          </span>
        </button>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Personnes */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Personnes Attendues</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.totalPersons}</span>
            <span className="text-xs text-slate-400 font-medium">/ {config.nbInvites} max</span>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (stats.totalPersons / config.nbInvites) * 100)}%` }}
              />
            </div>
            <span className="text-xs font-bold text-indigo-600 whitespace-nowrap">
              {Math.round((stats.totalPersons / config.nbInvites) * 100)}%
            </span>
          </div>
        </div>

        {/* Total Confirmés avec jauge RSVP */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-600 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Confirmations Reçues</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.confirmedPersons}</span>
            <span className="text-xs text-slate-600 font-bold">({stats.confirmationRate}% confirmés)</span>
          </div>
          <p className="mt-2 text-xs text-slate-500 font-medium">
            {stats.invitedPersons} en attente • {stats.declinedPersons} déclinés
          </p>
        </div>

        {/* Invitations WhatsApp Envoyées */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Envois WhatsApp</span>
            <MessageCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.sentViaWhatsAppCount}</span>
            <span className="text-xs text-slate-500 font-medium">/ {stats.totalCards} cartons</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Dont {stats.totalCouples} couples (~{stats.totalCouples * 2} pers.)
          </p>
        </div>

        {/* Répartition Familles */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Équilibre Côtés</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-sm font-medium text-slate-700 space-y-1 mt-1">
            <div className="flex justify-between text-xs">
              <span className="text-blue-700 font-semibold">Côté Marié :</span>
              <span>{stats.marieCount} pers.</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-pink-700 font-semibold">Côté Mariée :</span>
              <span>{stats.marieeCount} pers.</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-amber-700 font-semibold">VIP / Commun :</span>
              <span>{stats.vipCount} pers.</span>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW 1: MAIN TABLE */}
      {activeSubTab === 'liste' && (
        <div className="space-y-4">
          {/* Tables Breakdown Pills */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                🪑 Répartition par Tables (Base 10 personnes par table ronde)
              </span>
              <span className="text-xs text-slate-500">
                {Object.keys(stats.tableCounts).length} tables actives
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.tableCounts).map(([tableName, count]) => {
                const numericCount = Number(count) || 0;
                return (
                  <div
                    key={tableName}
                    onClick={() => setFilterTable(filterTable === tableName ? 'Tous' : tableName)}
                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-medium border transition flex items-center gap-2 ${
                      filterTable === tableName
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    <span>{tableName}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[11px] font-bold ${
                        filterTable === tableName
                          ? 'bg-white/20 text-white'
                          : numericCount >= 10
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {numericCount} / 10 pers.
                    </span>
                  </div>
                );
              })}
              {filterTable !== 'Tous' && (
                <button
                  onClick={() => setFilterTable('Tous')}
                  className="text-xs text-indigo-600 hover:underline px-2 py-1 cursor-pointer"
                >
                  Effacer filtre table
                </button>
              )}
            </div>
          </div>

          {/* Filter and Search Controls */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="search-guest-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher nom, prénom, tél, table..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>

            {/* Filter dropdowns */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Tous">Tous Types</option>
                <option value="Couple">Couple (2 pers.)</option>
                <option value="Individuel">Individuel (1 pers.)</option>
                <option value="Famille/Groupe">Famille / Groupe</option>
              </select>

              <select
                value={filterSide}
                onChange={(e) => setFilterSide(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Tous">Tous Côtés</option>
                <option value="Marié">Côté Marié</option>
                <option value="Mariée">Côté Mariée</option>
                <option value="Commun / VIP">Commun / VIP</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Tous">Tous Statuts</option>
                <option value="Confirmé">✅ Confirmé</option>
                <option value="Invité">⏳ Invité (en attente)</option>
                <option value="À inviter">📝 À inviter</option>
                <option value="Décliné">❌ Décliné</option>
              </select>

              {(searchTerm || filterType !== 'Tous' || filterSide !== 'Tous' || filterStatus !== 'Tous' || filterTable !== 'Tous') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('Tous');
                    setFilterSide('Tous');
                    setFilterStatus('Tous');
                    setFilterTable('Tous');
                  }}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 cursor-pointer"
                >
                  Réinitialiser filtres
                </button>
              )}
            </div>
          </div>

          {/* Interactive Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" id="guests-table">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[12px] font-semibold text-slate-600 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Nom / Nom du Couple</th>
                    <th className="py-3.5 px-3 text-center">Pers.</th>
                    <th className="py-3.5 px-4">Côté</th>
                    <th className="py-3.5 px-4">Statut Confirmation</th>
                    <th className="py-3.5 px-4">Table Assignée</th>
                    <th className="py-3.5 px-4">Invitation WhatsApp</th>
                    <th className="py-3.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredGuests.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        <Users className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
                        Aucun invité ne correspond aux critères de recherche.
                      </td>
                    </tr>
                  ) : (
                    filteredGuests.map((guest) => {
                      return (
                        <tr
                          key={guest.id}
                          className="hover:bg-indigo-50/30 transition-colors group"
                        >
                          {/* Type Badge */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                guest.type === 'Couple'
                                  ? 'bg-purple-100 text-purple-700'
                                  : guest.type === 'Famille/Groupe'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {guest.type === 'Couple' ? '👫 Couple' : guest.type === 'Famille/Groupe' ? '👨‍👩‍👧‍👦 Famille' : '👤 Solo'}
                            </span>
                          </td>

                          {/* Nom / Nom du Couple */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              {guest.nomCouple}
                              {guest.prenom && (
                                <span className="text-xs font-normal text-slate-500">
                                  ({guest.prenom})
                                </span>
                              )}
                            </div>
                            {guest.rsvpMessage && (
                              <div className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 inline-flex items-center gap-1 font-medium">
                                💬 "{guest.rsvpMessage}"
                              </div>
                            )}
                            {guest.notes && !guest.rsvpMessage && (
                              <div className="text-xs text-slate-400 italic truncate max-w-xs">
                                {guest.notes}
                              </div>
                            )}
                          </td>

                          {/* Nb de Personnes */}
                          <td className="py-3.5 px-3 text-center">
                            <span className="inline-block bg-slate-100 text-slate-800 font-bold px-2.5 py-0.5 rounded-md text-xs">
                              {guest.statut === 'Confirmé' && guest.confirmedCount !== undefined
                                ? `${guest.confirmedCount} (${guest.nombrePersonnes})`
                                : guest.nombrePersonnes}
                            </span>
                          </td>

                          {/* Côté */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold ${
                                guest.cote === 'Marié'
                                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                  : guest.cote === 'Mariée'
                                  ? 'bg-pink-50 text-pink-700 border border-pink-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {guest.cote}
                            </span>
                          </td>

                          {/* Statut & Bouton RSVP Rapide */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <select
                                value={guest.statut}
                                onChange={(e) => handleStatusChange(guest.id, e.target.value as GuestStatus)}
                                className={`text-xs font-semibold px-2.5 py-1 rounded-lg border focus:outline-none transition cursor-pointer ${
                                  guest.statut === 'Confirmé'
                                    ? 'bg-emerald-50 text-emerald-900 border-slate-200 font-bold'
                                    : guest.statut === 'Invité'
                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                    : guest.statut === 'À inviter'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-rose-50 text-rose-700 border-rose-200'
                                }`}
                              >
                                <option value="Confirmé">✅ Confirmé</option>
                                <option value="Invité">⏳ Invité (en attente)</option>
                                <option value="À inviter">📝 À inviter</option>
                                <option value="Décliné">❌ Décliné</option>
                              </select>

                              <button
                                onClick={() => openRecordRsvpModal(guest)}
                                title="Enregistrer le retour de confirmation détaillé"
                                className="p-1 rounded-md text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 transition cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            {guest.confirmationDate && (
                              <div className="text-[10px] text-emerald-700 mt-0.5 flex items-center gap-1 font-medium">
                                <Clock className="w-2.5 h-2.5" /> Confirmé le {guest.confirmationDate}
                              </div>
                            )}
                          </td>

                          {/* Table Allocation */}
                          <td className="py-3.5 px-4">
                            <input
                              type="text"
                              value={guest.tableAllocation}
                              onChange={(e) => handleFieldChange(guest.id, 'tableAllocation', e.target.value)}
                              placeholder="Ex: Table VIP 1"
                              className="text-xs bg-transparent hover:bg-white focus:bg-white border border-transparent hover:border-slate-300 focus:border-indigo-400 rounded-md px-2 py-1 w-32 focus:outline-none transition text-slate-700 font-medium"
                            />
                          </td>

                          {/* Action Invitation WhatsApp 1-Clic */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleSendWhatsAppInvitation(guest)}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs ${
                                  guest.whatsappSentAt
                                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                }`}
                                title="Envoyer ou renvoyer l'invitation sur WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>{guest.whatsappSentAt ? 'Renvoyer' : 'Inviter'}</span>
                              </button>

                              {guest.telephone ? (
                                <a
                                  href={`tel:${guest.telephone}`}
                                  className="text-xs text-slate-500 hover:text-indigo-600 p-1"
                                  title={guest.telephone}
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                              ) : null}
                            </div>
                            {guest.whatsappSentAt && (
                              <div className="text-[10px] text-slate-400 mt-0.5">
                                Envoyé le {guest.whatsappSentAt}
                              </div>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  setPreviewGuest(guest);
                                  setIsRsvpPreviewModalOpen(true);
                                }}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                                title="Aperçu du message WhatsApp & Lien RSVP"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => openEditModal(guest)}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition cursor-pointer"
                                title="Modifier les coordonnées"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteGuest(guest.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                title="Supprimer cet invité"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer info */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
              <div>
                Affichage de <span className="font-bold text-slate-700">{filteredGuests.length}</span> cartons sur un total de{' '}
                <span className="font-bold text-slate-700">{guests.length}</span> ({stats.totalPersons} personnes cumulées).
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" /> Confirmé
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500 ml-2" /> Invité
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 ml-2" /> À inviter
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 ml-2" /> Décliné
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: DEDICATED RSVP CONFIRMATIONS FEED & DASHBOARD */}
      {activeSubTab === 'retours' && (
        <div className="space-y-6">
          <div className="bg-emerald-900 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-lg">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-800/80 rounded-full text-emerald-200 text-xs font-semibold mb-3 border border-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Journal des Retours de Confirmation
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-2">
                {stats.confirmedPersons} Invités Confirmés sur les 400 Attendus
              </h3>
              <p className="text-emerald-100 text-sm leading-relaxed mb-6">
                Chaque retour reçu par WhatsApp ou appel est automatiquement comptabilisé ici avec le nombre exact de personnes présentes et leurs messages de félicitations pour <strong>{config.coupleNames}</strong>.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={copyWhatsAppList}
                  className="px-4 py-2.5 bg-white text-emerald-950 hover:bg-emerald-50 text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Copy className="w-4 h-4 text-emerald-600" />
                  Copier le Récapitulatif WhatsApp
                </button>
                <button
                  onClick={exportGuestsCSV}
                  className="px-4 py-2.5 bg-emerald-800/90 hover:bg-emerald-800 text-white text-xs font-semibold rounded-xl transition flex items-center gap-2 border border-emerald-700 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Exporter la Liste avec Messages (.CSV)
                </button>
              </div>
            </div>
          </div>

          {/* Confirmed Guests Timeline Cards */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Confirmations & Vœux Reçus des Invités ({stats.confirmedGuestsList.length} foyers)
              </h4>
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                {stats.confirmedPersons} personnes présentes au total
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.confirmedGuestsList.map((g) => (
                <div
                  key={g.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:shadow-md transition relative flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          {g.nomCouple}
                          {g.prenom && <span className="text-xs font-normal text-slate-500">({g.prenom})</span>}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-600 text-white rounded-md">
                            {g.confirmedCount || g.nombrePersonnes} pers. confirmées
                          </span>
                          <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                            {g.tableAllocation || 'Table VIP'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => openRecordRsvpModal(g)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                        title="Modifier le retour de confirmation"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Guest Message / Wishes */}
                    {g.rsvpMessage ? (
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 italic mt-2.5 relative">
                        <MessageSquare className="w-3.5 h-3.5 text-slate-400 mb-1 inline mr-1.5" />
                        "{g.rsvpMessage}"
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic mt-2">
                        Aucun commentaire particulier laissé.
                      </div>
                    )}
                  </div>

                  {/* Footer with method and date */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {g.confirmationDate ? `Reçu le ${g.confirmationDate}` : 'Confirmé'}
                    </span>
                    <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Via {g.rsvpResponseMethod || 'WhatsApp'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: WHATSAPP DISPATCH & REMINDERS CENTER */}
      {activeSubTab === 'envois' && (
        <div className="space-y-6">
          <div className="bg-indigo-950 text-white rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden">
            <div className="max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-900 rounded-full text-indigo-300 text-xs font-semibold mb-3 border border-indigo-800">
                <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                Centre d'Envois & Relances WhatsApp
              </div>
              <h3 className="text-2xl font-bold tracking-tight mb-2">
                Envoyez les Faire-Part & Relancez les Invités en 1 Clic
              </h3>
              <p className="text-indigo-200 text-sm leading-relaxed mb-6">
                Chaque message WhatsApp est généré automatiquement avec le nom des mariés <strong>{config.coupleNames}</strong>, la date, le lieu à {config.ville}, le nombre de places et le protocole de confirmation.
              </p>
            </div>
          </div>

          {/* Pending Guests List to Remind */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  Invités en Attente de Réponse ({stats.pendingGuestsList.length} foyers)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Cliquez sur "Inviter WhatsApp" pour ouvrir directement la discussion pré-remplie.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {stats.pendingGuestsList.map((g) => (
                <div
                  key={g.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 px-3 rounded-xl transition"
                >
                  <div>
                    <div className="font-bold text-slate-900 text-sm">
                      {g.nomCouple} {g.prenom && <span className="text-xs font-normal text-slate-500">({g.prenom})</span>}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>{g.nombrePersonnes} pers.</span>
                      <span>•</span>
                      <span>{g.cote}</span>
                      <span>•</span>
                      <span>{g.tableAllocation || 'Table assignée'}</span>
                      {g.telephone && (
                        <>
                          <span>•</span>
                          <span className="text-indigo-600 font-medium">{g.telephone}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSendWhatsAppInvitation(g)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      {g.whatsappSentAt ? 'Relancer WhatsApp' : 'Envoyer Invitation'}
                    </button>
                    <button
                      onClick={() => openRecordRsvpModal(g)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition border border-slate-200 cursor-pointer"
                    >
                      Saisir Retour
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD / EDIT GUEST */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                {editingGuestId ? "Modifier l'invité / couple" : 'Ajouter un invité ou un couple'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Type d'invitation
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      const val = e.target.value as GuestType;
                      setFormData({
                        ...formData,
                        type: val,
                        nombrePersonnes: val === 'Couple' ? 2 : val === 'Individuel' ? 1 : formData.nombrePersonnes,
                      });
                    }}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  >
                    <option value="Couple">👫 Couple (2 personnes)</option>
                    <option value="Individuel">👤 Individuel (1 personne)</option>
                    <option value="Famille/Groupe">👨‍👩‍👧‍👦 Famille / Groupe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Côté
                  </label>
                  <select
                    value={formData.cote}
                    onChange={(e) => setFormData({ ...formData, cote: e.target.value as GuestSide })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  >
                    <option value="Marié">Côté Marié</option>
                    <option value="Mariée">Côté Mariée</option>
                    <option value="Commun / VIP">Commun / VIP</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Nom ou Nom du Couple *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nomCouple}
                  onChange={(e) => setFormData({ ...formData, nomCouple: e.target.value })}
                  placeholder="Ex: M. & Mme Dupont, ou Famille Mpembele"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Prénom(s)
                  </label>
                  <input
                    type="text"
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    placeholder="Ex: Joste & Judia"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Nb Pers.
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formData.nombrePersonnes}
                    onChange={(e) => setFormData({ ...formData, nombrePersonnes: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white text-center font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Statut Initial
                  </label>
                  <select
                    value={formData.statut}
                    onChange={(e) => setFormData({ ...formData, statut: e.target.value as GuestStatus })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  >
                    <option value="Confirmé">✅ Confirmé</option>
                    <option value="Invité">⏳ Invité (en attente)</option>
                    <option value="À inviter">📝 À inviter</option>
                    <option value="Décliné">❌ Décliné</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Table Assignée
                  </label>
                  <input
                    type="text"
                    value={formData.tableAllocation}
                    onChange={(e) => setFormData({ ...formData, tableAllocation: e.target.value })}
                    placeholder="Ex: Table VIP 1"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Téléphone WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    placeholder="+242 06..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Note / Rôle
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Ex: Témoin, Famille RDC..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition cursor-pointer"
                >
                  {editingGuestId ? 'Enregistrer les modifications' : 'Ajouter à la liste'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RECORD RSVP RETURN (ENREGISTRER RETOUR WHATSAPP) */}
      {isRecordRsvpModalOpen && selectedGuestForRsvp && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Enregistrer un Retour de Confirmation
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Invité : <strong className="text-slate-800">{selectedGuestForRsvp.nomCouple}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsRecordRsvpModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRsvpReturn} className="space-y-4">
              {/* Statut de présence */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Présence confirmée
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRsvpReturnData({ ...rsvpReturnData, statut: 'Confirmé' })}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      rsvpReturnData.statut === 'Confirmé'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    ✅ Présence Confirmée
                  </button>
                  <button
                    type="button"
                    onClick={() => setRsvpReturnData({ ...rsvpReturnData, statut: 'Décliné' })}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                      rsvpReturnData.statut === 'Décliné'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <XCircle className="w-4 h-4" />
                    ❌ Décliné / Absent
                  </button>
                </div>
              </div>

              {/* Nombre de personnes effectives & Méthode */}
              {rsvpReturnData.statut === 'Confirmé' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Nombre de personnes venant
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={rsvpReturnData.confirmedCount}
                      onChange={(e) => setRsvpReturnData({ ...rsvpReturnData, confirmedCount: parseInt(e.target.value) || 1 })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white text-center font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Canal de réponse
                    </label>
                    <select
                      value={rsvpReturnData.rsvpResponseMethod}
                      onChange={(e) => setRsvpReturnData({ ...rsvpReturnData, rsvpResponseMethod: e.target.value as any })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                    >
                      <option value="WhatsApp">Message WhatsApp</option>
                      <option value="Appel / Direct">Appel / En personne</option>
                      <option value="Lien en ligne">Lien en ligne</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Message de félicitations / Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Message ou Vœux reçus des invités
                </label>
                <textarea
                  rows={3}
                  value={rsvpReturnData.rsvpMessage}
                  onChange={(e) => setRsvpReturnData({ ...rsvpReturnData, rsvpMessage: e.target.value })}
                  placeholder='Ex: "Toutes nos félicitations à Judia et Joste ! Nous serons là pour célébrer avec vous."'
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRecordRsvpModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Valider la Confirmation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: PREVIEW WHATSAPP INVITATION MESSAGE */}
      {isRsvpPreviewModalOpen && previewGuest && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                Aperçu de l'Invitation WhatsApp
              </h3>
              <button
                onClick={() => setIsRsvpPreviewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-[#ECE5DD] p-4 rounded-2xl border border-slate-200 font-sans shadow-inner mb-6">
              <div className="bg-white p-4 rounded-xl shadow-sm text-xs leading-relaxed whitespace-pre-wrap text-slate-800 border border-emerald-100">
                {generateWhatsAppMessage(previewGuest)}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(generateWhatsAppMessage(previewGuest));
                  alert('Message WhatsApp copié dans le presse-papiers !');
                }}
                className="px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                Copier le Texte
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSendWhatsAppInvitation(previewGuest);
                  setIsRsvpPreviewModalOpen(false);
                }}
                className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Ouvrir dans WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
