import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect, useMemo } from 'react';
import type { ResearchResult, Source, BookStructure, Project, LayoutTemplate, Keyword } from '../types';
import { getProjects, saveProject as saveProjectApi, deleteProject as deleteProjectApi } from '../services/apiService';

interface ProjectContextType {
  projectId: string | null;
  projectTitle: string;
  setProjectTitle: (title: string) => void;
  subtitle: string;
  setSubtitle: (subtitle: string) => void;
  author: string;
  setAuthor: (author: string) => void;
  description: string;
  setDescription: (description: string) => void;
  metadataKeywords: Keyword[];
  setMetadataKeywords: (keywords: Keyword[]) => void;
  categories: string;
  setCategories: (categories: string) => void;
  researchData: ResearchResult | null;
  setResearchData: (data: ResearchResult | null) => void;
  selectedSources: Source[];
  toggleSourceSelection: (source: Source) => void;
  toggleSelectAllSources: () => void;
  bookStructure: BookStructure | null;
  setBookStructure: (structure: BookStructure | null) => void;
  chapterContents: Record<string, string>;
  updateChapterContent: (id: string, content: string) => void;
  isProjectStarted: boolean;
  startProject: (title: string) => void;
  resetProject: () => void;
  progress: number;
  savedProjects: Project[];
  saveCurrentProject: () => void;
  loadProject: (projectId: string) => void;
  deleteProject: (projectId: string) => void;
  layoutTemplate: LayoutTemplate;
  setLayoutTemplate: (template: LayoutTemplate) => void;
  coverImage: string | null;
  setCoverImage: (image: string | null) => void;
  coverOptions: string[];
  setCoverOptions: (images: string[]) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [isProjectStarted, setIsProjectStarted] = useState(false);
  const [researchData, setResearchData] = useState<ResearchResult | null>(null);
  const [selectedSources, setSelectedSources] = useState<Source[]>([]);
  const [bookStructure, setBookStructure] = useState<BookStructure | null>(null);
  const [chapterContents, setChapterContents] = useState<Record<string, string>>({});
  const [savedProjects, setSavedProjects] = useState<Project[]>([]);
  const [layoutTemplate, setLayoutTemplate] = useState<LayoutTemplate>('Classic');
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverOptions, setCoverOptions] = useState<string[]>([]);
  
  // Metadata state
  const [subtitle, setSubtitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [metadataKeywords, setMetadataKeywords] = useState<Keyword[]>([]);
  const [categories, setCategories] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
        try {
            const projectsFromApi = await getProjects();
            setSavedProjects(projectsFromApi);
        } catch (error) {
            console.error("Failed to load projects from API", error);
        }
    };
    fetchProjects();
  }, []);

  const handleNewResearchData = (data: ResearchResult | null) => {
    setResearchData(data);
    if (data?.keywords) {
        setMetadataKeywords(data.keywords);
    }
  };

  const toggleSourceSelection = useCallback((source: Source) => {
    setSelectedSources(prev => {
      if (prev.find(s => s.uri === source.uri)) {
        return prev.filter(s => s.uri !== source.uri);
      } else {
        return [...prev, source];
      }
    });
  }, []);

  const toggleSelectAllSources = useCallback(() => {
    if (!researchData) return;
    setSelectedSources(prev => {
        if(prev.length === researchData.sources.length) {
            return []; // Deselect all
        } else {
            return [...researchData.sources]; // Select all
        }
    });
  }, [researchData]);

  const updateChapterContent = useCallback((id: string, content: string) => {
    setChapterContents(prev => ({ ...prev, [id]: content }));
  }, []);
  
  const resetProject = useCallback(() => {
    setProjectId(null);
    setProjectTitle('');
    setIsProjectStarted(false);
    setResearchData(null);
    setSelectedSources([]);
    setBookStructure(null);
    setChapterContents({});
    setLayoutTemplate('Classic');
    setCoverImage(null);
    setCoverOptions([]);
    setSubtitle('');
    setAuthor('');
    setDescription('');
    setMetadataKeywords([]);
    setCategories('');
  }, []);

  const startProject = useCallback((title: string) => {
    if (title.trim() === '') {
      alert('Per favore, inserisci un titolo per il progetto.');
      return;
    }
    resetProject();
    setProjectId(Date.now().toString());
    setProjectTitle(title);
    setIsProjectStarted(true);
  }, [resetProject]);

  const progress = useMemo(() => {
    let total = 0;
    if (researchData) total += 15;
    if (bookStructure) {
      total += 15;
      const totalItems = bookStructure.chapters.reduce((acc, chap) => acc + 1 + chap.subchapters.length, 0);
      if (totalItems > 0) {
        const contentItems = Object.keys(chapterContents).filter(key => chapterContents[key]?.trim() !== '');
        const contentProgress = (contentItems.length / totalItems) * 40;
        total += contentProgress;
      }
    }
    if (coverImage) total += 10;
    if (subtitle) total += 4;
    if (author) total += 4;
    if (description) total += 4;
    if (metadataKeywords.length >= 5) total += 4;
    if (categories) total += 4;
    
    return Math.min(Math.round(total), 100);
  }, [researchData, bookStructure, chapterContents, coverImage, subtitle, author, description, metadataKeywords, categories]);

  const saveCurrentProject = useCallback(async () => {
    if (!isProjectStarted || !projectId) {
      alert("Avvia un progetto prima di salvare.");
      return;
    }
    const currentProject: Project = {
      id: projectId,
      projectTitle,
      subtitle,
      author,
      description,
      metadataKeywords,
      categories,
      researchData,
      selectedSources,
      bookStructure,
      chapterContents,
      lastSaved: new Date().toISOString(),
      layoutTemplate,
      coverImage,
      coverOptions,
    };

    try {
      const savedProject = await saveProjectApi(currentProject);
      setSavedProjects(prev => {
        const existingIndex = prev.findIndex(p => p.id === savedProject.id);
        if (existingIndex > -1) {
          const newProjects = [...prev];
          newProjects[existingIndex] = savedProject;
          return newProjects;
        } else {
          return [savedProject, ...prev];
        }
      });
      alert(`Progetto "${projectTitle}" salvato!`);
    } catch (error) {
      console.error(error);
      alert(`Errore nel salvataggio del progetto "${projectTitle}".`);
    }
  }, [projectId, projectTitle, researchData, selectedSources, bookStructure, chapterContents, isProjectStarted, layoutTemplate, coverImage, coverOptions, subtitle, author, description, metadataKeywords, categories]);

  const loadProject = useCallback((projectIdToLoad: string) => {
    const projectToLoad = savedProjects.find(p => p.id === projectIdToLoad);
    if (projectToLoad) {
      setProjectId(projectToLoad.id);
      setProjectTitle(projectToLoad.projectTitle);
      setResearchData(projectToLoad.researchData);
      setSelectedSources(projectToLoad.selectedSources);
      setBookStructure(projectToLoad.bookStructure);
      setChapterContents(projectToLoad.chapterContents);
      setLayoutTemplate(projectToLoad.layoutTemplate || 'Classic');
      setCoverImage(projectToLoad.coverImage || null);
      setCoverOptions(projectToLoad.coverOptions || []);
      setSubtitle(projectToLoad.subtitle || '');
      setAuthor(projectToLoad.author || '');
      setDescription(projectToLoad.description || '');
      setMetadataKeywords(projectToLoad.metadataKeywords || []);
      setCategories(projectToLoad.categories || '');
      setIsProjectStarted(true);
    }
  }, [savedProjects]);

  const deleteProject = useCallback(async (projectIdToDelete: string) => {
    try {
      await deleteProjectApi(projectIdToDelete);
      setSavedProjects(prev => prev.filter(p => p.id !== projectIdToDelete));
    } catch (error) {
        console.error(error);
        alert(`Errore nell'eliminazione del progetto.`);
    }
  }, []);

  const value: ProjectContextType = {
    projectId,
    projectTitle,
    setProjectTitle,
    subtitle,
    setSubtitle,
    author,
    setAuthor,
    description,
    setDescription,
    metadataKeywords,
    setMetadataKeywords,
    categories,
    setCategories,
    researchData,
    setResearchData: handleNewResearchData,
    selectedSources,
    toggleSourceSelection,
    toggleSelectAllSources,
    bookStructure,
    setBookStructure,
    chapterContents,
    updateChapterContent,
    isProjectStarted,
    startProject,
    resetProject,
    progress,
    savedProjects,
    saveCurrentProject,
    loadProject,
    deleteProject,
    layoutTemplate,
    setLayoutTemplate,
    coverImage,
    setCoverImage,
    coverOptions,
    setCoverOptions,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = (): ProjectContextType => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};