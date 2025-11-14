
import React, { useState } from 'react';

interface ApiKeySelectorProps {
  onKeySelected: () => void;
  onCheckKey: () => Promise<void>;
}

const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onKeySelected, onCheckKey }) => {
  const [isSelecting, setIsSelecting] = useState(false);

  const handleSelectKey = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      setIsSelecting(true);
      try {
        await window.aistudio.openSelectKey();
        // Assume selection was successful and trigger state update in parent.
        // A race condition can exist where `hasSelectedApiKey` isn't immediately true.
        // We optimistically update the UI. If an API call fails later, the user
        // will be prompted to select a key again.
        onKeySelected();
      } catch (error) {
        console.error("Error opening API key selection:", error);
      } finally {
        setIsSelecting(false);
      }
    } else {
      alert("La sélection de la clé API n'est pas disponible dans cet environnement.");
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen text-white p-4">
      <div className="max-w-md w-full text-center bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Clé API Requise</h1>
        <p className="text-slate-400 mb-6">
          Pour générer des vidéos avec le modèle Veo, vous devez sélectionner une clé API associée à votre projet. Elle sera utilisée pour la facturation.
        </p>
        <button
          onClick={handleSelectKey}
          disabled={isSelecting}
          className="w-full bg-gradient-to-r from-brand-green to-emerald-400 hover:opacity-90 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(0,208,132,0.2)] hover:shadow-[0_0_30px_rgba(0,208,132,0.4)]"
        >
          {isSelecting ? 'En attente de sélection...' : 'Sélectionnez votre Clé API'}
        </button>
        <p className="text-xs text-slate-500 mt-4">
          Pour plus d'informations, veuillez consulter la{' '}
          <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-brand-green"
          >
            documentation de facturation
          </a>.
        </p>
      </div>
    </div>
  );
};

export default ApiKeySelector;