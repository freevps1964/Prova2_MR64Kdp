import React, { useState } from 'react';
import Card from '../common/Card';
import { useProject } from '../../hooks/useProject';
import type { Keyword } from '../../types';
import { XIcon } from '../common/Icons';

const MetadataTab: React.FC = () => {
  const {
    projectTitle,
    researchData,
    subtitle, setSubtitle,
    author, setAuthor,
    description, setDescription,
    metadataKeywords, setMetadataKeywords,
    categories, setCategories
  } = useProject();

  const [newKeyword, setNewKeyword] = useState('');

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !metadataKeywords.some(kw => kw.keyword === newKeyword.trim())) {
      const newKw: Keyword = { keyword: newKeyword.trim(), relevance: 0 }; // Relevance is manual here
      setMetadataKeywords([...metadataKeywords, newKw]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setMetadataKeywords(metadataKeywords.filter(kw => kw.keyword !== keywordToRemove));
  };

  const handleAutoFillFromResearch = () => {
    if (!researchData) {
      alert("Esegui prima una ricerca nella scheda 'Ricerca' per ottenere suggerimenti automatici.");
      return;
    }
    
    // Auto-fill subtitle from research
    if (!subtitle.trim() && researchData.subtitles && researchData.subtitles.length > 0) {
      setSubtitle(researchData.subtitles[0].subtitle);
    }
    
    // Auto-fill description
    if (!description.trim() && researchData.keywords.length > 0) {
      const topKeywords = researchData.keywords.slice(0, 5).map(k => k.keyword).join(', ');
      const autoDescription = `Una guida completa e pratica su ${topKeywords}. Questo libro fornisce strategie comprovate, tecniche avanzate e consigli pratici per ottenere risultati concreti. Ideale per chi vuole approfondire l'argomento e applicare immediatamente le conoscenze acquisite per raggiungere il successo.`;
      setDescription(autoDescription);
    }
    
    // Merge research keywords with existing ones
    if (researchData.keywords.length > 0) {
      const existingKeywords = metadataKeywords.map(k => k.keyword.toLowerCase());
      const newKeywords = researchData.keywords.filter(k => !existingKeywords.includes(k.keyword.toLowerCase()));
      setMetadataKeywords([...metadataKeywords, ...newKeywords]);
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card>
          <h1 className="text-2xl font-bold mb-6">Gestione Metadati KDP</h1>
          
          {researchData && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-blue-800 font-medium">Dati di ricerca disponibili</p>
                  <p className="text-xs text-blue-600">Compila automaticamente i metadati con i risultati della ricerca</p>
                </div>
                <button
                  onClick={handleAutoFillFromResearch}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  Auto-Compila
                </button>
              </div>
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <label htmlFor="projectTitle" className="block text-sm font-medium text-gray-700">Titolo del Libro</label>
              <input
                type="text"
                id="projectTitle"
                value={projectTitle}
                disabled
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">Sottotitolo</label>
              <input
                type="text"
                id="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700">Autore</label>
              <input
                type="text"
                id="author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrizione del Libro</label>
              <textarea
                id="description"
                rows={8}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                placeholder="Una descrizione avvincente che invogli i lettori..."
              />
            </div>
          </div>
        </Card>
      </div>
      <div className="lg:col-span-1 space-y-8">
        <Card>
          <h2 className="text-xl font-bold mb-4">Parole Chiave (Keywords)</h2>
          <p className="text-sm text-gray-600 mb-4">
            {metadataKeywords.length}/7 keywords (Amazon raccomanda 5-7 keywords)
          </p>
          <div className="flex gap-2 mb-4">
            <input 
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
              placeholder="Aggiungi keyword..."
              className="flex-grow p-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:outline-none"
            />
            <button onClick={handleAddKeyword} className="bg-brand-light text-white font-bold py-2 px-3 rounded-lg hover:bg-brand-secondary transition">+</button>
          </div>
          
          {researchData && researchData.keywords.length > 0 && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Keywords suggerite dalla ricerca:</p>
              <div className="flex flex-wrap gap-1">
                {researchData.keywords.slice(0, 10).map(kw => (
                  <button
                    key={kw.keyword}
                    onClick={() => {
                      if (!metadataKeywords.some(mk => mk.keyword === kw.keyword)) {
                        setMetadataKeywords([...metadataKeywords, kw]);
                      }
                    }}
                    className="text-xs bg-white border border-gray-300 text-gray-700 px-2 py-1 rounded hover:bg-blue-50 hover:border-blue-300 transition"
                  >
                    + {kw.keyword}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            {metadataKeywords.map(kw => (
              <div key={kw.keyword} className="bg-blue-100 text-brand-dark text-sm font-medium px-3 py-1 rounded-full flex items-center gap-2">
                {kw.keyword}
                <button onClick={() => handleRemoveKeyword(kw.keyword)} className="text-blue-500 hover:text-blue-800">
                  <XIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </Card>
         <Card>
          <h2 className="text-xl font-bold mb-4">Categorie KDP</h2>
            <p className="text-xs text-gray-500 mb-2">Inserisci le categorie separate da una virgola.</p>
            <textarea
                id="categories"
                rows={4}
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                placeholder="Es: BUSINESS & ECONOMICS / E-Commerce, SELF-HELP / Self-Management"
              />
        </Card>
      </div>
    </div>
  );
};

export default MetadataTab;