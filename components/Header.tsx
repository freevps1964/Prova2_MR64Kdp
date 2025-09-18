import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import type { Language } from '../types';
import { GlobeAltIcon, FloppyDiskIcon, ArchiveIcon } from './common/Icons';
import { useProject } from '../hooks/useProject';
import ProgressBar from './common/ProgressBar';
import ProjectArchiveModal from './ProjectArchiveModal';

const Header: React.FC = () => {
  const { language, setLanguage, t } = useLocalization();
  const { 
    projectTitle, 
    setProjectTitle, 
    startProject, 
    isProjectStarted, 
    progress,
    saveCurrentProject,
    savedProjects,
    loadProject,
    deleteProject
  } = useProject();
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  const handleNewProject = () => {
    startProject(projectTitle);
  };
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectTitle(e.target.value);
  }

  // The user-provided logo has been embedded as a Base64 data URI for portability.
  const logoSrc = "data:image/jpeg;base64,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---";

  // FIX: Add a return statement with JSX for the header component.
  // This resolves the error where the component doesn't return a valid ReactNode.
  return (
    <header className="bg-white shadow-md p-4">
      <div className="container mx-auto flex justify-between items-center gap-4">
        {/* Left Side: Logo and Title */}
        <div className="flex items-center gap-4">
          <img src={logoSrc} alt="eMMeRReKDP Logo" className="h-12 w-12 object-contain" />
          <div className="hidden sm:block">
            <h1 className="text-2xl font-bold text-neutral-dark">eMMeRReKDP</h1>
            <p className="text-sm text-gray-600 -mt-1">Book Creation</p>
          </div>
        </div>

        {/* Middle: Project Controls */}
        <div className="flex-grow mx-4 sm:mx-8">
          {isProjectStarted ? (
            <div className="flex items-center gap-4">
              <h2 className="text-lg sm:text-xl font-semibold text-brand-dark break-words flex-1 leading-tight" title={projectTitle} style={{ lineHeight: '1.2' }}>
                {projectTitle}
              </h2>
              <div className="w-1/3 min-w-[150px]">
                 <ProgressBar progress={progress} />
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t('projectTitle')}
                value={projectTitle}
                onChange={handleTitleChange}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleNewProject()}
              />
              <button onClick={handleNewProject} className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary transition whitespace-nowrap">
                {t('newProject')}
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Actions & Language */}
        <div className="flex items-center gap-2 sm:gap-4">
           {isProjectStarted && (
             <>
                <button onClick={saveCurrentProject} title={t('saveProject')} className="p-2 text-gray-600 hover:text-brand-primary hover:bg-gray-200 rounded-full transition">
                    <FloppyDiskIcon className="h-6 w-6" />
                </button>
                <button onClick={() => setIsArchiveOpen(true)} title={t('projectArchive')} className="p-2 text-gray-600 hover:text-brand-primary hover:bg-gray-200 rounded-full transition">
                    <ArchiveIcon className="h-6 w-6" />
                </button>
             </>
           )}
          <div className="relative">
            <GlobeAltIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            <select
              value={language}
              onChange={handleLanguageChange}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg appearance-none focus:ring-brand-primary focus:outline-none bg-white text-sm sm:text-base"
            >
              <option value="it">Italiano</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>
      <ProjectArchiveModal 
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
        projects={savedProjects}
        onLoad={(id) => {
          loadProject(id);
          setIsArchiveOpen(false);
        }}
        onDelete={deleteProject}
      />
    </header>
  );
};

// FIX: Add default export to fix import error in App.tsx.
export default Header;