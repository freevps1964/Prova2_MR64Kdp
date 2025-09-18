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
    // Generate topic-specific mock data
    const enhancedMockData = generateTopicSpecificMockData(topic);
    return new Promise(resolve => setTimeout(() => resolve(enhancedMockData), 1500));
  }

  try {
    const prompt = `Act as a world-class self-publishing expert, marketing strategist, and Amazon KDP specialist with 10+ years of experience. Conduct comprehensive, highly targeted research on the topic: "${topic}".
    Your goal is to gather information to write a highly profitable, high-conversion book for Amazon KDP.
    All generated content MUST be strictly and directly pertinent to the specific topic "${topic}" and optimized for maximum commercial success.

    CRITICAL REQUIREMENTS:
    1. Use Google Search to find the most authoritative, high-quality sources specifically about "${topic}" (official guides, expert articles, case studies, bestseller analysis).
    2. Generate 10 highly profitable, conversion-optimized book titles that are DIRECTLY related to "${topic}" and follow proven Amazon bestseller patterns.
    3. Create 8 compelling, benefit-driven subtitles that are specifically about "${topic}" and promise clear value and solutions to problems in this exact field.
    4. Research and suggest 15 high-traffic, low-competition keywords that are DIRECTLY related to "${topic}" based on Amazon's search data and trends.
    5. Evaluate each element on commercial potential and relevance (0-100 scale).
    6. MANDATORY: Filter out any sources below 70% relevance (only premium sources).
    7.  Provide all responses in ${language}.
    8. Focus on titles and subtitles that use power words, urgency, and clear benefit statements specifically related to "${topic}".
    9. Ensure keywords are Amazon-optimized and include both broad and long-tail variations specifically about "${topic}".
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

// Generate topic-specific mock data for better relevance
const generateTopicSpecificMockData = (topic: string): ResearchResult => {
  const topicLower = topic.toLowerCase();
  
  // Base template that will be customized based on topic
  let sources, titles, subtitles, keywords;
  
  if (topicLower.includes('cucina') || topicLower.includes('ricette') || topicLower.includes('cooking')) {
    sources = [
      { title: `Guida Completa alla ${topic}: Tecniche e Segreti dei Chef`, uri: "https://example.com/cooking-guide", summary: `Una guida approfondita su ${topic} con tecniche professionali e ricette innovative.`, relevance: 95 },
      { title: `${topic}: Ricette Tradizionali e Moderne`, uri: "https://example.com/recipes", summary: `Raccolta di ricette tradizionali e moderne per ${topic}.`, relevance: 92 },
      { title: `Nutrizione e ${topic}: Mangiare Sano e Gustoso`, uri: "https://example.com/nutrition", summary: `Come combinare ${topic} con principi nutrizionali per una alimentazione equilibrata.`, relevance: 88 }
    ];
    titles = [
      { title: `${topic}: La Guida Definitiva per Diventare un Maestro in Cucina`, relevance: 98 },
      { title: `Segreti di ${topic}: Ricette e Tecniche dei Grandi Chef`, relevance: 95 },
      { title: `${topic} Perfetto: Dal Principiante all'Esperto in 30 Giorni`, relevance: 92 }
    ];
    keywords = [
      { keyword: topic.toLowerCase(), relevance: 100 },
      { keyword: `ricette ${topic.toLowerCase()}`, relevance: 95 },
      { keyword: `come cucinare ${topic.toLowerCase()}`, relevance: 90 }
    ];
  } else if (topicLower.includes('fitness') || topicLower.includes('allenamento') || topicLower.includes('workout')) {
    sources = [
      { title: `Scienza dell'Allenamento per ${topic}`, uri: "https://example.com/fitness-science", summary: `Approccio scientifico all'allenamento per ${topic} basato su ricerche recenti.`, relevance: 96 },
      { title: `${topic}: Programmi di Allenamento Personalizzati`, uri: "https://example.com/workout-programs", summary: `Programmi di allenamento specifici per ${topic} adatti a tutti i livelli.`, relevance: 93 },
      { title: `Nutrizione Sportiva per ${topic}`, uri: "https://example.com/sports-nutrition", summary: `Guida completa alla nutrizione ottimale per chi pratica ${topic}.`, relevance: 89 }
    ];
    titles = [
      { title: `${topic}: Il Sistema Completo per Trasformare il Tuo Corpo`, relevance: 97 },
      { title: `Rivoluzione ${topic}: Risultati Garantiti in 90 Giorni`, relevance: 94 },
      { title: `${topic} Avanzato: Tecniche Segrete dei Professionisti`, relevance: 91 }
    ];
    keywords = [
      { keyword: topic.toLowerCase(), relevance: 100 },
      { keyword: `allenamento ${topic.toLowerCase()}`, relevance: 96 },
      { keyword: `programma ${topic.toLowerCase()}`, relevance: 92 }
    ];
  } else if (topicLower.includes('business') || topicLower.includes('marketing') || topicLower.includes('vendite')) {
    sources = [
      { title: `Strategie Avanzate di ${topic} per il 2024`, uri: "https://example.com/business-strategies", summary: `Le strategie più efficaci di ${topic} utilizzate dalle aziende di successo.`, relevance: 97 },
      { title: `${topic} Digitale: Guida Pratica`, uri: "https://example.com/digital-business", summary: `Come applicare ${topic} nel mondo digitale per massimizzare i risultati.`, relevance: 94 },
      { title: `Case Study di Successo in ${topic}`, uri: "https://example.com/case-studies", summary: `Analisi dettagliata di casi di successo nel campo di ${topic}.`, relevance: 90 }
    ];
    titles = [
      { title: `${topic} Vincente: La Formula Segreta del Successo`, relevance: 98 },
      { title: `Da Zero a Leader: Dominare il ${topic} in 12 Mesi`, relevance: 95 },
      { title: `${topic} 4.0: Strategie Digitali per il Futuro`, relevance: 92 }
    ];
    keywords = [
      { keyword: topic.toLowerCase(), relevance: 100 },
      { keyword: `strategie ${topic.toLowerCase()}`, relevance: 97 },
      { keyword: `corso ${topic.toLowerCase()}`, relevance: 93 }
    ];
  } else {
    // Generic topic-specific content
    sources = [
      { title: `Guida Completa a ${topic}: Tutto Quello che Devi Sapere`, uri: "https://example.com/complete-guide", summary: `Una guida esaustiva su ${topic} che copre tutti gli aspetti fondamentali e avanzati.`, relevance: 94 },
      { title: `${topic}: Tecniche e Strategie Avanzate`, uri: "https://example.com/advanced-techniques", summary: `Tecniche avanzate e strategie professionali per eccellere in ${topic}.`, relevance: 91 },
      { title: `Il Futuro di ${topic}: Tendenze e Innovazioni`, uri: "https://example.com/future-trends", summary: `Analisi delle tendenze future e innovazioni nel campo di ${topic}.`, relevance: 87 }
    ];
    titles = [
      { title: `${topic}: La Guida Definitiva per il Successo`, relevance: 96 },
      { title: `Mastering ${topic}: Dalla Teoria alla Pratica`, relevance: 93 },
      { title: `${topic} Avanzato: Segreti e Strategie dei Professionisti`, relevance: 90 }
    ];
    keywords = [
      { keyword: topic.toLowerCase(), relevance: 100 },
      { keyword: `guida ${topic.toLowerCase()}`, relevance: 95 },
      { keyword: `corso ${topic.toLowerCase()}`, relevance: 90 }
    ];
  }
  
  // Generate topic-specific subtitles
  subtitles = [
    { subtitle: `La guida step-by-step per padroneggiare ${topic} e ottenere risultati straordinari`, relevance: 95 },
    { subtitle: `Strategie comprovate e tecniche avanzate per eccellere in ${topic}`, relevance: 92 },
    { subtitle: `Come trasformare la tua passione per ${topic} in successo concreto`, relevance: 89 }
  ];
  
  return { sources, titles, subtitles, keywords };
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
    const prompt = `Act as an expert book editor and content strategist. Your task is to create a detailed, logical table of contents for a book titled "${title}".
    Base the structure on the following research sources:
    ${sourceSummaries}

    CRITICAL REQUIREMENTS:
    - The structure must be directly related to the book title "${title}" and the research sources provided
    - Create a logical progression that builds knowledge step by step
    - Each chapter should flow naturally into the next
    - Subchapters should be specific and actionable
    
    - Create between 5 and 10 main chapters.
    - Each chapter should have between 2 and 5 subchapters.
    - The chapter and subchapter titles must be in Italian.
    - Ensure the content structure matches what readers would expect from a book titled "${title}"
    
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
        const mockContent = `# ${chapterTitle}

Questo capitolo fornisce una guida completa su "${chapterTitle}", basandosi sulle migliori fonti di ricerca selezionate.

## Introduzione

In questo capitolo esploreremo in dettaglio tutti gli aspetti fondamentali di "${chapterTitle}", fornendo informazioni pratiche e actionable che potrai applicare immediatamente.

## Concetti Fondamentali

I concetti chiave che tratteremo includono:
- Principi base e fondamenti teorici
- Applicazioni pratiche nel mondo reale
- Strategie avanzate per ottimizzare i risultati
- Errori comuni da evitare

## Strategie Pratiche

Basandoci sulle fonti di ricerca selezionate, ecco le strategie più efficaci:

1. **Approccio Sistematico**: Sviluppa un metodo strutturato per affrontare "${chapterTitle}"
2. **Implementazione Graduale**: Applica le tecniche step-by-step per risultati ottimali
3. **Monitoraggio e Ottimizzazione**: Traccia i progressi e ottimizza continuamente

## Esempi Pratici

Esempi concreti di applicazione delle tecniche discusse in questo capitolo, tratti dalle migliori pratiche del settore.

## Conclusioni

Questo capitolo ha fornito una base solida per comprendere e applicare "${chapterTitle}". Nel prossimo capitolo approfondiremo ulteriormente questi concetti.`;
        
        return new Promise(resolve => setTimeout(() => resolve(mockContent), 1000));
    }

    try {
        const sourceInfo = selectedSources.map(s => `- ${s.title}: ${s.summary.substring(0, 150)}...`).join('\n');
        
        const prompt = `Act as an expert author and subject matter expert. Write a comprehensive, detailed book chapter titled "${chapterTitle}".
        Use the following sources as your primary reference material:
        ${sourceInfo}
        
        CRITICAL REQUIREMENTS:
        - The chapter must be directly related to the title "${chapterTitle}"
        - Content must be based on and reference the provided sources
        - Structure the chapter with clear headings and subheadings
        - Include practical examples and actionable advice
        - Write in a professional yet accessible tone
        - Aim for 1500-2000 words
        - Include introduction, main content sections, and conclusion
        - Write the entire chapter in Italian
        - Make it engaging and valuable for readers interested in this specific topic`;

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
            const titleWords = title.split(' ').slice(0, 3).join(' '); // First 3 words for better fit
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
                <text x="256" y="450" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#333" text-anchor="middle" dominant-baseline="middle">${titleWords}</text>
                <text x="60" y="720" font-family="Arial, sans-serif" font-size="12" fill="${colors[i]}" font-weight="bold">eMMeRReKDP</text>
            </svg>`;
        });
        return mockSvgs.map(svg => `data:image/svg+xml;base64,${btoa(svg)}`);
    }

    try {
        const keywordString = keywords.map(k => k.keyword).slice(0, 5).join(', ');
        const prompt = `Create four distinct, professional, and highly marketable book cover designs specifically for a book titled "${title}". 
        The book is about: ${keywordString}.
        The cover designs must be directly related to the book's topic and target audience.

        **CRITICAL DESIGN REQUIREMENTS:**
        Study and emulate the visual patterns of Amazon's current bestselling books in the same category as "${title}".
        
        **MANDATORY DESIGN ELEMENTS:**
        1. **Background Theme:** Create a unique, professional background that specifically relates to "${title}" and matches bestselling book trends
        2. **Visual Hierarchy:** Design clear spaces for title (top 1/3), subtitle (middle), and author name (bottom)
        3. **Color Psychology:** Use colors that trigger purchasing decisions and match the topic of "${title}"
        4. **Professional Quality:** Match the visual quality of top-performing Amazon books in this specific topic area
        5. **Market Differentiation:** Stand out while fitting the conventions of books about "${title}"
        6. **Logo Placement:** Reserve bottom-left corner space for "eMMeRReKDP" logo
        7. **Topic Relevance:** All visual elements must be relevant to "${title}" and its subject matter

        **ABSOLUTE CONSTRAINTS:**
        - DO NOT include any text, titles, or letters in the design
        - Focus on symbolic, conceptual imagery that specifically supports "${title}" and its themes
        - Create designs that work for both print and digital formats
        - Generate four completely different visual concepts
        - Each design must be immediately recognizable as a professional book cover about "${title}"
        - Visual elements should appeal to people interested in "${title}"`;

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