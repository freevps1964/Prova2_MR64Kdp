import React, { useState } from 'react';
import Card from '../common/Card';
import { useProject } from '../../hooks/useProject';
import { useLocalization } from '../../hooks/useLocalization';
import { generateCoverImages } from '../../services/geminiService';
import Spinner from '../common/Spinner';
import { SparklesIcon } from '../common/Icons';

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
        <Card>
          <h1 className="text-2xl font-bold mb-4">{t('generateCover')}</h1>
          <p className="text-gray-600 mb-6">
            {t('coverGenerationInfo')}
          </p>
          <button
            onClick={handleGenerateCover}
            disabled={isLoading || !projectTitle || !researchData?.keywords}
            className="w-full bg-brand-primary text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-brand-secondary transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <SparklesIcon className="h-5 w-5" />
            {isLoading ? t('generatingCover') : t('generateCover')}
          </button>
           {!projectTitle && <p className="text-red-500 text-xs mt-2 text-center">È necessario un titolo di progetto.</p>}
           {projectTitle && !researchData?.keywords && <p className="text-red-500 text-xs mt-2 text-center">Esegui prima una ricerca per le parole chiave.</p>}
        </Card>
      </div>

      {/* Preview Column */}
      <div className="md:col-span-2">
        <Card className="min-h-[60vh] flex items-center justify-center">
          {isLoading ? (
            <Spinner />
          ) : coverOptions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              {coverOptions.map((src, index) => (
                 <div key={index} className="flex flex-col items-center gap-2">
                    <img 
                      src={src}
                      alt={`Generated Book Cover Option ${index + 1}`}
                      className={`w-full object-contain rounded-lg shadow-lg cursor-pointer transition-all duration-200 ${coverImage === src ? 'ring-4 ring-brand-primary ring-offset-2' : 'hover:opacity-80'}`}
                      onClick={() => setCoverImage(src)}
                    />
                    <p className="text-sm text-gray-500">Opzione {index + 1}</p>
                 </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p>L'anteprima delle copertine apparirà qui.</p>
              <p className="text-xs mt-1">Clicca su 'Genera Copertina' per iniziare.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CoverTab;