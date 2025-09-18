import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { Language } from '../types';

const translations = {
  it: {
    research: 'Ricerca',
    structure: 'Struttura',
    content: 'Contenuti',
    layout: 'Layout',
    cover: 'Copertina',
    metadata: 'Metadati',
    validation: 'Validazione',
    newProject: 'Nuovo Progetto',
    projectTitle: 'Titolo Progetto',
    searchTopic: 'Inserisci l\'argomento del libro...',
    startResearch: 'Avvia Ricerca',
    sources: 'Fonti',
    titles: 'Titoli Suggeriti',
    subtitles: 'Sottotitoli Suggeriti',
    keywords: 'Keyword Suggerite',
    relevance: 'Rilevanza',
    openSource: 'Apri Fonte',
    analyzeWithNotebookLM: 'Analizza con NotebookLM',
    searchHistory: 'Archivio Ricerche',
    researchStats: 'Statistiche Ricerca',
    sourcesAnalyzed: 'Fonti Analizzate',
    sourcesSaved: 'Fonti Salvate',
    avgRelevance: 'Rilevanza Media',
    noResults: 'Nessun risultato. Prova con un\'altra ricerca.',
    progress: 'Avanzamento',
    saveProject: 'Salva Progetto',
    projectArchive: 'Archivio Progetti',
    loadProject: 'Carica',
    deleteProject: 'Elimina',
    close: 'Chiudi',
    confirmDelete: 'Sei sicuro di voler eliminare questo progetto?',
    noArchivedProjects: 'Nessun progetto archiviato.',
    lastSaved: 'Ultimo salvataggio',
    selectAllSources: 'Seleziona tutte le fonti',
    generateAll: 'Genera Tutto',
    generating: 'Generazione in corso...',
    layoutPreview: 'Anteprima Layout',
    download: 'Scarica',
    downloadAs: 'Scarica come...',
    layoutTemplates: 'Modelli di Layout',
    classic: 'Classico',
    modern: 'Moderno',
    minimalist: 'Minimalista',
    generateCover: 'Genera Copertina',
    generatingCover: 'Generazione Copertina...',
    coverGenerationInfo: 'Usa il titolo e le parole chiave per generare una copertina unica per il tuo libro.',
  },
  en: {
    research: 'Research',
    structure: 'Structure',
    content: 'Content',
    layout: 'Layout',
    cover: 'Cover',
    metadata: 'Metadata',
    validation: 'Validation',
    newProject: 'New Project',
    projectTitle: 'Project Title',
    searchTopic: 'Enter the book topic...',
    startResearch: 'Start Research',
    sources: 'Sources',
    titles: 'Suggested Titles',
    subtitles: 'Suggested Subtitles',
    keywords: 'Suggested Keywords',
    relevance: 'Relevance',
    openSource: 'Open Source',
    analyzeWithNotebookLM: 'Analyze with NotebookLM',
    searchHistory: 'Search History',
    researchStats: 'Research Statistics',
    sourcesAnalyzed: 'Sources Analyzed',
    sourcesSaved: 'Sources Saved',
    avgRelevance: 'Average Relevance',
    noResults: 'No results. Try another search.',
    progress: 'Progress',
    saveProject: 'Save Project',
    projectArchive: 'Project Archive',
    loadProject: 'Load',
    deleteProject: 'Delete',
    close: 'Close',
    confirmDelete: 'Are you sure you want to delete this project?',
    noArchivedProjects: 'No archived projects.',
    lastSaved: 'Last saved',
    selectAllSources: 'Select all sources',
    generateAll: 'Generate All',
    generating: 'Generating...',
    layoutPreview: 'Layout Preview',
    download: 'Download',
    downloadAs: 'Download as...',
    layoutTemplates: 'Layout Templates',
    classic: 'Classic',
    modern: 'Modern',
    minimalist: 'Minimalist',
    generateCover: 'Generate Cover',
    generatingCover: 'Generating Cover...',
    coverGenerationInfo: 'Use the title and keywords to generate a unique cover for your book.',
  }
};

type TranslationKey = keyof typeof translations.it;

interface LocalizationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('it');

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};