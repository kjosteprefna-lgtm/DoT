import React from 'react';
import { ScrollText, Church, Utensils, ShieldCheck } from 'lucide-react';
import { WeddingConfig } from '../types';

interface AdviceGuideProps {
  config: WeddingConfig;
}

export const AdviceGuide: React.FC<AdviceGuideProps> = ({ config }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 font-serif">
            Guide & Recommandations Pratiques
          </h3>
          <p className="text-xs text-slate-500">
            Conseils adaptés aux célébrations à {config.ville === 'Autre' ? config.customCity || 'votre région' : config.ville}
          </p>
        </div>
        <span className="text-xs bg-amber-50 text-amber-900 font-bold px-2.5 py-1 rounded-full border border-amber-200">
          Bonnes Pratiques
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Advice 1: Coutumier */}
        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/70 space-y-2">
          <div className="flex items-center gap-2 text-amber-950 font-bold text-xs">
            <ScrollText className="w-4 h-4 text-amber-700" />
            Mariage Coutumier & Dot
          </div>
          <p className="text-xs text-amber-900/85 leading-relaxed">
            Établissez la liste de dot officielle à l’avance avec les oncles et représentants des deux familles. Prévoyez les pièces de pagne hollandais authentiques, la boisson rituelle et désignez un porte-parole familial éloquent pour fluidifier les négociations.
          </p>
        </div>

        {/* Advice 2: Mairie & Administratif */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/70 space-y-2">
          <div className="flex items-center gap-2 text-blue-950 font-bold text-xs">
            <Church className="w-4 h-4 text-blue-700" />
            Mairie & Délais d'État Civil
          </div>
          <p className="text-xs text-blue-900/85 leading-relaxed">
            Déposez le dossier de mariage au moins 2 mois avant à la mairie (arrondissement) pour garantir la date et l’heure souhaitées. N’oubliez pas les quittances de publication des bans et les pièces d’identité certifiées des témoins.
          </p>
        </div>

        {/* Advice 3: Traiteur & Boissons */}
        <div className="p-4 rounded-xl bg-amber-50/40 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
            <Utensils className="w-4 h-4 text-amber-600" />
            Restauration & Gestion du Bar
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Comptez un buffet diversifié (spécialités locales telles que saka-saka, maboké, poisson braisé et plats internationaux). Pour les boissons, privilégiez un gestionnaire dédié pour éviter les ruptures de glace et de champagne lors des toasts.
          </p>
        </div>

        {/* Advice 4: Sécurité & Logistique */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-slate-700" />
            Logistique & Groupe Électrogène
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Indispensable : assurez-vous que la salle ou l'espace pelouse dispose d'un groupe électrogène fonctionnel avec du carburant de réserve suffisant pour alimenter la sonorisation, l'éclairage et les frigos sans coupure.
          </p>
        </div>
      </div>
    </div>
  );
};
