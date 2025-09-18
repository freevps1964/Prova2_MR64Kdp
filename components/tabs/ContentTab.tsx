import React, { useState } from 'react';
import Card from '../common/Card';
import { useProject } from '../../hooks/useProject';
import { useLocalization } from '../../hooks/useLocalization';
import { generateChapterContent } from '../../services/geminiService';
import Spinner from '../common/Spinner';
import type { Chapter, SubChapter } from '../../types';

type SelectedItem = (Chapter | SubChapter) & { isSubchapter: boolean };

const ContentTab: React.FC = () => {
    const { 
      bookStructure, 
      selectedSources, 
      chapterContents, 
      updateChapterContent 
    } = useProject();
    const { t } = useLocalization();
    const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGeneratingAll, setIsGeneratingAll] = useState(false);
    const [generationStatus, setGenerationStatus] = useState('');
    
    const handleGenerateContent = async () => {
        if (!selectedItem) {
            alert("Seleziona un capitolo o sottocapitolo per generare il contenuto.");
            return;
        }
        if (selectedSources.length === 0) {
            alert("Seleziona almeno una fonte di ricerca nella scheda 'Ricerca' prima di generare il contenuto.");
            return;
        }
        setIsLoading(true);
        try {
            const content = await generateChapterContent(selectedItem.title, selectedSources);
            updateChapterContent(selectedItem.id, content);
        } catch (error) {
            console.error("Failed to generate content", error);
            alert("Si è verificato un errore durante la generazione del contenuto.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleGenerateAllContent = async () => {
        if (!bookStructure) {
            alert("Genera prima una struttura del libro nella scheda 'Struttura'.");
            return;
        }
        if (selectedSources.length === 0) {
            alert("Seleziona almeno una fonte di ricerca nella scheda 'Ricerca' prima di generare i contenuti.");
            return;
        }
        setIsGeneratingAll(true);
        const allItems = bookStructure.chapters.flatMap(ch => [{...ch, isSubchapter: false}, ...ch.subchapters.map(sub => ({...sub, isSubchapter: true}))]);

        for (let i = 0; i < allItems.length; i++) {
            const item = allItems[i];
            if (chapterContents[item.id] && chapterContents[item.id].trim().length > 0) {
                continue; // Skip if content already exists
            }
            setGenerationStatus(`${t('generating')} "${item.title}" (${i + 1}/${allItems.length})...`);
            try {
                const content = await generateChapterContent(item.title, selectedSources);
                updateChapterContent(item.id, content);
            } catch (error) {
                console.error(`Failed to generate content for ${item.title}:`, error);
                // Optionally, update the content with an error message
                updateChapterContent(item.id, `Errore durante la generazione per: ${item.title}`);
            }
        }
        setGenerationStatus('');
        setIsGeneratingAll(false);
    };

    if (!bookStructure) {
        return (
            <Card>
                <h1 className="text-2xl font-bold mb-4">Genera Contenuti Testuali</h1>
                <p className="text-gray-600">
                    Per favore, genera prima una struttura per il libro nella scheda 'Struttura'.
                </p>
            </Card>
        );
    }

    const currentContent = selectedItem ? chapterContents[selectedItem.id] || '' : '';

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-[75vh]">
            {/* Left Column: Structure */}
            <div className="md:col-span-1">
                <Card className="h-full">
                    <h2 className="text-xl font-bold mb-4">{t('structure')}</h2>
                    <div className="space-y-2 overflow-y-auto h-[calc(100%-40px)] pr-2">
                        {bookStructure.chapters.map((chapter) => (
                            <div key={chapter.id}>
                                <div
                                    onClick={() => setSelectedItem({ ...chapter, isSubchapter: false })}
                                    className={`p-2 rounded cursor-pointer font-semibold ${selectedItem?.id === chapter.id ? 'bg-brand-secondary text-white' : 'hover:bg-gray-100'}`}
                                >
                                    {chapter.title}
                                </div>
                                <div className="ml-4 mt-1 space-y-1">
                                    {chapter.subchapters.map((subchapter) => (
                                        <div
                                            key={subchapter.id}
                                            onClick={() => setSelectedItem({ ...subchapter, isSubchapter: true })}
                                            className={`p-2 rounded cursor-pointer ${selectedItem?.id === subchapter.id ? 'bg-brand-light text-white' : 'hover:bg-gray-100'}`}
                                        >
                                            {subchapter.title}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
            
            {/* Right Column: Content Editor */}
            <div className="md:col-span-2">
                <Card className="h-full flex flex-col">
                    {selectedItem ? (
                        <>
                            <div className="flex justify-between items-center mb-4 gap-4">
                                <h2 className="text-xl font-bold truncate" title={selectedItem.title}>{selectedItem.title}</h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleGenerateAllContent}
                                        disabled={isGeneratingAll || isLoading || selectedSources.length === 0}
                                        className="bg-brand-accent hover:bg-yellow-500 text-brand-dark font-bold py-2 px-6 rounded-lg shadow-md transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {isGeneratingAll ? t('generating') : t('generateAll')}
                                    </button>
                                    <button
                                        onClick={handleGenerateContent}
                                        disabled={isGeneratingAll || isLoading || selectedSources.length === 0}
                                        className="bg-brand-primary text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-brand-secondary transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? <Spinner /> : 'Genera Contenuto'}
                                    </button>
                                </div>
                            </div>
                             {selectedSources.length === 0 && <p className="text-red-500 text-xs mb-2 text-right">Seleziona almeno una fonte nella scheda 'Ricerca'.</p>}
                             {selectedSources.length > 0 && <p className="text-green-600 text-xs mb-2 text-right">✓ {selectedSources.length} fonti selezionate</p>}
                             {isGeneratingAll && <p className="text-blue-600 text-sm mb-2 text-center animate-pulse">{generationStatus}</p>}
                            <div className="flex-grow relative">
                            {(isLoading || isGeneratingAll) && (
                                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                                    {isLoading && <Spinner />}
                                </div>
                            )}
                                <textarea
                                    value={currentContent}
                                    onChange={(e) => updateChapterContent(selectedItem.id, e.target.value)}
                                    placeholder="Il contenuto generato apparirà qui..."
                                    className="w-full h-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-brand-primary focus:outline-none disabled:bg-gray-100"
                                    disabled={isGeneratingAll}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                             <button
                                onClick={handleGenerateAllContent}
                                disabled={isGeneratingAll || isLoading || selectedSources.length === 0}
                                className="bg-brand-accent hover:bg-yellow-500 text-brand-dark font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed mb-4"
                            >
                                {isGeneratingAll ? t('generating') : t('generateAll')}
                            </button>
                            <p>Seleziona un capitolo o sottocapitolo per iniziare a scrivere.</p>
                             {isGeneratingAll && <p className="text-blue-600 text-sm mt-4 text-center animate-pulse">{generationStatus}</p>}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default ContentTab;
