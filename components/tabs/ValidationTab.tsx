import React, { useMemo } from 'react';
import Card from '../common/Card';
import { useProject } from '../../hooks/useProject';
import { CheckCircleIcon, XCircleIcon } from '../common/Icons';

interface ValidationResult {
  isValid: boolean;
  message: string;
  details?: string | React.ReactNode;
}

const ValidationItem: React.FC<{ result: ValidationResult }> = ({ result }) => {
  return (
    <li className={`flex items-start p-3 rounded-lg ${result.isValid ? 'bg-green-50' : 'bg-red-50'}`}>
      {result.isValid ? (
        <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
      ) : (
        <XCircleIcon className="h-6 w-6 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
      )}
      <div>
        <p className={`font-semibold ${result.isValid ? 'text-green-800' : 'text-red-800'}`}>{result.message}</p>
        {result.details && <div className="text-sm text-gray-600 mt-1">{result.details}</div>}
      </div>
    </li>
  );
};

const ValidationTab: React.FC = () => {
  const { 
    projectTitle, 
    researchData,
    selectedSources,
    subtitle, 
    author, 
    description, 
    metadataKeywords, 
    categories,
    coverImage,
    bookStructure,
    chapterContents
  } = useProject();

  const validationResults: ValidationResult[] = useMemo(() => {
    const results: ValidationResult[] = [];

    // Research phase validation
    results.push({ 
      isValid: !!researchData, 
      message: "Ricerca Completata", 
      details: researchData ? `Trovate ${researchData.sources.length} fonti, ${researchData.titles.length} titoli, ${researchData.keywords.length} keywords` : "Esegui una ricerca nella scheda 'Ricerca'"
    });
    
    results.push({ 
      isValid: selectedSources.length > 0, 
      message: "Fonti Selezionate per il Contenuto", 
      details: selectedSources.length > 0 ? `${selectedSources.length} fonti selezionate per la generazione dei contenuti` : "Seleziona almeno una fonte nella scheda 'Ricerca'"
    });

    // Metadata checks
    results.push({ isValid: !!projectTitle.trim(), message: "Titolo del Progetto Definito" });
    results.push({ isValid: !!subtitle.trim(), message: "Sottotitolo Presente" });
    results.push({ isValid: !!author.trim(), message: "Nome Autore Inserito" });
    results.push({ isValid: description.trim().length > 50, message: "Descrizione Completa", details: "Una buona descrizione dovrebbe avere almeno 50 caratteri." });
    results.push({ isValid: metadataKeywords.length >= 5, message: "Numero di Keywords Sufficiente", details: `Hai ${metadataKeywords.length} keywords. KDP ne raccomanda almeno 5-7.` });
    results.push({ isValid: categories.trim().length > 0, message: "Categorie KDP Inserite" });

    // Cover check
    results.push({ isValid: !!coverImage, message: "Copertina Selezionata" });
    
    // Structure & Content check
    results.push({ 
      isValid: !!bookStructure, 
      message: "Struttura del Libro Generata",
      details: bookStructure ? `${bookStructure.chapters.length} capitoli con ${bookStructure.chapters.reduce((acc, ch) => acc + ch.subchapters.length, 0)} sottocapitoli` : "Genera la struttura nella scheda 'Struttura'"
    });

    if (bookStructure) {
      const allItems = bookStructure.chapters.flatMap(ch => [ch, ...ch.subchapters]);
      const totalItems = allItems.length;
      const writtenItems = allItems.filter(item => chapterContents[item.id] && chapterContents[item.id].trim().length > 0).length;
      const completionPercentage = totalItems > 0 ? Math.round((writtenItems / totalItems) * 100) : 0;
      
      results.push({
        isValid: completionPercentage === 100,
        message: "Contenuto del Libro Completo",
        details: `${writtenItems} di ${totalItems} sezioni completate (${completionPercentage}%).`
      });

      if (completionPercentage < 100) {
        const missingSections = allItems.filter(item => !chapterContents[item.id] || chapterContents[item.id].trim().length === 0).slice(0, 5);
        results.push({
            isValid: false,
            message: "Sezioni con Contenuto Mancante",
            details: (
                <>
                    <p>Le seguenti sezioni non hanno ancora contenuto:</p>
                    <ul className="list-disc list-inside ml-2 mt-1">
                        {missingSections.map(s => <li key={s.id}>{s.title}</li>)}
                    </ul>
                    {totalItems > writtenItems + 5 && <p>...e altre.</p>}
                </>
            )
        })
      }

    } else {
        results.push({ isValid: false, message: "Contenuto del Libro non Verificabile", details: "Genera prima la struttura del libro." });
    }

    return results;
  }, [projectTitle, researchData, selectedSources, subtitle, author, description, metadataKeywords, categories, coverImage, bookStructure, chapterContents]);

  const isFullyValid = useMemo(() => validationResults.every(r => r.isValid), [validationResults]);
  
  const completionPercentage = useMemo(() => {
    const validCount = validationResults.filter(r => r.isValid).length;
    return Math.round((validCount / validationResults.length) * 100);
  }, [validationResults]);

  return (
    <Card>
      <h1 className="text-2xl font-bold mb-2">Validazione Progetto KDP</h1>
      <p className="text-gray-600 mb-6">
        Controlla lo stato di avanzamento del tuo progetto. Assicurati che tutti i punti siano validi prima di procedere all'esportazione.
      </p>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">Completamento Progetto</span>
          <span className="font-bold text-lg">{completionPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${completionPercentage === 100 ? 'bg-green-500' : completionPercentage >= 75 ? 'bg-blue-500' : completionPercentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {isFullyValid ? (
          <div className="p-4 border-l-4 border-green-500 bg-green-50 text-center">
            <p className="font-bold text-green-800 text-lg">Congratulazioni! Il tuo progetto è pronto per essere esportato.</p>
          </div>
      ) : (
          <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 text-center">
            <p className="font-semibold text-yellow-800">Ci sono ancora alcuni punti da completare.</p>
          </div>
      )}
      
      <ul className="space-y-4 mt-6">
        {validationResults.map((result, index) => (
          <ValidationItem key={index} result={result} />
        ))}
      </ul>
    </Card>
  );
};

export default ValidationTab;