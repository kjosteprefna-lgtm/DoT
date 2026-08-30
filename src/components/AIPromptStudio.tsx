import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  Image as ImageIcon,
  Layers,
  Palette,
  Sliders,
  Maximize2,
  Share2,
} from 'lucide-react';
import { AI_VISUAL_PRESETS } from '../data/defaultData';
import { WeddingConfig } from '../types';

interface AIPromptStudioProps {
  config: WeddingConfig;
}

export const AIPromptStudio: React.FC<AIPromptStudioProps> = ({ config }) => {
  const [selectedPresetId, setSelectedPresetId] = useState(AI_VISUAL_PRESETS[0].id);
  const [coupleNames, setCoupleNames] = useState(config.coupleNames || 'Mama Judia & Ndombe');
  const [selectedStyle, setSelectedStyle] = useState<string>('Dorure Luxe & Orchidées');
  const [copied, setCopied] = useState(false);

  const selectedPreset =
    AI_VISUAL_PRESETS.find((p) => p.id === selectedPresetId) || AI_VISUAL_PRESETS[0];

  // Dynamically generate the finalized prompt
  let generatedPrompt = selectedPreset.promptTemplate.replace('{names}', coupleNames);
  if (selectedStyle === 'Royal Wax & Brocart') {
    generatedPrompt += ', adorned with vibrant African Super Wax patterns and gold filigree details';
  } else if (selectedStyle === 'Bohème Végétal & Palmiers') {
    generatedPrompt += ', lush organic tropical foliage, pampas grass, warm natural linen aesthetics';
  } else if (selectedStyle === 'Coucher de Soleil Pelouse') {
    generatedPrompt += ', warm golden hour twilight illumination, fairy string lights glowing';
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Studio Graphique IA
              </span>
              <span className="text-xs text-slate-500 font-medium">Midjourney • DALL-E 3 • Flux</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-serif mt-1">
              Générateur de Prompts IA pour Invitations & Décoration
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Générez des maquettes avec emplacements réservés (Inpainting / Placeholders) pour insérer facilement les photos des mariés.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-700">Couple :</span>
            <input
              type="text"
              value={coupleNames}
              onChange={(e) => setCoupleNames(e.target.value)}
              placeholder="Noms des mariés"
              className="text-xs font-semibold px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl focus:border-amber-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Preset Cards Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {AI_VISUAL_PRESETS.map((preset) => {
            const isSelected = preset.id === selectedPresetId;
            return (
              <button
                key={preset.id}
                onClick={() => setSelectedPresetId(preset.id)}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-600 bg-amber-50/60 ring-2 ring-amber-200'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                      {preset.support}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2">
                    {preset.title}
                  </h4>
                </div>
                <p className="text-[11px] text-slate-500 mt-2 line-clamp-2">
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Style Preset Selector */}
        <div className="flex items-center gap-2 flex-wrap pt-2">
          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
            <Palette className="w-3.5 h-3.5 text-amber-600" />
            Ambiance & Thème Visuel :
          </span>
          {[
            'Dorure Luxe & Orchidées',
            'Bohème Végétal & Palmiers',
            'Royal Wax & Brocart',
            'Coucher de Soleil Pelouse',
          ].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStyle(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                selectedStyle === st
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio View: Prompt Output + Mockup Card Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Prompt Code & Guide (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Prompt Optimisé Prêt à Copier
            </h3>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors cursor-pointer shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Prompt Copié !
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copier le Prompt
                </>
              )}
            </button>
          </div>

          <div className="relative">
            <div className="p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs leading-relaxed overflow-x-auto border border-slate-800 selection:bg-amber-500 selection:text-slate-950">
              {generatedPrompt}
            </div>
          </div>

          {/* Quick Step Guide */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              💡 Comment l'utiliser avec vos photos réelles :
            </h4>
            <ol className="text-xs text-slate-600 space-y-1.5 list-decimal list-inside leading-relaxed">
              <li>
                <strong>Collez ce prompt</strong> dans Midjourney (avec <code>/imagine</code>), ChatGPT (DALL-E 3) ou Canva Magic Media.
              </li>
              <li>
                L'IA génère la carte ou le panneau avec un cadre ovale/rectangulaire vide étiqueté <em>"PHOTO PLACEHOLDER"</em>.
              </li>
              <li>
                Ouvrez le visuel généré dans <strong>Canva, Photoshop ou Photopea</strong> et glissez la photo de couple de Mama Judia & Ndombe à l'intérieur du cadre réservé.
              </li>
              <li>
                Imprimez chez votre imprimeur à Pointe-Noire / Kinshasa ou envoyez les invitations numériques par WhatsApp !
              </li>
            </ol>
          </div>
        </div>

        {/* Right Column: Visual Mockup Simulation (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col items-center justify-center text-center space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            Aperçu de la Maquette avec Zone Photo
          </span>

          {/* Interactive Card Canvas Simulation */}
          <div className="w-full max-w-[280px] aspect-[3/4] bg-gradient-to-br from-amber-50/50 via-white to-slate-50 rounded-2xl p-5 border-2 border-dashed border-amber-300 shadow-md flex flex-col items-center justify-between relative overflow-hidden group">
            {/* Top Floral Accent Icon */}
            <div className="text-amber-700 text-xs font-serif italic tracking-widest">
              🌿 Mariage Coutumier & Religieux 🌿
            </div>

            {/* Simulated Blank Photo Frame for Inpainting */}
            <div className="w-28 h-36 rounded-full border-2 border-amber-400/80 bg-white/90 shadow-inner flex flex-col items-center justify-center p-3 text-center transition-transform group-hover:scale-105">
              <ImageIcon className="w-6 h-6 text-amber-500 mb-1 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-tight text-slate-700 leading-tight">
                Zone Photo Mariés
              </span>
              <span className="text-[8px] text-slate-400 mt-0.5">
                (Insérer portrait couple ici)
              </span>
            </div>

            {/* Bottom Typography */}
            <div className="space-y-1">
              <h4 className="font-serif text-sm font-bold text-slate-900">
                {coupleNames}
              </h4>
              <p className="text-[10px] text-amber-800 font-medium">
                {selectedPreset.support} • {selectedStyle}
              </p>
              <p className="text-[9px] text-slate-400">
                Pointe-Noire • Kinshasa • 2026
              </p>
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            Le cadrage est automatiquement dimensionné pour une impression haute définition (300 DPI).
          </p>
        </div>
      </div>
    </div>
  );
};
