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
    // Enhanced mock data with better relevance and more sources
    const enhancedMockData: ResearchResult = {
      sources: [
        { title: "Amazon KDP Complete Publishing Guide 2024", uri: "https://kdp.amazon.com/en_US/help", summary: "Official Amazon KDP comprehensive guide covering all aspects of self-publishing, from manuscript preparation to marketing strategies.", relevance: 98 },
        { title: "Self-Publishing Success: KDP Mastery Course", uri: "https://example.com/kdp-mastery", summary: "Advanced strategies for maximizing KDP success, including keyword optimization and cover design best practices.", relevance: 95 },
        { title: "KDP Royalty Calculator and Pricing Strategies", uri: "https://example.com/kdp-royalties-advanced", summary: "In-depth analysis of KDP royalty structures and optimal pricing strategies for maximum profitability.", relevance: 92 },
        { title: "Amazon Algorithm Optimization for KDP Authors", uri: "https://example.com/amazon-algorithm-kdp", summary: "How to optimize your book listings to rank higher in Amazon's search results and increase visibility.", relevance: 89 },
        { title: "KDP Marketing Blueprint: From Zero to Bestseller", uri: "https://example.com/kdp-marketing-blueprint", summary: "Comprehensive marketing strategies specifically designed for KDP authors to achieve bestseller status.", relevance: 86 },
        { title: "Professional Book Formatting for KDP Success", uri: "https://example.com/kdp-formatting-pro", summary: "Advanced formatting techniques that ensure your book meets KDP standards and looks professional.", relevance: 83 },
        { title: "KDP Category Selection and Keyword Research", uri: "https://example.com/kdp-categories-keywords", summary: "Strategic guide to selecting the most profitable categories and high-converting keywords for KDP.", relevance: 80 },
        { title: "Cover Design Psychology for KDP Books", uri: "https://example.com/kdp-cover-psychology", summary: "Understanding the psychological principles behind effective book cover design for maximum sales conversion.", relevance: 77 },
        { title: "KDP Analytics and Performance Tracking", uri: "https://example.com/kdp-analytics", summary: "How to use KDP analytics to optimize your book's performance and increase sales over time.", relevance: 74 },
        { title: "International KDP Markets and Expansion", uri: "https://example.com/kdp-international", summary: "Strategies for expanding your KDP books to international markets and maximizing global reach.", relevance: 71 }
      ],
      titles: [
        { title: "KDP Mastery 2024: La Guida Definitiva per Dominare Amazon e Generare Profitti Passivi", relevance: 98 },
        { title: "Da Zero a Bestseller: Il Sistema Completo per il Successo su Amazon KDP", relevance: 96 },
        { title: "Self-Publishing Milionario: Come Creare un Impero Editoriale su KDP", relevance: 94 },
        { title: "Amazon KDP Secrets: Strategie Avanzate per Autori di Successo", relevance: 92 },
        { title: "Il Metodo KDP: Trasforma la Tua Passione in Profitto Garantito", relevance: 90 },
        { title: "KDP Power System: La Formula Segreta dei Top Seller Amazon", relevance: 88 },
        { title: "Pubblicare e Vendere su Amazon: La Guida Pratica al KDP", relevance: 86 },
        { title: "Self-Publishing Vincente: Dalla Scrittura al Successo Commerciale", relevance: 84 },
        { title: "Amazon KDP Blueprint: Il Piano d'Azione per il Successo", relevance: 82 },
        { title: "KDP Revolution: Come Rivoluzionare la Tua Carriera di Autore", relevance: 80 }
      ],
      subtitles: [
        { subtitle: "La guida step-by-step per trasformare le tue idee in bestseller Amazon e generare rendite passive", relevance: 96 },
        { subtitle: "Strategie comprovate, segreti degli esperti e tecniche avanzate per dominare il mercato KDP", relevance: 94 },
        { subtitle: "Come creare, pubblicare e vendere libri di successo anche senza esperienza precedente", relevance: 92 },
        { subtitle: "Il sistema completo per massimizzare i profitti e raggiungere la libertà finanziaria", relevance: 90 },
        { subtitle: "Dalla ricerca delle nicchie profittevoli alla creazione di un business editoriale automatizzato", relevance: 88 },
        { subtitle: "Tecniche segrete per ottimizzare ranking, aumentare le vendite e battere la concorrenza", relevance: 86 },
        { subtitle: "La formula testata per creare libri ad alta conversione che vendono automaticamente", relevance: 84 },
        { subtitle: "Come sfruttare l'intelligenza artificiale e gli strumenti avanzati per il successo KDP", relevance: 82 }
      ],
      keywords: [
        { keyword: "amazon kdp", relevance: 100 },
        { keyword: "self publishing", relevance: 98 },
        { keyword: "pubblicare libro amazon", relevance: 96 },
        { keyword: "kdp guida completa", relevance: 94 },
        { keyword: "bestseller amazon", relevance: 92 },
        { keyword: "self publishing italia", relevance: 90 },
        { keyword: "come pubblicare libro", relevance: 88 },
        { keyword: "kdp marketing", relevance: 86 },
        { keyword: "amazon book publishing", relevance: 84 },
        { keyword: "kdp royalties", relevance: 82 },
        { keyword: "libro digitale amazon", relevance: 80 },
        { keyword: "kdp formatting", relevance: 78 },
        { keyword: "amazon author", relevance: 76 },
        { keyword: "kdp cover design", relevance: 74 },
        { keyword: "passive income books", relevance: 72 }
      ]
    };
    return new Promise(resolve => setTimeout(() => resolve(enhancedMockData), 1500));
  }

  try {
    const prompt = `Act as a world-class self-publishing expert, marketing strategist, and Amazon KDP specialist with 10+ years of experience. Conduct comprehensive, highly targeted research on the topic: "${topic}".
    Your goal is to gather information to write a highly profitable, high-conversion book for Amazon KDP.
    All generated content MUST be strictly and directly pertinent to the requested topic and optimized for maximum commercial success.

    CRITICAL REQUIREMENTS:
    1. Use Google Search to find the most authoritative, high-quality sources (official guides, expert articles, case studies, bestseller analysis).
    2. Generate 10 highly profitable, conversion-optimized book titles that follow proven Amazon bestseller patterns and psychological triggers.
    3. Create 8 compelling, benefit-driven subtitles that promise clear value and solutions to specific problems.
    4. Research and suggest 15 high-traffic, low-competition keywords based on Amazon's search data and trends.
    5. Evaluate each element on commercial potential and relevance (0-100 scale).
    6. MANDATORY: Filter out any sources below 70% relevance (only premium sources).
    7.  Provide all responses in ${language}.
    8. Focus on titles and subtitles that use power words, urgency, and clear benefit statements.
    9. Ensure keywords are Amazon-optimized and include both broad and long-tail variations.
    10. Return ONLY a single valid JSON object that matches this structure, with no other text, markdown, or explanation before or after it:
    {
      "sources": [{ "title": "string", "uri": "string", "summary": "string", "relevance": "number (70-100)" }],
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
        const mockSvgs = Array(4).fill(0).map((_, i) => {
            const colors = ['#1E40AF', '#DC2626', '#059669', '#7C3AED'];
            const bgColors = ['#F8FAFC', '#FEF2F2', '#F0FDF4', '#FAF5FF'];
            return `<svg width="512" height="768" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad${i}" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:${colors[i]};stop-opacity:1" />
                        <stop offset="100%" style="stop-color:${bgColors[i]};stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#grad${i})"/>
                <rect x="40" y="60" width="432" height="200" fill="rgba(255,255,255,0.9)" rx="10"/>
                <text x="256" y="140" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="${colors[i]}" text-anchor="middle" dominant-baseline="middle">BESTSELLER</text>
                <text x="256" y="180" font-family="Arial, sans-serif" font-size="16" fill="${colors[i]}" text-anchor="middle" dominant-baseline="middle">Design ${i+1}</text>
                <rect x="40" y="300" width="432" height="300" fill="rgba(255,255,255,0.8)" rx="10"/>
                <text x="256" y="450" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#333" text-anchor="middle" dominant-baseline="middle" style="white-space: pre-wrap;">${title.substring(0, 40)}...</text>
                <text x="60" y="720" font-family="Arial, sans-serif" font-size="12" fill="${colors[i]}" font-weight="bold">eMMeRReKDP</text>
            </svg>`;
        });
        return mockSvgs.map(svg => `data:image/svg+xml;base64,${btoa(svg)}`);
    }

    try {
        const keywordString = keywords.map(k => k.keyword).slice(0, 5).join(', ');
        const prompt = `Create four distinct, professional, and highly marketable book cover designs for a book titled "${title}". The main themes and keywords are: ${keywordString}.

        **CRITICAL DESIGN REQUIREMENTS:**
        Study and emulate the visual patterns of Amazon's current bestselling books: https://www.amazon.com/gp/bestsellers/books/
        
        **MANDATORY DESIGN ELEMENTS:**
        1. **Background Theme:** Create a unique, professional background that matches bestselling book trends in the relevant category
        2. **Visual Hierarchy:** Design clear spaces for title (top 1/3), subtitle (middle), and author name (bottom)
        3. **Color Psychology:** Use colors that trigger purchasing decisions and genre expectations
        4. **Professional Quality:** Match the visual quality of top-performing Amazon books
        5. **Market Differentiation:** Stand out while fitting genre conventions
        6. **Logo Placement:** Reserve bottom-left corner space for "eMMeRReKDP" logo

        **ABSOLUTE CONSTRAINTS:**
        - DO NOT include any text, titles, or letters in the design
        - Focus on symbolic, conceptual imagery that supports the book's theme
        - Create designs that work for both print and digital formats
        - Generate four completely different visual concepts
        - Each design must be immediately recognizable as a professional book cover`;

        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 4,
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