import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client to prevent crashing on boot if key is missing
let aiInstance: GoogleGenAI | null = null;

function getGeminiAI(): GoogleGenAI {
  if (!aiInstance) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// 1. Book outline & plot builder endpoint
app.post("/api/author/outline", async (req, res) => {
  try {
    const { title, genre, targetAudience, description } = req.body;
    if (!title || !genre || !description) {
      return res.status(400).json({ error: "Missing required fields: title, genre, description" });
    }

    const ai = getGeminiAI();
    const prompt = `You are a legendary master editor and plot strategist. Generate a structured book outline and plot breakdown for:
    Title: "${title}"
    Genre: "${genre}"
    Target Audience: "${targetAudience || 'General readers'}"
    Core Description: "${description}"

    Provide a professional publishing report with:
    1. A detailed narrative premise and plot structure.
    2. Character sheets for the major protagonist, antagonist, and primary supporting characters.
    3. A 5-chapter planner containing estimated chapter titles and thematic summaries for each chapter.

    Return the result strictly as a clean JSON object with these exact keys:
    "premise": "A comprehensive plot summary and dramatic hook paragraph.",
    "chapters": [
       {"title": "Chapter 1: ...", "summary": "Detailed narrative summary of what happens, conflict introduced, and resolution."},
       {"title": "Chapter 2: ...", "summary": "..."},
       ...
    ],
    "characters": [
       {"name": "Protagonist Name", "role": "protagonist", "description": "Brief description", "traits": "Adjectives", "backstory": "Backstory details"},
       {"name": "Antagonist Name", "role": "antagonist", "description": "...", "traits": "...", "backstory": "..."},
       {"name": "Supporting Name", "role": "supporting", "description": "...", "traits": "...", "backstory": "..."}
    ]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            premise: { type: Type.STRING },
            chapters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING }
                },
                required: ["title", "summary"]
              }
            },
            characters: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  role: { type: Type.STRING },
                  description: { type: Type.STRING },
                  traits: { type: Type.STRING },
                  backstory: { type: Type.STRING }
                },
                required: ["name", "role", "description", "traits", "backstory"]
              }
            }
          },
          required: ["premise", "chapters", "characters"]
        }
      }
    });

    res.json(JSON.parse(response.text?.trim() || "{}"));
  } catch (error: any) {
    console.error("Error in /api/author/outline:", error);
    res.status(500).json({ error: error.message || "Failed to generate book outline" });
  }
});

// 2. AI Chapter Writing Assistant
app.post("/api/author/write-chapter", async (req, res) => {
  try {
    const { title, genre, bookPremise, chapterTitle, chapterSummary, promptGuideline, currentDraft } = req.body;
    if (!title || !chapterTitle || !chapterSummary) {
      return res.status(400).json({ error: "Missing required chapter fields" });
    }

    const ai = getGeminiAI();
    const prompt = `You are an award-winning novelist. Write or expand the manuscript text for:
    Book Title: "${title}"
    Book Genre: "${genre}"
    Book Premise: "${bookPremise || 'N/A'}"
    Active Chapter: "${chapterTitle}"
    Chapter Goal Summary: "${chapterSummary}"
    User Writing Prompt Guidelines: "${promptGuideline || 'Draft the full chapter with immersive narrative, rich sensory details, realistic dialogues, and elegant word choice.'}"
    ${currentDraft ? `Current Draft text to revise/expand:\n"""\n${currentDraft}\n"""` : ''}

    Generate a highly polished, complete novel chapter text (approx 500-800 words).
    Keep the tone deep, artistic, well-paced, and immersive. Use paragraph separations clearly.
    Return ONLY the final prose chapter manuscript. Do not add intro/outro metadata or comments.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt
    });

    res.json({ manuscript: response.text?.trim() });
  } catch (error: any) {
    console.error("Error in /api/author/write-chapter:", error);
    res.status(500).json({ error: error.message || "Failed to write chapter text" });
  }
});

// 3. Fairy Tale & Children's Books Creator
app.post("/api/author/children-story", async (req, res) => {
  try {
    const { moralLesson, ageGroup, theme, heroType } = req.body;
    if (!moralLesson || !theme) {
      return res.status(400).json({ error: "Moral lesson and theme are required." });
    }

    const ai = getGeminiAI();
    const prompt = `Generate a captivating children's book package.
    Theme: "${theme}"
    Protagonist/Hero: "${heroType || 'A whimsical animal'}"
    Moral Lesson to teach: "${moralLesson}"
    Target Age Group: "${ageGroup || '4-8 years'}"

    Please generate:
    1. A beautiful children's story (around 4-6 colorful illustrated-page scenes or segments).
    2. A Character profile.
    3. An Educator/Lesson Planner containing 2 learning activities.
    4. A Parent Discussion Guide with 3 thought-provoking questions to ask during bedtime reading.

    Return the result strictly as a JSON object with these exact keys:
    "title": "Story Book Title",
    "characterName": "Name of the main character",
    "characterDescription": "Character visual details & personality",
    "storyPages": [
      {"pageNumber": 1, "narration": "Narration text...", "illustrationIdea": "Visual details description for illustrator/AI image generator"}
    ],
    "lessonPlan": "Lesson planner guidelines and activities.",
    "discussionGuide": "Bedtime discussion questions for parents."`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            characterName: { type: Type.STRING },
            characterDescription: { type: Type.STRING },
            storyPages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  pageNumber: { type: Type.INTEGER },
                  narration: { type: Type.STRING },
                  illustrationIdea: { type: Type.STRING }
                },
                required: ["pageNumber", "narration", "illustrationIdea"]
              }
            },
            lessonPlan: { type: Type.STRING },
            discussionGuide: { type: Type.STRING }
          },
          required: ["title", "characterName", "characterDescription", "storyPages", "lessonPlan", "discussionGuide"]
        }
      }
    });

    res.json(JSON.parse(response.text?.trim() || "{}"));
  } catch (error: any) {
    console.error("Error in /api/author/children-story:", error);
    res.status(500).json({ error: error.message || "Failed to generate children story package" });
  }
});

// 4. Christian Publishing Devotionals & Sermon Outlines
app.post("/api/author/christian-devotional", async (req, res) => {
  try {
    const { format, scriptureTopic, biblicalReference, focusAudience } = req.body;
    if (!scriptureTopic) {
      return res.status(400).json({ error: "Scripture topic or passage is required." });
    }

    const ai = getGeminiAI();
    const prompt = `You are a theological scholar and devotional writer. Build a Christian publication:
    Format requested: "${format || 'Devotional Day'}" (Options: Devotional, Sermon Outline, Scripture Study Guide, Prayer Journal prompt)
    Thematic Topic: "${scriptureTopic}"
    Biblical Reference / Scripture Verses: "${biblicalReference || 'Choose suitable powerful scriptures'}"
    Target Focus Audience: "${focusAudience || 'Christian believers'}"

    Generate:
    1. A beautiful, heartfelt, grace-centered devotional or sermon structure.
    2. Deep Scripture breakdowns.
    3. Practical life reflections.
    4. A heartfelt, printed-page prayer prompt or journal action list.

    Return the result strictly as a JSON object with these exact keys:
    "title": "A grand, inspiring title",
    "scriptureText": "The primary Bible verses cited (ESV, NIV or NASB style)",
    "devotionalBody": "A 3-paragraph inspiring reflection and theology exposition",
    "reflectionQuestions": "3 journal questions or sermon application action items",
    "prayer": "A beautifully worded concluding prayer"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            scriptureText: { type: Type.STRING },
            devotionalBody: { type: Type.STRING },
            reflectionQuestions: { type: Type.STRING },
            prayer: { type: Type.STRING }
          },
          required: ["title", "scriptureText", "devotionalBody", "reflectionQuestions", "prayer"]
        }
      }
    });

    res.json(JSON.parse(response.text?.trim() || "{}"));
  } catch (error: any) {
    console.error("Error in /api/author/christian-devotional:", error);
    res.status(500).json({ error: error.message || "Failed to generate Christian devotional" });
  }
});

// 5. KDP Formatting & ISBN Guidance Generator
app.post("/api/author/publish-helper", async (req, res) => {
  try {
    const { title, genre, format, pageCount } = req.body;
    if (!title || !genre) {
      return res.status(400).json({ error: "Book title and genre are required." });
    }

    const ai = getGeminiAI();
    const prompt = `You are an Amazon KDP self-publishing layout engineer and metadata strategist. Generate publishing guides for:
    Book Title: "${title}"
    Genre: "${genre}"
    Format target: "${format || 'Paperback (6x9 inches)'}"
    Estimated Page Count: "${pageCount || '200'}"

    Generate:
    1. KDP Interior layout rules (margins, gutters, trim sizes, bleeds, page layouts, fonts).
    2. ISBN and copyright registration guidance.
    3. High-converting Amazon categories (3 recommended pathways).
    4. Highly targeted backend search Keywords (7 optimal phrase ideas).
    5. A beautiful, structured book blurb/metadata description suitable for KDP listing.

    Return the result strictly as a JSON object with these exact keys:
    "interiorSpecifications": "Detailed margin, bleed, gutter, trim size, and layout suggestions.",
    "isbnGuidance": "Chronological instructions on acquiring/using free vs paid ISBNs & barcode placement.",
    "metadataBlurb": "A compelling, high-converting HTML book description for Amazon KDP.",
    "categories": ["Category Path 1", "Category Path 2", "Category Path 3"],
    "keywords": ["Keyword phrase 1", "Keyword phrase 2", "Keyword phrase 3", "Keyword phrase 4", "Keyword phrase 5", "Keyword phrase 6", "Keyword phrase 7"]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            interiorSpecifications: { type: Type.STRING },
            isbnGuidance: { type: Type.STRING },
            metadataBlurb: { type: Type.STRING },
            categories: { type: Type.ARRAY, items: { type: Type.STRING } },
            keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["interiorSpecifications", "isbnGuidance", "metadataBlurb", "categories", "keywords"]
        }
      }
    });

    res.json(JSON.parse(response.text?.trim() || "{}"));
  } catch (error: any) {
    console.error("Error in /api/author/publish-helper:", error);
    res.status(500).json({ error: error.message || "Failed to generate KDP formatting advice" });
  }
});

// 6. Launch Campaigns & Marketing Herald
app.post("/api/author/marketing-suite", async (req, res) => {
  try {
    const { title, genre, authorBioGoal, targetReleaseDate } = req.body;
    if (!title || !genre) {
      return res.status(400).json({ error: "Book title and genre are required." });
    }

    const ai = getGeminiAI();
    const prompt = `You are a high-end book publicity manager. Formulate a comprehensive launch kit and marketing plan for:
    Book Title: "${title}"
    Genre: "${genre}"
    Ruler/Author Bio Prompt: "${authorBioGoal || 'Writers seeking world-class publishing status.'}"
    Release Date: "${targetReleaseDate || 'Next quarter'}"

    Generate:
    1. A premium, engaging 200-word author bio.
    2. A grand Book Launch press release draft.
    3. A 4-phase launch calendar (Pre-order, Launch Week, Post-launch blitz).
    4. 3 sample social media campaign post copies (Twitter, Instagram/Facebook, LinkedIn/Newsletter).

    Return the result strictly as a JSON object with these exact keys:
    "authorBio": "The professional crafted author bio.",
    "pressRelease": "The ready-to-publish media press release.",
    "launchCalendar": "Phase-by-phase action calendar points for launch success.",
    "socialPosts": [
      {"channel": "Twitter / Threads", "text": "Draft post copy with hashtags..."},
      {"channel": "Instagram / Visual", "text": "Draft post copy with aesthetic description..."},
      {"channel": "Newsletter / LinkedIn", "text": "Deep narrative post copy..."}
    ]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            authorBio: { type: Type.STRING },
            pressRelease: { type: Type.STRING },
            launchCalendar: { type: Type.STRING },
            socialPosts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  channel: { type: Type.STRING },
                  text: { type: Type.STRING }
                },
                required: ["channel", "text"]
              }
            }
          },
          required: ["authorBio", "pressRelease", "launchCalendar", "socialPosts"]
        }
      }
    });

    res.json(JSON.parse(response.text?.trim() || "{}"));
  } catch (error: any) {
    console.error("Error in /api/author/marketing-suite:", error);
    res.status(500).json({ error: error.message || "Failed to generate marketing suite assets" });
  }
});

// 7. Course & Content Studio Creator
app.post("/api/author/content-studio", async (req, res) => {
  try {
    const { contentType, title, audience, topics } = req.body;
    if (!title || !contentType) {
      return res.status(400).json({ error: "Content type and title are required." });
    }

    const ai = getGeminiAI();
    const prompt = `You are an elite educational instructional designer. Create a premium content studio asset:
    Content Type: "${contentType}" (Options: Course Syllabus, Educational Worksheet, PDF Planner Template, Journal Guide, Workbook Blueprint)
    Asset Title: "${title}"
    Target Student/Audience: "${audience || 'Eager learners'}"
    Focal Topics list: "${topics || 'Essential concepts and master practices'}"

    Provide a highly detailed structural draft:
    1. Core overview, goals, and learning objectives.
    2. A structured modular roadmap containing 3 Modules, each with 2 Lesson topics.
    3. Practical printable exercise/worksheet content.

    Return the result strictly as a JSON object with these exact keys:
    "introduction": "Introductory scope, objectives, and targeted audience profile.",
    "syllabus": [
       {"moduleTitle": "Module 1: ...", "lessons": ["Lesson 1: ...", "Lesson 2: ..."]},
       {"moduleTitle": "Module 2: ...", "lessons": ["Lesson 1: ...", "Lesson 2: ..."]},
       {"moduleTitle": "Module 3: ...", "lessons": ["Lesson 1: ...", "Lesson 2: ..."]}
    ],
    "exercises": "Practical written exercises, workbook prompts, or study worksheets."`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            introduction: { type: Type.STRING },
            syllabus: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  moduleTitle: { type: Type.STRING },
                  lessons: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["moduleTitle", "lessons"]
              }
            },
            exercises: { type: Type.STRING }
          },
          required: ["introduction", "syllabus", "exercises"]
        }
      }
    });

    res.json(JSON.parse(response.text?.trim() || "{}"));
  } catch (error: any) {
    console.error("Error in /api/author/content-studio:", error);
    res.status(500).json({ error: error.message || "Failed to generate course or content guidelines" });
  }
});

// 8. AI Creative Studio (Branding, Slides, Graphics Planner, AI Image prompt generation)
app.post("/api/author/creative-studio", async (req, res) => {
  try {
    const { title, projectType, mood, brandElements } = req.body;
    if (!title || !projectType) {
      return res.status(400).json({ error: "Project type and title are required." });
    }

    const ai = getGeminiAI();
    const prompt = `You are a creative art director and branding architect. Generate a creative visual guide for:
    Project Title: "${title}"
    Type: "${projectType}" (Options: Presentation Slides, Graphics/Cover Planner, Brand Style Guide, Coloring Book Ideas)
    Visual Mood: "${mood || 'Noble, cinematic, royal, parchment-style'}"
    Existing Brand Elements: "${brandElements || 'N/A'}"

    Generate:
    1. A complete color palette proposal (Hex colors and symbolism).
    2. 3 Slides or visual blocks structure list.
    3. Detailed AI Text-to-Image Generation Prompt guidelines (to generate cover arts or internal illustration assets).

    Return the result strictly as a JSON object with these exact keys:
    "colorsProposal": "Color palette specifications, typography recommendations, and mood description.",
    "visualLayouts": "A structured breakdown of slides or graphics layers.",
    "imageGenerationPrompt": "A highly descriptive, production-ready text prompt to insert into midjourney or imagen for cover illustrations."`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            colorsProposal: { type: Type.STRING },
            visualLayouts: { type: Type.STRING },
            imageGenerationPrompt: { type: Type.STRING }
          },
          required: ["colorsProposal", "visualLayouts", "imageGenerationPrompt"]
        }
      }
    });

    res.json(JSON.parse(response.text?.trim() || "{}"));
  } catch (error: any) {
    console.error("Error in /api/author/creative-studio:", error);
    res.status(500).json({ error: error.message || "Failed to generate creative studio specifications" });
  }
});


// Serve static frontend assets and index SPA fallback
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Kingdom Author Studio Server running on http://localhost:${PORT}`);
  });
}

startServer();
