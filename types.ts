import { TABS } from './constants';

export type TabKey = typeof TABS[number];

export interface Source {
  title: string;
  uri: string;
  summary: string;
  relevance: number;
}

export interface TitleSuggestion {
  title: string;
  relevance: number;
}

export interface SubtitleSuggestion {
  subtitle: string;
  relevance: number;
}

export interface Keyword {
  keyword: string;
  relevance: number;
}

export interface ResearchResult {
  sources: Source[];
  titles: TitleSuggestion[];
  subtitles: SubtitleSuggestion[];
  keywords: Keyword[];
}

export interface SearchHistoryItem {
  id: string;
  topic: string;
  timestamp: string;
  results: ResearchResult;
}

export type Language = 'it' | 'en';

export interface SubChapter {
  id: string;
  title: string;
}

export interface Chapter {
  id: string;
  title: string;
  subchapters: SubChapter[];
}

export interface BookStructure {
  chapters: Chapter[];
}

export type LayoutTemplate = 'Classic' | 'Modern' | 'Minimalist';

export interface Project {
  id: string;
  projectTitle: string;
  subtitle: string;
  author: string;
  description: string;
  metadataKeywords: Keyword[];
  categories: string;
  researchData: ResearchResult | null;
  selectedSources: Source[];
  bookStructure: BookStructure | null;
  chapterContents: Record<string, string>;
  lastSaved: string;
  layoutTemplate: LayoutTemplate;
  coverImage: string | null;
  coverOptions: string[];
}