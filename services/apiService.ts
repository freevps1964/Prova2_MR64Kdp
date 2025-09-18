import type { Project } from '../types';

const PROJECTS_ARCHIVE_KEY = 'emmerrekdp_projects_archive';
const API_LATENCY = 500; // ms

// Helper function to simulate network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// This is a MOCK API service that uses localStorage to simulate a remote database.
// In a real application, these functions would make `fetch` calls to a backend server.

/**
 * Fetches all saved projects from the simulated database.
 */
export const getProjects = async (): Promise<Project[]> => {
  await sleep(API_LATENCY);
  try {
    const storedProjects = localStorage.getItem(PROJECTS_ARCHIVE_KEY);
    return storedProjects ? (JSON.parse(storedProjects) as Project[]) : [];
  } catch (error) {
    console.error("API Mock Error: Failed to fetch projects", error);
    return [];
  }
};

/**
 * Saves a project to the simulated database.
 * If the project exists, it's updated. If not, it's created.
 * @param project The project data to save.
 */
export const saveProject = async (project: Project): Promise<Project> => {
  await sleep(API_LATENCY);
  try {
    const storedProjects = localStorage.getItem(PROJECTS_ARCHIVE_KEY);
    const projects = storedProjects ? (JSON.parse(storedProjects) as Project[]) : [];
    
    const existingIndex = projects.findIndex(p => p.id === project.id);
    
    let newProjects: Project[];
    if (existingIndex > -1) {
      newProjects = [...projects];
      newProjects[existingIndex] = project;
    } else {
      newProjects = [project, ...projects];
    }
    
    localStorage.setItem(PROJECTS_ARCHIVE_KEY, JSON.stringify(newProjects));
    return project;
  } catch (error) {
    console.error(`API Mock Error: Failed to save project ${project.id}`, error);
    throw new Error('Failed to save project');
  }
};

/**
 * Deletes a project from the simulated database.
 * @param projectId The ID of the project to delete.
 */
export const deleteProject = async (projectId: string): Promise<void> => {
  await sleep(API_LATENCY);
  try {
    const storedProjects = localStorage.getItem(PROJECTS_ARCHIVE_KEY);
    const projects = storedProjects ? (JSON.parse(storedProjects) as Project[]) : [];
    const newProjects = projects.filter(p => p.id !== projectId);

    localStorage.setItem(PROJECTS_ARCHIVE_KEY, JSON.stringify(newProjects));
  } catch (error) {
    console.error(`API Mock Error: Failed to delete project ${projectId}`, error);
    throw new Error('Failed to delete project');
  }
};
