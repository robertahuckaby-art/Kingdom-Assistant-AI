import React, { useState } from 'react';
import { Book, Chapter, Character } from '../types';
import { 
  PenTool, Sparkles, BookOpen, Layers, Users, RefreshCw, Send, Save, 
  HelpCircle, ChevronRight, FileText, Check, Loader2, AlertCircle
} from 'lucide-react';

interface ScriptoriumProps {
  books: Book[];
  chapters: Chapter[];
  characters: Character[];
  onAddBook: (book: Book) => void;
  onAddChapter: (chapter: Chapter) => void;
  onAddCharacter: (char: Character) => void;
  onUpdateChapterSummary: (chapterId: string, summary: string) => void;
}

export default function Scriptorium({
  books,
  chapters,
  characters,
  onAddBook,
  onAddChapter,
  onAddCharacter,
  onUpdateChapterSummary
}: ScriptoriumProps) {
  const [selectedBookId, setSelectedBookId] = useState<string>(books[0]?.id || '');
  const [selectedChapterId, setSelectedChapterId] = useState<string>('');
  
  // Plot generation states
  const [outlineTitle, setOutlineTitle] = useState('');
  const [outlineGenre, setOutlineGenre] = useState('Fantasy');
  const [outlineAudience, setOutlineAudience] = useState('Adult Readers');
  const [outlineDesc, setOutlineDesc] = useState('');
  const [isGeneratingOutline, setIsGeneratingOutline] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Chapter editor states
  const [editorGuidelines, setEditorGuidelines] = useState('');
  const [manuscriptText, setManuscriptText] = useState('');
  const [isWritingChapter, setIsWritingChapter] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Character registry states
  const [charName, setCharName] = useState('');
  const [charRole, setCharRole] = useState('protagonist');
  const [charDesc, setCharDesc] = useState('');
  const [charTraits, setCharTraits] = useState('');
  const [charBackstory, setCharBackstory] = useState('');

  const currentBook = books.find(b => b.id === selectedBookId);
  const currentChapter = chapters.find(c => c.id === selectedChapterId);
  const bookChapters = chapters.filter(c => c.bookId === selectedBookId).sort((a,b) => a.order - b.order);
  const bookCharacters = characters.filter(c => c.bookId === selectedBookId);

  // Call API for outline generator
  const handleGenerateOutline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!outlineTitle || !outlineDesc) {
      setErrorMessage("Please enter a book title and description.");
      return;
    }
    setErrorMessage("");
    setIsGeneratingOutline(true);

    try {
      const response = await fetch('/api/author/outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: outlineTitle,
          genre: outlineGenre,
          targetAudience: outlineAudience,
          description: outlineDesc
        })
      });

      if (!response.ok) {
        throw new Error("Failed to contact the Imperial Scribes. Check your API key.");
      }

      const data = await response.json();
      
      // Successfully generated. Let's create the book and save to state
      const createdBook: Book = {
        id: 'book_' + Date.now(),
        title: outlineTitle,
        genre: outlineGenre,
        targetAudience: outlineAudience,
        description: data.premise || outlineDesc,
        createdAt: new Date().toLocaleDateString()
      };

      onAddBook(createdBook);
      setSelectedBookId(createdBook.id);

      // Create chapters
      if (data.chapters && Array.isArray(data.chapters)) {
        data.chapters.forEach((ch: any, idx: number) => {
          onAddChapter({
            id: `chapter_${Date.now()}_${idx}`,
            bookId: createdBook.id,
            title: ch.title || `Chapter ${idx + 1}`,
            summary: ch.summary || 'Summary placeholder',
            order: idx + 1
          });
        });
      }

      // Create characters
      if (data.characters && Array.isArray(data.characters)) {
        data.characters.forEach((char: any, idx: number) => {
          onAddCharacter({
            id: `char_${Date.now()}_${idx}`,
            bookId: createdBook.id,
            name: char.name || `Hero ${idx + 1}`,
            role: char.role || 'protagonist',
            description: char.description || '',
            traits: char.traits || '',
            backstory: char.backstory || ''
          });
        });
      }

      // Clear fields
      setOutlineTitle('');
      setOutlineDesc('');
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during transcription.");
    } finally {
      setIsGeneratingOutline(false);
    }
  };

  // Call API for manuscript generator
  const handleAIGenerateChapter = async () => {
    if (!currentBook || !currentChapter) {
      setErrorMessage("Please select a book and chapter first.");
      return;
    }
    setErrorMessage("");
    setIsWritingChapter(true);

    try {
      const response = await fetch('/api/author/write-chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: currentBook.title,
          genre: currentBook.genre,
          bookPremise: currentBook.description,
          chapterTitle: currentChapter.title,
          chapterSummary: currentChapter.summary,
          promptGuideline: editorGuidelines,
          currentDraft: manuscriptText
        })
      });

      if (!response.ok) {
        throw new Error("The writing assistant was unable to finalize the text.");
      }

      const data = await response.json();
      if (data.manuscript) {
        setManuscriptText(data.manuscript);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred during creative synthesis.");
    } finally {
      setIsWritingChapter(false);
    }
  };

  const handleSaveManuscript = () => {
    if (!selectedChapterId) return;
    onUpdateChapterSummary(selectedChapterId, currentChapter ? currentChapter.summary : '');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleManualAddCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!charName.trim() || !selectedBookId) return;
    onAddCharacter({
      id: 'char_' + Date.now(),
      bookId: selectedBookId,
      name: charName,
      role: charRole,
      description: charDesc,
      traits: charTraits,
      backstory: charBackstory
    });
    setCharName('');
    setCharDesc('');
    setCharTraits('');
    setCharBackstory('');
  };

  return (
    <div className="space-y-6">
      {/* Scriptorium Title */}
      <div className="flex items-center justify-between border-b border-amber-900/20 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-wide text-amber-100 flex items-center gap-2">
            <PenTool className="h-6 w-6 text-amber-500 animate-pulse" />
            AI Scriptorium & Epic Writing Suite
          </h2>
          <p className="text-xs text-amber-200/60 mt-0.5">
            Architect novel structures via Gemini, summon comprehensive character casts, and generate full chapter drafts using advanced typewriter synthesis.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-950/20 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-center gap-2 font-serif">
          <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid of Outline Builder & Active Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Outline Architect (Lanes 4 / 12) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Section A: AI Outline Catalyst */}
          <div className="p-5 bg-amber-950/10 border border-amber-500/20 rounded-xl space-y-4">
            <h3 className="font-serif text-sm font-bold text-amber-300 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Kingdom Novel Catalyst
            </h3>
            <p className="text-[11px] text-amber-200/50 leading-relaxed">
              Define your story concept, and our AI strategists will forge a rich premise, an expansive chapter plan, and primary character dossiers.
            </p>

            <form onSubmit={handleGenerateOutline} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-amber-400">Novel Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Throne of Sacred Oak"
                  value={outlineTitle}
                  onChange={(e) => setOutlineTitle(e.target.value)}
                  className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-amber-400">Genre</label>
                  <select
                    value={outlineGenre}
                    onChange={(e) => setOutlineGenre(e.target.value)}
                    className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="Epic Fantasy">Epic Fantasy</option>
                    <option value="Sci-Fi Space Opera">Sci-Fi Space Opera</option>
                    <option value="Historical Mystery">Historical Mystery</option>
                    <option value="Theological Devotional">Devotional Booklet</option>
                    <option value="Creative Non-Fiction">Creative Non-Fiction</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-amber-400">Target Audience</label>
                  <input
                    type="text"
                    placeholder="e.g. Young Adults, Laymen"
                    value={outlineAudience}
                    onChange={(e) => setOutlineAudience(e.target.value)}
                    className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-amber-400">Core Narrative description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your protagonist's central conflict or core workbook focus..."
                  value={outlineDesc}
                  onChange={(e) => setOutlineDesc(e.target.value)}
                  className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none focus:border-amber-500/50 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={isGeneratingOutline}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-serif font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isGeneratingOutline ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Forging Narrative Arc...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    Forge Epic Outline
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Section B: Manual Character Builder */}
          {selectedBookId && (
            <div className="p-5 bg-amber-950/10 border border-amber-500/20 rounded-xl space-y-4">
              <h3 className="font-serif text-sm font-bold text-amber-300 flex items-center gap-1.5">
                <Users className="h-4 w-4 text-amber-500" />
                Character Summoner
              </h3>
              
              <form onSubmit={handleManualAddCharacter} className="space-y-2 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase text-amber-400">Character Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lady Genevieve"
                      value={charName}
                      onChange={(e) => setCharName(e.target.value)}
                      className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono uppercase text-amber-400">Arch-Role</label>
                    <select
                      value={charRole}
                      onChange={(e) => setCharRole(e.target.value)}
                      className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none"
                    >
                      <option value="protagonist">Protagonist</option>
                      <option value="antagonist">Antagonist</option>
                      <option value="supporting">Supporting</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-amber-400">Visual Descriptor</label>
                  <input
                    type="text"
                    placeholder="Wears iron gauntlets, glowing eyes..."
                    value={charDesc}
                    onChange={(e) => setCharDesc(e.target.value)}
                    className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-amber-400">Key Traits</label>
                  <input
                    type="text"
                    placeholder="Resolute, unyielding, fearful of fire"
                    value={charTraits}
                    onChange={(e) => setCharTraits(e.target.value)}
                    className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono uppercase text-amber-400">Backstory Core</label>
                  <input
                    type="text"
                    placeholder="Abandoned during the Great Eclipse..."
                    value={charBackstory}
                    onChange={(e) => setCharBackstory(e.target.value)}
                    className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-1.5 bg-amber-950 hover:bg-amber-900 border border-amber-500/30 text-amber-200 font-serif font-semibold rounded-lg cursor-pointer transition-all text-[11px]"
                >
                  Summon Character Profile
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Right Column: Dynamic Workspace Editor (Lanes 8 / 12) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Selector Toolbar */}
          <div className="p-4 bg-amber-950/5 border border-amber-900/15 rounded-xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-1 items-center gap-2">
              <span className="text-xs font-mono uppercase text-amber-400/80">Select Active Book:</span>
              <select
                value={selectedBookId}
                onChange={(e) => {
                  setSelectedBookId(e.target.value);
                  setSelectedChapterId('');
                  setManuscriptText('');
                }}
                className="bg-black/50 border border-amber-950 text-amber-100 text-xs rounded-lg p-2 focus:outline-none max-w-xs truncate"
              >
                <option value="">-- Choose Book project --</option>
                {books.map(b => (
                  <option key={b.id} value={b.id}>{b.title} ({b.genre})</option>
                ))}
              </select>
            </div>

            {currentBook && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-amber-400/80">Active Chapter:</span>
                <select
                  value={selectedChapterId}
                  onChange={(e) => {
                    setSelectedChapterId(e.target.value);
                    const chap = chapters.find(c => c.id === e.target.value);
                    if (chap) {
                      setManuscriptText('');
                    }
                  }}
                  className="bg-black/50 border border-amber-950 text-amber-100 text-xs rounded-lg p-2 focus:outline-none max-w-xs"
                >
                  <option value="">-- Choose Chapter --</option>
                  {bookChapters.map(c => (
                    <option key={c.id} value={c.id}>Ch {c.order}: {c.title}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {currentBook ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* Left Panel: Novel Blueprint Specs */}
              <div className="md:col-span-4 space-y-4">
                
                {/* Book info card */}
                <div className="p-4 bg-amber-950/10 border border-amber-500/10 rounded-xl space-y-2">
                  <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-amber-400">Project Premise</h4>
                  <p className="text-xs text-amber-200/80 leading-relaxed font-serif line-clamp-6 hover:line-clamp-none transition-all">
                    {currentBook.description}
                  </p>
                </div>

                {/* Chapter List Selector */}
                <div className="p-4 bg-amber-950/10 border border-amber-500/10 rounded-xl space-y-3">
                  <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
                    <span>Chapter Planners</span>
                    <span className="text-[10px] bg-black/40 px-1.5 py-0.2 rounded text-amber-500">{bookChapters.length} Total</span>
                  </h4>
                  
                  <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                    {bookChapters.map((ch) => (
                      <button
                        key={ch.id}
                        onClick={() => {
                          setSelectedChapterId(ch.id);
                          setManuscriptText('');
                        }}
                        className={`w-full text-left p-2 rounded-lg text-xs font-serif transition-all cursor-pointer flex items-center justify-between ${
                          selectedChapterId === ch.id
                            ? 'bg-amber-500 text-amber-950 font-bold'
                            : 'bg-black/30 hover:bg-black/50 text-amber-200/80'
                        }`}
                      >
                        <span className="truncate pr-2">Ch {ch.order}: {ch.title}</span>
                        <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Local Characters Cast */}
                <div className="p-4 bg-amber-950/10 border border-amber-500/10 rounded-xl space-y-2">
                  <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center justify-between">
                    <span>Novel Dramatis Personae</span>
                    <span className="text-[10px] bg-black/40 px-1.5 py-0.2 rounded text-amber-500">{bookCharacters.length}</span>
                  </h4>

                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {bookCharacters.length === 0 ? (
                      <p className="text-[10px] text-amber-200/30 font-serif">No character profiles exist for this book. Register one using the helper.</p>
                    ) : (
                      bookCharacters.map((char) => (
                        <div key={char.id} className="p-2 bg-black/20 border border-amber-900/10 rounded-lg space-y-0.5">
                          <div className="flex items-center justify-between text-xs font-serif">
                            <strong className="text-amber-100">{char.name}</strong>
                            <span className="text-[8px] font-mono bg-amber-500/10 text-amber-400 px-1.5 py-0.2 rounded uppercase">{char.role}</span>
                          </div>
                          <p className="text-[10px] text-amber-200/60 leading-tight italic line-clamp-2">{char.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Right Panel: Active Novel Typewriter / AI Assistant (8 cols) */}
              <div className="md:col-span-8 space-y-4">
                {currentChapter ? (
                  <div className="p-5 bg-amber-950/5 border border-amber-900/20 rounded-xl space-y-4">
                    <div className="border-b border-amber-900/10 pb-3">
                      <h3 className="font-serif text-base font-bold text-amber-100">{currentChapter.title}</h3>
                      <p className="text-xs text-amber-200/60 leading-relaxed font-serif mt-1 italic bg-black/20 p-2 rounded-lg border border-amber-900/10">
                        <strong className="text-amber-400 not-italic font-mono uppercase text-[9px] block mb-0.5">Chapter Target Summary Objective:</strong>
                        {currentChapter.summary}
                      </p>
                    </div>

                    {/* AI Prompt Directives */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-mono uppercase text-amber-400">AI Typewriter Instructions & Prose Guidelines</label>
                        <span className="text-[10px] text-amber-200/50 font-serif">Gemini Powered Assistant</span>
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Write in heavy medieval tone, emphasizing a surprise betrayal, approx 700 words..."
                        value={editorGuidelines}
                        onChange={(e) => setEditorGuidelines(e.target.value)}
                        className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                      />
                    </div>

                    {/* Chapter Typewriter box */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-amber-400">Manuscript Chapter Draft Prose</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={handleAIGenerateChapter}
                            disabled={isWritingChapter}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-amber-950 text-[10px] font-serif font-bold rounded cursor-pointer flex items-center gap-1 transition-all"
                          >
                            {isWritingChapter ? (
                              <>
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Transcribing Manuscript...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-3 w-3" />
                                Compose Prose via AI
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <textarea
                        rows={16}
                        placeholder="Start typing your manuscript, or invoke the Compose Prose button to synthesize a full high-fidelity chapter draft from your chapter summary goals..."
                        value={manuscriptText}
                        onChange={(e) => setManuscriptText(e.target.value)}
                        className="w-full bg-black/60 border border-amber-900/30 text-amber-100 rounded-lg p-3 text-xs font-serif leading-relaxed focus:outline-none focus:border-amber-500/50"
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between border-t border-amber-900/10 pt-3">
                      <span className="text-[10px] text-amber-200/40 font-mono">
                        Words: {manuscriptText.trim() ? manuscriptText.trim().split(/\s+/).length : 0} • Prose ready for KDP exports
                      </span>
                      
                      <div className="flex items-center gap-2">
                        {saveSuccess && (
                          <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                            <Check className="h-3.5 w-3.5" /> Saved to Imperial Archives
                          </span>
                        )}
                        <button
                          onClick={handleSaveManuscript}
                          className="px-3.5 py-1.5 bg-amber-900/40 border border-amber-500/30 hover:bg-amber-800 text-amber-100 rounded-xl font-serif text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
                        >
                          <Save className="h-4 w-4 text-amber-500" />
                          Save Scriptorium Archival
                        </button>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="p-12 border border-dashed border-amber-900/20 bg-amber-950/5 text-center rounded-xl space-y-2">
                    <BookOpen className="h-8 w-8 text-amber-500/40 mx-auto" />
                    <h4 className="font-serif text-sm font-bold text-amber-200">No Chapter Selected</h4>
                    <p className="text-xs text-amber-200/50 max-w-sm mx-auto leading-relaxed">
                      Please select an active chapter planner on the left side to enter the immersive Typewriter workspace, or use the Novel Catalyst to auto-forge plans.
                    </p>
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="p-12 border border-dashed border-amber-900/20 bg-amber-950/5 text-center rounded-xl space-y-4">
              <Sparkles className="h-10 w-10 text-amber-500/30 mx-auto animate-pulse" />
              <h3 className="font-serif text-base font-bold text-amber-100">Initiate Your First Masterwork</h3>
              <p className="text-xs text-amber-200/60 max-w-md mx-auto leading-relaxed font-serif">
                To access the AI Typewriter and novel planner, you must first register or generate a Book project. Use the **Kingdom Novel Catalyst** on the left to auto-build one instantly, or register a book in the Imperial Database tab.
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
