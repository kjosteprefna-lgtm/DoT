import React from 'react';
import {
  Sparkles,
  Shirt,
  Flower2,
  Sun,
  Palette,
  Users,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { WeddingConfig } from '../types';

interface DecorOutfitsViewerProps {
  config: WeddingConfig;
}

export const DecorOutfitsViewer: React.FC<DecorOutfitsViewerProps> = ({ config }) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            Guide Stylistique & Scénographie
          </span>
          <span className="text-xs text-slate-500 font-medium">Pelouse & Célébrations</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif">
          Décoration de l'Espace & Propositions de Tenues
        </h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Harmonisez l'ambiance champêtre chic de votre espace extérieur avec des tenues traditionnelles en Wax brodé et des costumes sur-mesure pour toute la famille.
        </p>
      </div>

      {/* 2 Main Columns: Décoration vs Tenues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Décoration Pelouse */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Flower2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                🎪 Concept Décoration Pelouse (Pointe-Noire / Kasangulu)
              </h3>
              <p className="text-xs text-slate-500">
                Thème : *Élégance Champêtre, Écrin Vert & Touche Dorée*
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            {/* Element 1: Structures & Chapiteaux */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Chapiteaux Ouverts & Drapés Chiffon
              </div>
              <p className="text-slate-600">
                Tentes de réception blanches ouvertes sur les côtés avec voilages aériens en mousseline blanche et pêche pour laisser circuler la brise marine tout en protégeant du soleil.
              </p>
            </div>

            {/* Element 2: Arche des Mariés & Allée */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Arche Cérémonielle en Bambou & Feuilles Tropicales
              </div>
              <p className="text-slate-600">
                Arche naturelle ornée de grandes feuilles de monstera, palmiers locaux, anthuriums rouges et orchidées blanches. Allée centrale recouverte d'un tapis blanc poudré de pétales frais.
              </p>
            </div>

            {/* Element 3: Éclairage féerique */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 space-y-1.5">
              <div className="font-bold text-amber-950 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-600" />
                Guirlandes Guinguette & Ambiance Crépuscule
              </div>
              <p className="text-amber-900/80">
                Dès la tombée du jour, les guirlandes lumineuses blanc chaud tissées entre les arbres et sous les chapiteaux créent une atmosphère féerique et chaleureuse sans éblouir les invités.
              </p>
            </div>

            {/* Element 4: Tables & Vaisselle */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Tables Rondes & Centres de Table Dorés
              </div>
              <p className="text-slate-600">
                40 tables rondes nappées de blanc immaculé avec chemins de table dorés, chandeliers hauts, verrerie étincelante et chaises habillées avec nœud coordonné.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: Propositions de Tenues */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Shirt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif">
                👗 Propositions de Tenues pour le Couple & Famille
              </h3>
              <p className="text-xs text-slate-500">
                Équilibre entre tradition royale et modernité élégante
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
            {/* Option 1: Coutumier / Liputa */}
            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                1. Mariage Coutumier & Dot (RDC)
              </span>
              <div className="space-y-1.5">
                <div className="font-bold text-slate-900">
                  👰 Mariée (Mama Judia) :
                </div>
                <p className="text-slate-600 pl-3 border-l-2 border-amber-300">
                  Robe sirène sur-mesure en Super Wax Hollandais brodé avec incrustations de dentelle dorée, manches bouffantes structurées et coiffe traditionnelle (foulard noué façon reine africaine).
                </p>
                <div className="font-bold text-slate-900 pt-1">
                  🤵 Marié (Ndombe) :
                </div>
                <p className="text-slate-600 pl-3 border-l-2 border-amber-300">
                  Ensemble boubou cintrée col officier brodé assorti au motif de la mariée, pantalon droit moderne et canne d'apparat sculptée.
                </p>
              </div>
            </div>

            {/* Option 2: Civil / Religieux */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                2. Mairie & Cérémonie Religieuse (Pointe-Noire)
              </span>
              <div className="space-y-1.5">
                <div className="font-bold text-slate-900">
                  👰 Robe de Mariée VIP :
                </div>
                <p className="text-slate-600 pl-3 border-l-2 border-blue-300">
                  Robe blanche fourreau ou trapèze en satin duchesse et dentelle de Calais avec voile fluide court (adapté à l'extérieur) et bouquet d'orchidées fraîches.
                </p>
                <div className="font-bold text-slate-900 pt-1">
                  🤵 Costume du Marié :
                </div>
                <p className="text-slate-600 pl-3 border-l-2 border-blue-300">
                  Costume 3 pièces sur-mesure bleu nuit impérial ou beige sable chic avec chemise blanche à col italien, nœud papillon et pochette coordonnée.
                </p>
              </div>
            </div>

            {/* Parents & Enfants */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-600" />
                Parents & Enfants du Couple
              </div>
              <p className="text-slate-600">
                • <strong>Mamans :</strong> Pagnes uniformes Super Wax Vlisco avec chemisiers brodés.<br />
                • <strong>Papas :</strong> Vestes d'honneur / costumes coordonnés sombres.<br />
                • <strong>Enfants :</strong> Petits smokings et robes de princesses blanches assorties à la mariée.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
