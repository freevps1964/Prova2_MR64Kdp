import React, { useState } from 'react';
import Card from '../common/Card';
import { useProject } from '../../hooks/useProject';
import { useLocalization } from '../../hooks/useLocalization';
import { generateCoverImages } from '../../services/geminiService';
import Spinner from '../common/Spinner';
import { SparklesIcon } from '../common/Icons';

const AMAZON_CATEGORIES = [
  'Arts & Photography',
  'Biographies & Memoirs',
  'Business & Money',
  'Children\'s Books',
  'Computers & Technology',
  'Cookbooks, Food & Wine',
  'Crafts, Hobbies & Home',
  'Education & Teaching',
  'Health, Fitness & Dieting',
  'History',
  'Humor & Entertainment',
  'Law',
  'Literature & Fiction',
  'Medical Books',
  'Mystery, Thriller & Suspense',
  'Parenting & Relationships',
  'Politics & Social Sciences',
  'Reference',
  'Religion & Spirituality',
  'Romance',
  'Science & Math',
  'Science Fiction & Fantasy',
  'Self-Help',
  'Sports & Outdoors',
  'Teen & Young Adult',
  'Travel'
];

const CoverTab: React.FC = () => {
  const { 
    projectTitle, 
    researchData, 
    coverImage, 
    setCoverImage,
    coverOptions,
    setCoverOptions 
  } = useProject();
  const { t } = useLocalization();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleGenerateCover = async () => {
    if (!projectTitle || !researchData?.keywords || researchData.keywords.length === 0) {
      alert("Assicurati di avere un titolo e delle parole chiave generate nella scheda 'Ricerca'.");
      return;
    }
    setIsLoading(true);
    setCoverOptions([]);
    setCoverImage(null);
    try {
      const imagesB64 = await generateCoverImages(projectTitle, researchData.keywords);
      setCoverOptions(imagesB64);
    } catch (error) {
      console.error("Failed to generate cover", error);
      alert("Si è verificato un errore durante la generazione della copertina.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Controls Column */}
      <div className="md:col-span-1">
        <Card className="space-y-6">
          <h1 className="text-2xl font-bold mb-4">{t('generateCover')}</h1>
          <p className="text-gray-600 mb-6">
            Seleziona una categoria Amazon e genera copertine professionali ottimizzate per il successo commerciale.
          </p>
          
          <div>
            <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-2">
              Categoria Amazon
            </label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none"
            >
              <option value="">Seleziona una categoria...</option>
              {AMAZON_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={handleGenerateCover}
            disabled={isLoading || !projectTitle || !researchData?.keywords}
            className="w-full bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <SparklesIcon className="h-5 w-5" />
            {isLoading ? t('generatingCover') : t('generateCover')}
          </button>
          
           {!projectTitle && <p className="text-red-500 text-xs mt-2 text-center">È necessario un titolo di progetto.</p>}
           {projectTitle && !researchData?.keywords && <p className="text-red-500 text-xs mt-2 text-center">Esegui prima una ricerca per le parole chiave.</p>}
           
           <div className="bg-blue-50 p-4 rounded-lg">
             <h3 className="font-semibold text-blue-800 mb-2">Caratteristiche delle Copertine:</h3>
             <ul className="text-sm text-blue-700 space-y-1">
               <li>• Design professionale ottimizzato per Amazon</li>
               <li>• Basato sui bestseller della categoria</li>
               <li>• 4 varianti creative diverse</li>
               <li>• Spazio ottimizzato per titolo e sottotitolo</li>
               <li>• Logo eMMeRReKDP incluso</li>
             </ul>
           </div>
        </Card>
      </div>

      {/* Preview Column */}
      <div className="md:col-span-2">
        <Card className="min-h-[70vh] flex items-center justify-center">
          {isLoading ? (
            <div className="text-center">
              <Spinner />
              <p className="mt-4 text-gray-600">Generazione copertine professionali in corso...</p>
              <p className="text-sm text-gray-500">Analizzando i bestseller Amazon per la categoria selezionata</p>
            </div>
          ) : coverOptions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {coverOptions.map((src, index) => (
                 <div key={index} className="flex flex-col items-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition">
                    <img 
                      src={src}
                      alt={`Generated Book Cover Option ${index + 1}`}
                      className={`w-full max-w-[280px] object-contain rounded-lg shadow-xl cursor-pointer transition-all duration-300 ${coverImage === src ? 'ring-4 ring-brand-primary ring-offset-4 scale-105' : 'hover:scale-102 hover:shadow-2xl'}`}
                      onClick={() => setCoverImage(src)}
                    />
                    <div className="text-center">
                      <p className="font-semibold text-gray-700">Design {index + 1}</p>
                      <p className="text-xs text-gray-500">
                        {coverImage === src ? '✓ Selezionata' : 'Clicca per selezionare'}
                      </p>
                    </div>
                 </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <SparklesIcon className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">Copertine Professionali AI-Generated</p>
              <p className="text-sm mt-2">Le copertine ottimizzate per Amazon appariranno qui.</p>
              <p className="text-xs mt-1 text-gray-400">Seleziona una categoria e clicca su 'Genera Copertina' per iniziare.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CoverTab;