import React, { useState, useMemo, useEffect } from 'react';
import { performResearch } from '../../services/geminiService';
import type { ResearchResult, Source, SearchHistoryItem } from '../../types';
import Card from '../common/Card';
import Spinner from '../common/Spinner';
import { useLocalization } from '../../hooks/useLocalization';
import { useProject } from '../../hooks/useProject';
import { ExternalLinkIcon, LightBulbIcon } from '../common/Icons';

const RESEARCH_HISTORY_KEY = 'emmerrekdp_research_history';

const ResearchTab: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
    const { t, language } = useLocalization();
    const { 
      researchData, 
      setResearchData, 
      selectedSources, 
      toggleSourceSelection,
      toggleSelectAllSources
    } = useProject();

    // Load history from localStorage on mount
    useEffect(() => {
        try {
            const savedHistory = localStorage.getItem(RESEARCH_HISTORY_KEY);
            if (savedHistory) {
                setSearchHistory(JSON.parse(savedHistory));
            }
        } catch (error) {
            console.error("Failed to load search history from localStorage", error);
        }
    }, []);

    // Save history to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem(RESEARCH_HISTORY_KEY, JSON.stringify(searchHistory));
        } catch (error) {
            console.error("Failed to save search history to localStorage", error);
        }
    }, [searchHistory]);

    const handleSearch = async () => {
        const trimmedTopic = topic.trim();
        if (!trimmedTopic) return;
        setIsLoading(true);
        setResearchData(null);
        try {
            const data = await performResearch(trimmedTopic, language);
            setResearchData(data);
            if (!searchHistory.some(item => item.topic.toLowerCase() === trimmedTopic.toLowerCase())) {
                setSearchHistory(prev => [{ id: Date.now().toString(), topic: trimmedTopic, timestamp: new Date().toISOString(), results: data }, ...prev]);
            }
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleHistoryClick = (item: SearchHistoryItem) => {
        setTopic(item.topic);
        setResearchData(item.results);
    };

    const handleSourceSelection = (source: Source) => {
        toggleSourceSelection(source);
    };
    
    const stats = useMemo(() => {
        if (!researchData) return { analyzed: 0, saved: 0, avgRelevance: 0 };
        const totalRelevance = researchData.sources.reduce((acc, s) => acc + s.relevance, 0);
        return {
            analyzed: researchData.sources.length,
            saved: selectedSources.length,
            avgRelevance: researchData.sources.length > 0 ? Math.round(totalRelevance / researchData.sources.length) : 0,
        };
    }, [researchData, selectedSources]);
    
    const areAllSourcesSelected = useMemo(() => {
        if (!researchData || researchData.sources.length === 0) return false;
        return selectedSources.length === researchData.sources.length;
    }, [researchData, selectedSources]);

    return (
        <div>
            {/* Search Bar */}
            <div className="flex gap-4 mb-8">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder={t('searchTopic')}
                    className="flex-grow p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-brand-primary focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                    onClick={handleSearch}
                    disabled={isLoading}
                    className="bg-brand-primary text-white font-bold py-3 px-8 rounded-lg shadow-md hover:bg-brand-secondary transition duration-300 disabled:bg-gray-400 min-w-[120px]"
                >
                    {isLoading ? <Spinner /> : t('startResearch')}
                </button>
            </div>

            {isLoading && <div className="text-center p-8"><Spinner /></div>}
            
            {researchData && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Column 1: Sources */}
                    <div className="lg:col-span-2">
                        <Card>
                             <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">{t('sources')} ({researchData.sources.length})</h2>
                                {researchData.sources.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="checkbox" 
                                        id="select-all-sources"
                                        className="h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary"
                                        checked={areAllSourcesSelected}
                                        onChange={() => toggleSelectAllSources()}
                                    />
                                    <label htmlFor="select-all-sources" className="text-sm font-medium text-gray-700 cursor-pointer">{t('selectAllSources')}</label>
                                </div>
                                )}
                            </div>
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                {researchData.sources.length > 0 ? researchData.sources.map(source => (
                                    <div key={source.uri} className="border-2 p-4 rounded-lg flex items-start gap-4 hover:bg-gray-50 transition-all duration-200 hover:shadow-md">
                                        <input type="checkbox" className="mt-1.5 h-4 w-4 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" checked={selectedSources.some(s => s.uri === source.uri)} onChange={() => handleSourceSelection(source)} />
                                        <div className="flex-grow">
                                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-brand-secondary font-semibold hover:underline flex items-center gap-2">
                                                {source.title} <ExternalLinkIcon className="h-4 w-4" />
                                            </a>
                                            <p className="text-sm text-gray-600 mt-1">{source.summary}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Fonte Verificata</span>
                                                <span className="text-xs text-gray-500">Qualità: {source.relevance >= 90 ? 'Eccellente' : source.relevance >= 80 ? 'Ottima' : 'Buona'}</span>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <div className={`text-lg font-bold ${source.relevance >= 90 ? 'text-green-600' : source.relevance >= 80 ? 'text-blue-600' : 'text-orange-600'}`}>{source.relevance}%</div>
                                            <div className="text-xs text-gray-500">{t('relevance')}</div>
                                        </div>
                                    </div>
                                )) : <p className="text-gray-500">{t('noResults')}</p>}
                            </div>
                        </Card>
                    </div>

                    {/* Column 2: Titles, Subtitles & Keywords */}
                    <div>
                        <Card className="mb-8">
                            <h2 className="text-xl font-bold mb-4">{t('titles')}</h2>
                            <p className="text-sm text-gray-600 mb-4">Titoli ottimizzati per massima conversione e profittabilità</p>
                            <ul className="space-y-3">
                                {researchData.titles.map(title => (
                                    <li key={title.title} className="flex justify-between items-start p-3 rounded-lg hover:bg-gray-50 border-l-4 border-brand-primary">
                                        <div className="flex-grow pr-4">
                                            <span className="text-gray-800 font-medium leading-tight">{title.title}</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Alta Conversione</span>
                                                {title.relevance >= 95 && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">🏆 Top Performer</span>}
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <span className={`font-bold text-lg ${title.relevance >= 95 ? 'text-green-600' : title.relevance >= 90 ? 'text-blue-600' : 'text-orange-600'}`}>{title.relevance}%</span>
                                            <div className="text-xs text-gray-500">Potenziale</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                        {researchData.subtitles && researchData.subtitles.length > 0 && (
                          <Card className="mb-8">
                              <h2 className="text-xl font-bold mb-4">{t('subtitles')}</h2>
                              <p className="text-sm text-gray-600 mb-4">Sottotitoli ad alta conversione per massimizzare l'appeal commerciale</p>
                              <ul className="space-y-3">
                                  {researchData.subtitles.map(subtitle => (
                                      <li key={subtitle.subtitle} className="flex justify-between items-start p-3 rounded-lg hover:bg-gray-50 border-l-4 border-brand-accent">
                                          <div className="flex-grow pr-4">
                                              <span className="text-gray-800 leading-tight">{subtitle.subtitle}</span>
                                              <div className="flex items-center gap-2 mt-1">
                                                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Benefit-Driven</span>
                                                  {subtitle.relevance >= 92 && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">💎 Premium</span>}
                                              </div>
                                          </div>
                                          <div className="text-right flex-shrink-0">
                                              <span className={`font-bold text-lg ${subtitle.relevance >= 92 ? 'text-green-600' : subtitle.relevance >= 85 ? 'text-blue-600' : 'text-orange-600'}`}>{subtitle.relevance}%</span>
                                              <div className="text-xs text-gray-500">Appeal</div>
                                          </div>
                                      </li>
                                  ))}
                              </ul>
                          </Card>
                        )}
                        <Card>
                            <h2 className="text-xl font-bold mb-4">{t('keywords')}</h2>
                            <p className="text-sm text-gray-600 mb-4">Keywords ottimizzate per Amazon con alto traffico e bassa concorrenza</p>
                            <div className="flex flex-wrap gap-2">
                                {researchData.keywords.map(kw => (
                                    <div key={kw.keyword} className={`text-sm font-medium px-3 py-2 rounded-full flex items-center gap-2 ${
                                        kw.relevance >= 95 ? 'bg-green-100 text-green-800 border border-green-200' :
                                        kw.relevance >= 85 ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                        'bg-gray-100 text-gray-800 border border-gray-200'
                                    }`}>
                                        {kw.keyword} 
                                        <span className="text-xs font-bold bg-white px-1.5 py-0.5 rounded-full">{kw.relevance}%</span>
                                        {kw.relevance >= 95 && <span className="text-xs">🔥</span>}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* Bottom Row: Stats & History */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                     <h2 className="text-xl font-bold mb-4">{t('researchStats')}</h2>
                     <div className="grid grid-cols-3 gap-4 text-center">
                         <div>
                             <p className="text-3xl font-bold text-brand-primary">{stats.analyzed}</p>
                             <p className="text-sm text-gray-500">{t('sourcesAnalyzed')}</p>
                         </div>
                         <div>
                             <p className="text-3xl font-bold text-brand-primary">{stats.saved}</p>
                             <p className="text-sm text-gray-500">{t('sourcesSaved')}</p>
                         </div>
                         <div>
                             <p className="text-3xl font-bold text-brand-primary">{stats.avgRelevance}%</p>
                             <p className="text-sm text-gray-500">{t('avgRelevance')}</p>
                         </div>
                     </div>
                     <div className="mt-6 text-center">
                         <button className="bg-yellow-400 text-yellow-900 font-semibold py-2 px-4 rounded-lg inline-flex items-center gap-2 hover:bg-yellow-500 transition" onClick={() => alert('Funzionalità di analisi con NotebookLM non ancora implementata.')}>
                             <LightBulbIcon className="h-5 w-5" />
                             {t('analyzeWithNotebookLM')}
                         </button>
                     </div>
                </Card>
                {searchHistory.length > 0 && (
                <Card>
                    <h2 className="text-xl font-bold mb-4">{t('searchHistory')}</h2>
                    <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {searchHistory.map(item => (
                            <li key={item.id} className="p-2 rounded hover:bg-gray-100 cursor-pointer flex justify-between items-center" onClick={() => handleHistoryClick(item)}>
                                <p className="font-medium text-gray-800">{item.topic}</p>
                                <p className="text-xs text-gray-400">{new Date(item.timestamp).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                </Card>
                )}
            </div>
        </div>
    );
};

export default ResearchTab;