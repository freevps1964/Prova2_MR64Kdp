import React, { useState } from 'react';
import Card from '../common/Card';
import { useProject } from '../../hooks/useProject';
import { useLocalization } from '../../hooks/useLocalization';
import type { LayoutTemplate } from '../../types';
import { DownloadIcon } from '../common/Icons';

const LayoutTab: React.FC = () => {
  const { projectTitle, bookStructure, chapterContents, layoutTemplate, setLayoutTemplate } = useProject();
  const { t } = useLocalization();
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);

  if (!bookStructure || !projectTitle) {
    return (
      <Card>
        <h1 className="text-2xl font-bold mb-4">{t('layoutPreview')}</h1>
        <p className="text-gray-600">
          Genera una struttura e dei contenuti prima di visualizzare l'anteprima del layout.
        </p>
      </Card>
    );
  }
  
  const templates: { id: LayoutTemplate; name: string }[] = [
      { id: 'Classic', name: t('classic') },
      { id: 'Modern', name: t('modern') },
      { id: 'Minimalist', name: t('minimalist') },
  ];

  const templateStyles: Record<LayoutTemplate, string> = {
      Classic: 'font-serif text-gray-800',
      Modern: 'font-sans text-neutral-dark',
      Minimalist: 'font-sans text-gray-700',
  };

  const handleDownload = (format: 'pdf' | 'docx' | 'epub') => {
      alert(`Download del file ${format.toUpperCase()} avviato. (Funzionalità simulata)`);
      setIsDownloadOpen(false);
  };

  const renderContent = (content: string | undefined) => {
    if (!content) return <p className="text-gray-400 italic my-6">Contenuto non ancora generato.</p>;
    return content.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
      <p key={index} className="mb-4 indent-8">{paragraph}</p>
    ));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Controls Column */}
      <div className="lg:col-span-1 space-y-8">
        <Card>
          <h2 className="text-xl font-bold mb-4">{t('layoutTemplates')}</h2>
          <div className="space-y-2">
            {templates.map(template => (
              <div key={template.id} className="flex items-center">
                <input
                  type="radio"
                  id={`template-${template.id}`}
                  name="layout-template"
                  value={template.id}
                  checked={layoutTemplate === template.id}
                  onChange={() => setLayoutTemplate(template.id)}
                  className="h-4 w-4 text-brand-primary border-gray-300 focus:ring-brand-primary"
                />
                <label htmlFor={`template-${template.id}`} className="ml-3 block text-sm font-medium text-gray-700">
                  {template.name}
                </label>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-bold mb-4">{t('download')}</h2>
          <div className="relative">
            <button
              onClick={() => setIsDownloadOpen(!isDownloadOpen)}
              className="w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-brand-secondary transition duration-300 flex items-center justify-center gap-2"
            >
              <DownloadIcon className="h-5 w-5" />
              {t('downloadAs')}
            </button>
            {isDownloadOpen && (
              <div className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-lg shadow-xl border">
                <button onClick={() => handleDownload('pdf')} className="w-full text-left px-4 py-2 hover:bg-gray-100">PDF</button>
                <button onClick={() => handleDownload('docx')} className="w-full text-left px-4 py-2 hover:bg-gray-100">DOCX</button>
                <button onClick={() => handleDownload('epub')} className="w-full text-left px-4 py-2 hover:bg-gray-100">EPUB</button>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Preview Column */}
      <div className="lg:col-span-3">
        <Card className="!p-0">
          <div className="bg-gray-200 p-8">
            <div className={`max-w-3xl mx-auto bg-white shadow-lg p-12 h-[75vh] overflow-y-auto transition-all duration-300 ${templateStyles[layoutTemplate]}`}>
              <h1 className="text-4xl font-bold text-center mb-16 break-words">{projectTitle}</h1>
              
              {bookStructure.chapters.map(chapter => (
                <div key={chapter.id} className="mb-12" style={{ pageBreakBefore: 'always' }}>
                  <h2 className="text-3xl font-bold mb-6 border-b pb-2">{chapter.title}</h2>
                  <div className="text-lg leading-relaxed text-justify whitespace-pre-wrap">
                    {renderContent(chapterContents[chapter.id])}
                  </div>

                  {chapter.subchapters.map(subchapter => (
                    <div key={subchapter.id} className="mt-8 ml-6">
                      <h3 className="text-2xl font-semibold mb-4">{subchapter.title}</h3>
                      <div className="text-base leading-relaxed text-justify whitespace-pre-wrap">
                        {renderContent(chapterContents[subchapter.id])}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LayoutTab;