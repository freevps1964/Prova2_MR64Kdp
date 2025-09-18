import React, { useState } from 'react';
import Card from '../common/Card';
import { useProject } from '../../hooks/useProject';
import { useLocalization } from '../../hooks/useLocalization';
import { generateBookStructure } from '../../services/geminiService';
import Spinner from '../common/Spinner';

const StructureTab: React.FC = () => {
  const { 
    researchData, 
    selectedSources, 
    projectTitle,
    setProjectTitle,
    bookStructure,
    setBookStructure
  } = useProject();
  const { t } = useLocalization();
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateStructure = async () => {
    if (!projectTitle || selectedSources.length === 0) {
      alert("Seleziona un titolo e almeno una fonte di ricerca prima di generare la struttura.");
      return;
    }
    setIsLoading(true);
    try {
      const structure = await generateBookStructure(projectTitle, selectedSources);
      setBookStructure(structure);
    } catch (error) {
      console.error("Failed to generate structure", error);
      alert("Si è verificato un errore durante la generazione della struttura.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!researchData) {
    return (
      <Card>
        <h1 className="text-2xl font-bold mb-4">Progetta la Struttura del Libro</h1>
        <p className="text-gray-600">
          Per favore, esegui prima una ricerca nella scheda 'Ricerca' per poter generare una struttura.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Left Column: Settings */}
      <div className="md:col-span-1 space-y-8">
        <Card>
          <h2 className="text-xl font-bold mb-4">1. Seleziona il Titolo</h2>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {researchData.titles.map((titleSuggestion) => (
              <div 
                key={titleSuggestion.title}
                onClick={() => setProjectTitle(titleSuggestion.title)}
                className={`p-3 rounded-lg cursor-pointer transition ${projectTitle === titleSuggestion.title ? 'bg-brand-primary text-white shadow-md' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                <p className="font-medium">{titleSuggestion.title}</p>
                <p className={`text-sm ${projectTitle === titleSuggestion.title ? 'opacity-80' : 'text-gray-500'}`}>{t('relevance')}: {titleSuggestion.relevance}%</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-bold mb-4">2. Genera Struttura</h2>
          <p className="text-sm text-gray-600 mb-4">
            Usa il titolo selezionato e le fonti per creare un sommario dettagliato con capitoli e sottocapitoli.
          </p>
          <button
            onClick={handleGenerateStructure}
            disabled={isLoading || !projectTitle || selectedSources.length === 0}
            className="w-full bg-brand-primary text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-brand-secondary transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isLoading ? <Spinner /> : 'Genera Sommario'}
          </button>
           {!projectTitle && <p className="text-red-500 text-xs mt-2">Seleziona un titolo per continuare.</p>}
           {projectTitle && selectedSources.length === 0 && <p className="text-red-500 text-xs mt-2">Seleziona almeno una fonte nella scheda 'Ricerca'.</p>}
        </Card>
      </div>

      {/* Right Column: Structure */}
      <div className="md:col-span-2">
        <Card>
          <h2 className="text-xl font-bold mb-4">Sommario del Libro</h2>
          {bookStructure ? (
            <div className="space-y-4">
              {bookStructure.chapters.map((chapter) => (
                <div key={chapter.id}>
                  <h3 className="text-lg font-semibold text-neutral-dark">{chapter.title}</h3>
                  <ul className="mt-2 ml-4 space-y-1 list-disc list-inside">
                    {chapter.subchapters.map((subchapter) => (
                      <li key={subchapter.id} className="text-gray-700">{subchapter.title}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p>Il sommario apparirà qui dopo la generazione.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StructureTab;
