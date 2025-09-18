import React from 'react';
import type { Project } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import { XIcon, TrashIcon } from './common/Icons';

interface ProjectArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onLoad: (projectId: string) => void;
  onDelete: (projectId: string) => void;
}

const ProjectArchiveModal: React.FC<ProjectArchiveModalProps> = ({ isOpen, onClose, projects, onLoad, onDelete }) => {
  const { t } = useLocalization();

  if (!isOpen) return null;

  const handleDelete = (project: Project) => {
    if (window.confirm(`${t('confirmDelete')} "${project.projectTitle}"`)) {
      onDelete(project.id);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-neutral-dark">{t('projectArchive')}</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200">
            <XIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {projects.length > 0 ? (
            <ul className="space-y-3">
              {projects.map(project => (
                <li key={project.id} className="p-3 border rounded-lg flex justify-between items-center hover:bg-gray-50 transition">
                  <div>
                    <p className="font-semibold text-brand-dark">{project.projectTitle}</p>
                    <p className="text-xs text-gray-500">{t('lastSaved')}: {new Date(project.lastSaved).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onLoad(project.id)}
                      className="bg-brand-primary hover:bg-brand-secondary text-white font-bold py-1 px-4 rounded transition-colors"
                    >
                      {t('loadProject')}
                    </button>
                    <button 
                      onClick={() => handleDelete(project)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors"
                      title={t('deleteProject')}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 py-8">{t('noArchivedProjects')}</p>
          )}
        </div>

        <div className="p-4 border-t text-right">
            <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-neutral-dark font-bold py-2 px-6 rounded">
              {t('close')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectArchiveModal;
