import React, { useState } from 'react';
import { Smartphone, Share2, Copy, Check, ExternalLink, X, Download } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [copiedMsg, setCopiedMsg] = useState(false);

  if (!isOpen) return null;

  const appUrl = window.location.origin;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappMessage = `💒 *Mariage & Dote Judia & Joste 2026*\nRetrouvez notre application officielle pour le suivi des préparatifs, du budget et la confirmation de votre présence :\n👉 ${appUrl}`;

  const handleCopyWhatsAppText = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopiedMsg(true);
    setTimeout(() => setCopiedMsg(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(whatsappMessage);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              Application Mobile & Partage
            </h3>
            <p className="text-xs text-slate-500">
              Installez sur Android ou partagez le lien avec votre famille
            </p>
          </div>
        </div>

        {/* Section 1: Android PWA Installation Guide */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 mb-2">
            <Download className="w-4 h-4 text-emerald-600" />
            Installer sur votre téléphone Android
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed mb-3">
            Transformez ce lien en véritable application Android (avec icône sur l'écran d'accueil) :
          </p>
          <ol className="text-xs text-slate-700 space-y-1.5 list-decimal list-inside pl-1 font-medium">
            <li>Ouvrez ce lien dans <strong>Google Chrome</strong> sur votre téléphone</li>
            <li>Appuyez sur les <strong>3 petits points (⋮)</strong> en haut à droite</li>
            <li>Sélectionnez <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong></li>
          </ol>
        </div>

        {/* Section 2: Copy link and share */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Lien direct de votre application :
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={appUrl}
                className="w-full bg-slate-100 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-700 select-all focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shrink-0 cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={handleShareWhatsApp}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
            >
              <Share2 className="w-4 h-4" />
              <span>Envoyer sur WhatsApp</span>
            </button>

            <button
              onClick={handleCopyWhatsAppText}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer border border-slate-200"
            >
              {copiedMsg ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedMsg ? 'Message copié !' : 'Copier le message'}</span>
            </button>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl hover:bg-slate-100 transition cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
