import { GoogleGenAI } from "@google/genai";
import type { ResearchResult, Source, BookStructure, Keyword } from '../types';

// This is a placeholder for a real API key, which should be stored in environment variables.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. Using mock data. Please set the API_KEY environment variable.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const MOCK_RESEARCH_RESULT: ResearchResult = {
  sources: [
    { title: "KDP Jumpstart: The Complete Guide to Self-Publishing on Amazon", uri: "https://example.com/kdp-guide", summary: "An extensive guide covering all aspects of KDP, from manuscript formatting to marketing.", relevance: 95 },
    { title: "Amazon KDP: Guida Completa per Autori Indipendenti", uri: "https://example.com/kdp-guida-italiano", summary: "Una guida dettagliata in italiano per pubblicare con successo su Amazon KDP.", relevance: 92 },
    { title: "Understanding KDP Royalties and Pricing Strategies", uri: "https://example.com/kdp-royalties", summary: "A deep dive into how KDP royalties are calculated and how to price your book effectively.", relevance: 88 },
    { title: "Marketing Your KDP Book: A Beginner's Guide", uri: "https://example.com/kdp-marketing", summary: "Tips and tricks for marketing your self-published book on and off Amazon.", relevance: 75 },
    { title: "Common KDP Formatting Mistakes to Avoid", uri: "https://example.com/kdp-formatting-mistakes", summary: "This article highlights frequent formatting errors that can get your book rejected.", relevance: 65 },
  ],
  titles: [
    { title: "Il Tuo Libro su Amazon: La Guida Definitiva al KDP", relevance: 94 },
    { title: "KDP Power: Da Manoscritto a Bestseller", relevance: 90 },
    { title: "Self-Publishing Vincente: Segreti e Strategie per KDP", relevance: 85 },
  ],
  subtitles: [
    { subtitle: "La guida completa per dominare Amazon e raggiungere il successo.", relevance: 92 },
    { subtitle: "Trasforma la tua passione in profitto con il self-publishing.", relevance: 88 },
    { subtitle: "Strategie pratiche per scrivere, pubblicare e vendere il tuo libro.", relevance: 84 },
  ],
  keywords: [
    { keyword: "amazon kdp", relevance: 98 },
    { keyword: "self publishing", relevance: 95 },
    { keyword: "pubblicare libro online", relevance: 91 },
    { keyword: "guida kdp", relevance: 89 },
    { keyword: "formattazione ebook", relevance: 82 },
  ],
};

export const performResearch = async (topic: string, language: string = 'italian'): Promise<ResearchResult> => {
  if (!ai) {
    console.log("Using mock data for research.");
    return new Promise(resolve => setTimeout(() => resolve(MOCK_RESEARCH_RESULT), 1500));
  }

  try {
    const prompt = `Act as a self-publishing expert and marketing strategist. Conduct extensive research on the topic: "${topic}".
    Your goal is to gather information to write a highly profitable, high-conversion book for Amazon KDP.
    All generated content MUST be strictly and directly pertinent to the requested topic.

    1.  Use Google Search to find highly relevant, authoritative sources (articles, guides, studies).
    2.  Based on the search, suggest highly profitable, high-conversion book titles designed to grab attention and drive sales on Amazon.
    3.  Based on the most relevant keywords, suggest compelling, high-conversion subtitles that clearly communicate the book's value proposition and promise a solution to the reader's problem.
    4.  Based on the search and simulating Amazon's own data, suggest high-traffic, relevant keywords.
    5.  Evaluate the relevance and commercial potential of each source, title, subtitle, and keyword on a scale of 0-100.
    6.  Filter out any sources with a relevance below 60%.
    7.  Provide all responses in ${language}.
    8.  Return ONLY a single valid JSON object that matches this structure, with no other text, markdown, or explanation before or after it:
    {
      "sources": [{ "title": "string", "uri": "string", "summary": "string", "relevance": "number (60-100)" }],
      "titles": [{ "title": "string", "relevance": "number (0-100)" }],
      "subtitles": [{ "subtitle": "string", "relevance": "number (0-100)" }],
      "keywords": [{ "keyword": "string", "relevance": "number (0-100)" }]
    }`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }],
        },
    });
    
    const textContent = response.candidates?.[0]?.content?.parts?.map(p => p.text).join('');

    if (!textContent) {
        throw new Error("API response did not contain any text content.");
    }
    
    let jsonString = textContent.trim();
    if (jsonString.startsWith('```json')) {
        jsonString = jsonString.substring(7, jsonString.length - 3).trim();
    }
    
    const result = JSON.parse(jsonString) as ResearchResult;
    
    // Sort results by relevance
    result.sources.sort((a, b) => b.relevance - a.relevance);
    result.titles.sort((a, b) => b.relevance - a.relevance);
    if (result.subtitles) {
      result.subtitles.sort((a, b) => b.relevance - a.relevance);
    }
    result.keywords.sort((a, b) => b.relevance - a.relevance);

    return result;

  } catch (error) {
    console.error("Error performing research with Gemini API:", error);
    // Fallback to mock data on API error
    return MOCK_RESEARCH_RESULT;
  }
};

export const generateBookStructure = async (title: string, sources: Source[]): Promise<BookStructure> => {
  if (!ai) {
    console.log("Using mock data for book structure.");
    const MOCK_STRUCTURE: BookStructure = {
      chapters: [
        { id: "1", title: "Introduzione al Self-Publishing", subchapters: [
          { id: "1.1", title: "Cos'è KDP" },
          { id: "1.2", title: "Vantaggi e Svantaggi" }
        ]},
        { id: "2", title: "Preparazione del Manoscritto", subchapters: [
          { id: "2.1", title: "Formattazione del Testo" },
          { id: "2.2", title: "Scelta dei Font" }
        ]},
      ]
    };
    return new Promise(resolve => setTimeout(() => resolve(MOCK_STRUCTURE), 1500));
  }
  try {
    const sourceSummaries = sources.map(s => `- ${s.title}: ${s.summary}`).join('\n');
    const prompt = `Act as an expert book editor. Your task is to create a detailed table of contents for a book titled "${title}".
    Base the structure on the following research sources:
    ${sourceSummaries}

    The structure should be logical, comprehensive, and well-organized, with clear chapters and relevant subchapters.
    - Create between 5 and 10 main chapters.
    - Each chapter should have between 2 and 5 subchapters.
    - The chapter and subchapter titles must be in Italian.
    - Return ONLY a single valid JSON object that matches this structure, with no other text, markdown, or explanation:
    {
      "chapters": [
        {
          "title": "string (Chapter 1 Title)",
          "subchapters": [
            { "title": "string (Subchapter 1.1 Title)" },
            { "title": "string (Subchapter 1.2 Title)" }
          ]
        }
      ]
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    
    let jsonString = response.text.trim();
    const parsed = JSON.parse(jsonString) as { chapters: { title: string, subchapters: { title: string }[] }[] };

    // Add unique IDs to the structure
    const structureWithIds: BookStructure = {
        chapters: parsed.chapters.map((chapter, cIndex) => ({
            ...chapter,
            id: `ch-${cIndex + 1}`,
            subchapters: chapter.subchapters.map((subchapter, sIndex) => ({
                ...subchapter,
                id: `ch-${cIndex + 1}-sub-${sIndex + 1}`
            }))
        }))
    };
    
    return structureWithIds;

  } catch (error) {
    console.error("Error generating book structure with Gemini API:", error);
    throw new Error("Failed to generate book structure.");
  }
};

export const generateChapterContent = async (chapterTitle: string, selectedSources: Source[]): Promise<string> => {
    if(!ai) {
        return new Promise(resolve => setTimeout(() => resolve(`Questo è un capitolo di esempio generato per "${chapterTitle}". Il contenuto si baserebbe sulle fonti selezionate per fornire informazioni dettagliate e ben strutturate.`), 1000));
    }

    try {
        const sourceInfo = selectedSources.map(s => `- ${s.title}: ${s.summary.substring(0, 150)}...`).join('\n');
        
        const prompt = `Act as an expert author. Write a detailed book chapter titled "${chapterTitle}".
        Use the following sources as your primary reference material:
        ${sourceInfo}
        
        The chapter should be well-structured, informative, and engaging for the reader.
        Write the chapter in Italian.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating chapter content:", error);
        return "Si è verificato un errore durante la generazione del capitolo.";
    }
};

export const generateCoverImages = async (title: string, keywords: Keyword[]): Promise<string[]> => {
    if (!ai) {
        console.log("Using mock data for cover image.");
        const mockSvgs = Array(3).fill(0).map((_, i) => `<svg width="512" height="768" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#cccccc"/><text x="50%" y="50%" font-family="sans-serif" font-size="24" fill="black" text-anchor="middle" dominant-baseline="middle" style="white-space: pre-wrap;">Copertina ${i+1} per "${title}"</text></svg>`);
        return mockSvgs.map(svg => `data:image/svg+xml;base64,${btoa(svg)}`);
    }

    try {
        const keywordString = keywords.map(k => k.keyword).slice(0, 5).join(', ');
        const prompt = `Create three distinct, professional, and highly marketable book cover designs for a book titled "${title}". The main themes and keywords are: ${keywordString}.

        **Crucial Guideline:** Analyze the current design trends of best-selling books on Amazon, which can be seen at this link: https://www.amazon.com/gp/bestsellers/books/
        
        Your generated covers must emulate the quality and style of these best-sellers. Pay close attention to:
        - **Visual Impact:** Create a strong, memorable focal point.
        - **Color Palette:** Use color schemes that are common in the target genre and evoke the right emotion.
        - **Typography:** While you should not add the title text yourself, the overall design should leave clear, professional space for typography to be added later. The design should feel complete even without text.
        - **Marketability:** The designs must look professional and stand out in a crowded marketplace like Amazon KDP.

        **Strict Constraints:**
        - **DO NOT add any text** or letters to the image.
        - The design should be symbolic, conceptual, and focus on powerful, central imagery.
        - Generate three different concepts.`;

        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 3,
              outputMimeType: 'image/jpeg',
              aspectRatio: '3:4',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
        } else {
            throw new Error("No image was generated.");
        }

    } catch (error) {
        console.error("Error generating cover image with Gemini API:", error);
        throw new Error("Failed to generate cover image.");
    }
};