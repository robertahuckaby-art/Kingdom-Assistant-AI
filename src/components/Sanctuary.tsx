import React, { useState } from 'react';
import { 
  Sparkles, BookOpen, Heart, HelpCircle, FileText, ChevronRight, 
  HeartHandshake, BookMarked, Loader2, AlertCircle, ShieldAlert
} from 'lucide-react';

interface SanctuaryProps {
  onAddBook: (book: any) => void;
  onAddProduct: (product: any) => void;
}

export default function Sanctuary({ onAddBook, onAddProduct }: SanctuaryProps) {
  const [format, setFormat] = useState('Devotional');
  const [scriptureTopic, setScriptureTopic] = useState('Finding Peace in times of Storm');
  const [biblicalReference, setBiblicalReference] = useState('Mark 4:35-41 (Peace, Be Still!)');
  const [focusAudience, setFocusAudience] = useState('Families dealing with change and anxieties');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [devotionalOutput, setDevotionalOutput] = useState<any>(null);

  const handleGenerateDevotional = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scriptureTopic) {
      setErrorMessage("Please enter a scripture topic.");
      return;
    }
    setErrorMessage("");
    setIsLoading(true);
    setDevotionalOutput(null);

    try {
      const response = await fetch('/api/author/christian-devotional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          format,
          scriptureTopic,
          biblicalReference,
          focusAudience
        })
      });

      if (!response.ok) {
        throw new Error("Failed to transcribe holy insights. Please verify server setup and secrets.");
      }

      const data = await response.json();
      setDevotionalOutput(data);

      // Auto add book entry to state
      onAddBook({
        id: 'devotional_book_' + Date.now(),
        title: data.title || 'Inspirational Devotional Study',
        genre: 'Christian Devotional',
        targetAudience: focusAudience,
        description: `Reflections on ${scriptureTopic}. Scripture: ${data.scriptureText || biblicalReference}`,
        createdAt: new Date().toLocaleDateString()
      });

      // Auto add product workbook/prayer-journal representation
      onAddProduct({
        id: 'devotional_prod_' + Date.now(),
        title: `Prayer Devotional: ${data.title}`,
        type: 'journal',
        description: `Daily prayer journal prompts and theological notes for ${scriptureTopic}.`,
        pagesCount: 16,
        contentStructure: `Scripture text: ${data.scriptureText}\nReflection objectives: ${data.reflectionQuestions}\nPrayer prompt: ${data.prayer}`
      });

    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected disturbance occurred while meditating on scripture.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-amber-900/20 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-wide text-amber-100 flex items-center gap-2">
            <BookMarked className="h-6 w-6 text-amber-400" />
            Sanctuary Christian Publishing Suite
          </h2>
          <p className="text-xs text-amber-200/60 mt-0.5">
            Scribe rich biblically-grounded daily devotionals, structured sermon outlines, comprehensive study guides, and prayer journal prompt books.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-950/20 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-center gap-2 font-serif">
          <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Input Panel (4 cols) */}
        <div className="lg:col-span-4 p-5 bg-amber-950/10 border border-amber-500/20 rounded-xl space-y-4 h-fit">
          <h3 className="font-serif text-sm font-bold text-amber-300 flex items-center gap-1.5">
            <Heart className="h-4 w-4 text-amber-500 animate-pulse" />
            Scripture Scribe Catalyst
          </h3>
          <p className="text-[11px] text-amber-200/50 leading-relaxed font-serif">
            Input a spiritual topic and suitable scripture context. The AI will output professional theological insights, life lessons, reflection workbook activities, and conclusions.
          </p>

          <form onSubmit={handleGenerateDevotional} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-amber-400">Publication Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none focus:border-amber-500/50 font-serif"
              >
                <option value="Devotional">📖 Classic Daily Devotional Day</option>
                <option value="Sermon Outline">🎙️ Homiletic Sermon Outline</option>
                <option value="Scripture Study Guide">📑 Verse-by-Verse Scripture Study Guide</option>
                <option value="Prayer Journal prompt">✏️ Interactive Prayer Journal Prompts</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-amber-400">Thematic Biblical Topic</label>
              <input
                type="text"
                required
                placeholder="e.g. Finding Peace in Times of Anxieties"
                value={scriptureTopic}
                onChange={(e) => setScriptureTopic(e.target.value)}
                className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none focus:border-amber-500/50 font-serif"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-amber-400">Biblical Context / Verses (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Philippians 4:6-7, Psalm 46"
                value={biblicalReference}
                onChange={(e) => setBiblicalReference(e.target.value)}
                className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-amber-400">Focus Target Audience</label>
              <input
                type="text"
                placeholder="e.g. Tired parents, church congregation, youth"
                value={focusAudience}
                onChange={(e) => setFocusAudience(e.target.value)}
                className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-serif font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Drawing Sacred Insights...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-amber-950" />
                  Scribe Faith Content
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output Panel (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {devotionalOutput ? (
            <div className="space-y-6 animate-fade-in font-serif">
              
              {/* Parchment Devotional Book Display */}
              <div className="p-6 bg-amber-950/10 border border-amber-500/25 rounded-2xl relative shadow-xl overflow-hidden space-y-4">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
                
                {/* Book header details */}
                <div className="text-center border-b border-amber-900/10 pb-4 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-widest">{format}</span>
                  <h3 className="text-2xl font-bold text-amber-100 font-serif">{devotionalOutput.title}</h3>
                  <div className="inline-block px-3 py-1 bg-amber-500/10 rounded-lg border border-amber-500/15 text-xs text-amber-300 mt-2 font-serif italic">
                     📖 {devotionalOutput.scriptureText}
                  </div>
                </div>

                {/* Devotional Body text */}
                <div className="text-sm text-amber-100/90 leading-relaxed whitespace-pre-wrap px-1 font-serif text-justify pt-2">
                  {devotionalOutput.devotionalBody}
                </div>

                {/* Prayer prompt */}
                <div className="p-4 bg-amber-500/5 border-l-4 border-amber-500 rounded-r-lg space-y-1">
                  <span className="text-[9px] font-mono text-amber-400 font-bold uppercase tracking-wider block">Heartfelt Prayer Reflection:</span>
                  <p className="text-xs text-amber-200/90 leading-relaxed italic">
                    "{devotionalOutput.prayer}"
                  </p>
                </div>

                {/* Journal Reflection prompts */}
                <div className="pt-4 border-t border-amber-900/10 space-y-2">
                  <h4 className="text-xs font-mono uppercase text-amber-400 font-bold tracking-wider flex items-center gap-1">
                    <HeartHandshake className="h-4 w-4 text-amber-500" /> Reflection & Prayer Journal prompts
                  </h4>
                  <div className="p-3 bg-black/25 border border-amber-900/10 rounded-xl">
                    <p className="text-xs text-amber-200/80 leading-relaxed whitespace-pre-wrap">
                      {devotionalOutput.reflectionQuestions}
                    </p>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="p-12 border border-dashed border-amber-900/20 bg-amber-950/5 text-center rounded-xl space-y-4">
              <BookOpen className="h-10 w-10 text-amber-500/20 mx-auto animate-pulse" />
              <h3 className="font-serif text-base font-bold text-amber-100">Step Into the Devotional Sanctuary</h3>
              <p className="text-xs text-amber-200/60 max-w-md mx-auto leading-relaxed font-serif">
                Build elegant, faith-focused books, sermon plans, and workbook pages. Define your spiritual topics on the left and invoke the **Scripture Scribe Catalyst** to draft elegant literature.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
