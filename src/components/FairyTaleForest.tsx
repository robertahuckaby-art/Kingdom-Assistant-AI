import React, { useState } from 'react';
import { 
  Sparkles, BookOpen, Heart, HelpCircle, GraduationCap, ArrowRight, 
  Layers, Smile, AlertCircle, Loader2, Compass 
} from 'lucide-react';

interface FairyTaleForestProps {
  onAddBook: (book: any) => void;
  onAddProduct: (product: any) => void;
}

export default function FairyTaleForest({ onAddBook, onAddProduct }: FairyTaleForestProps) {
  const [theme, setTheme] = useState('Courage and Kindness');
  const [heroType, setHeroType] = useState('A tiny, glowing firefly who is afraid of the dark');
  const [moralLesson, setMoralLesson] = useState('True courage is not about being fearless, but helping others despite your fears.');
  const [ageGroup, setAgeGroup] = useState('4-8 Years');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [storyPackage, setStoryPackage] = useState<any>(null);
  const [activeStoryPage, setActiveStoryPage] = useState(1);

  const handleGenerateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!theme || !moralLesson) {
      setErrorMessage("Please fill in both the theme and the moral lesson.");
      return;
    }
    setErrorMessage("");
    setIsLoading(true);
    setStoryPackage(null);

    try {
      const response = await fetch('/api/author/children-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme,
          heroType,
          moralLesson,
          ageGroup
        })
      });

      if (!response.ok) {
        throw new Error("Unable to summon the forest storytelling spriggan. Check your server API keys.");
      }

      const data = await response.json();
      setStoryPackage(data);
      setActiveStoryPage(1);

      // Auto add book representation to state
      onAddBook({
        id: 'child_book_' + Date.now(),
        title: data.title || 'Fairy Tale story',
        genre: 'Children Story',
        targetAudience: ageGroup,
        description: `Character: ${data.characterName} - ${data.characterDescription}. Moral: ${moralLesson}`,
        createdAt: new Date().toLocaleDateString()
      });

      // Auto register educator materials as product
      onAddProduct({
        id: 'child_prod_' + Date.now(),
        title: `${data.title || 'Fairy Tale'} - Classroom & Parent Guide`,
        type: 'pdf',
        description: `Educator lesson planner and parent bedtime questions. Theme: ${theme}`,
        pagesCount: 8,
        contentStructure: `Syllabus exercises: ${data.lessonPlan}\nDiscussion parameters: ${data.discussionGuide}`
      });

    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected disturbance occurred in the forest.");
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
            <Compass className="h-6 w-6 text-emerald-500" />
            Fairy Tale Forest & Children's Studio
          </h2>
          <p className="text-xs text-amber-200/60 mt-0.5">
            Formulate whimsical stories with positive character development, structured parent guides, and interactive classroom learning plans.
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
        
        {/* Left Column: Input Form parameters */}
        <div className="lg:col-span-4 p-5 bg-amber-950/10 border border-amber-500/20 rounded-xl space-y-4 h-fit">
          <h3 className="font-serif text-sm font-bold text-amber-300 flex items-center gap-1.5">
            <Smile className="h-4 w-4 text-emerald-500" />
            Story Concept Architect
          </h3>
          <p className="text-[11px] text-amber-200/50 leading-relaxed font-serif">
            Design child-friendly moral parables. Let the AI build complete storyboards, classroom syllabus plans, and interactive parent dialogue guidelines.
          </p>

          <form onSubmit={handleGenerateStory} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-amber-400">Moral Lesson of the Story</label>
              <textarea
                rows={2}
                required
                placeholder="e.g. Kind words melt a frozen heart / Sharing resources creates abundance."
                value={moralLesson}
                onChange={(e) => setMoralLesson(e.target.value)}
                className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-amber-400">Main Hero Character Type</label>
              <input
                type="text"
                required
                placeholder="e.g. A clumsy small dragon who sneezes water instead of fire"
                value={heroType}
                onChange={(e) => setHeroType(e.target.value)}
                className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-amber-400">Thematic Topic</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Overcoming Fears"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-amber-400">Age Group Focus</label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value)}
                  className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none focus:border-amber-500/50"
                >
                  <option value="3-5 Years">Toddlers (3-5 Years)</option>
                  <option value="4-8 Years">Preschool/Early Reader (4-8 Years)</option>
                  <option value="6-10 Years">Elementary Grade (6-10 Years)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-amber-950 font-serif font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Spinning Whimsical Yarn...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-amber-950" />
                  Sow Seed of Children Story
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Display Generated Storyboard & Materials */}
        <div className="lg:col-span-8 space-y-6">
          {storyPackage ? (
            <div className="space-y-6">
              
              {/* Whimsical Header Box */}
              <div className="p-5 bg-emerald-950/15 border border-emerald-500/20 rounded-xl space-y-2">
                <div className="flex items-center gap-1 text-emerald-400 font-mono text-[10px] uppercase">
                  <Smile className="h-3.5 w-3.5" /> Whimsical Children's Masterwork Generated
                </div>
                <h3 className="font-serif text-xl font-bold text-amber-100">{storyPackage.title}</h3>
                
                {/* Character card */}
                <div className="p-3.5 bg-black/30 border border-emerald-900/20 rounded-lg flex gap-3 items-start">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-full border border-emerald-500/30 flex items-center justify-center text-emerald-300 font-serif font-bold text-lg">
                    {storyPackage.characterName?.charAt(0) || '★'}
                  </div>
                  <div>
                    <strong className="text-emerald-300 text-xs font-serif">Lead Hero Protagonist: {storyPackage.characterName}</strong>
                    <p className="text-xs text-amber-200/70 mt-0.5 leading-relaxed">{storyPackage.characterDescription}</p>
                  </div>
                </div>
              </div>

              {/* Story pages & illustrations carousel */}
              <div className="p-5 bg-amber-950/10 border border-amber-900/15 rounded-xl space-y-4">
                <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
                  <span className="font-serif text-xs font-bold text-amber-300 flex items-center gap-1">
                    <BookOpen className="h-4 w-4 text-emerald-500" /> Storyboard Pages (Page {activeStoryPage} of {storyPackage.storyPages?.length})
                  </span>
                  <div className="flex gap-1.5">
                    {storyPackage.storyPages?.map((p: any) => (
                      <button
                        key={p.pageNumber}
                        onClick={() => setActiveStoryPage(p.pageNumber)}
                        className={`w-6 h-6 rounded-full font-mono text-xs flex items-center justify-center cursor-pointer transition-all ${
                          activeStoryPage === p.pageNumber
                            ? 'bg-emerald-500 text-amber-950 font-bold'
                            : 'bg-black/40 hover:bg-black/60 text-amber-300'
                        }`}
                      >
                        {p.pageNumber}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Narrative page content */}
                {storyPackage.storyPages?.map((p: any) => {
                  if (p.pageNumber !== activeStoryPage) return null;
                  return (
                    <div key={p.pageNumber} className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                      {/* Left: Narration */}
                      <div className="p-4 bg-black/30 border border-amber-900/5 rounded-xl flex flex-col justify-center min-h-[160px]">
                        <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-2">Narrator voice:</span>
                        <p className="text-sm font-serif text-amber-100 leading-relaxed italic">
                          "{p.narration}"
                        </p>
                      </div>

                      {/* Right: Illustrator Concept */}
                      <div className="p-4 bg-emerald-950/5 border border-emerald-500/10 rounded-xl flex flex-col justify-center min-h-[160px]">
                        <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block mb-1">Illustration Artwork Guide:</span>
                        <p className="text-xs text-amber-200/70 leading-relaxed">
                          {p.illustrationIdea}
                        </p>
                        <div className="mt-3 text-[10px] text-emerald-400 font-mono italic">
                          💡 Insert this guide description into our Creative Studio prompt box to plan beautiful vector artwork prints!
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Lesson Planner and Parent bedtime guide */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Educator lesson plans */}
                <div className="p-4 bg-emerald-950/10 border border-emerald-500/15 rounded-xl space-y-2">
                  <h4 className="font-serif text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5 border-b border-emerald-950 pb-1.5">
                    <GraduationCap className="h-4 w-4" /> Classroom Educator Lesson Planner
                  </h4>
                  <div className="text-xs text-amber-200/80 leading-relaxed whitespace-pre-wrap font-serif">
                    {storyPackage.lessonPlan}
                  </div>
                </div>

                {/* Parent bedtime guides */}
                <div className="p-4 bg-amber-950/10 border border-amber-500/15 rounded-xl space-y-2">
                  <h4 className="font-serif text-xs font-bold uppercase text-amber-300 flex items-center gap-1.5 border-b border-amber-950 pb-1.5">
                    <HelpCircle className="h-4 w-4 text-amber-500" /> Parent bedtime discussion questions
                  </h4>
                  <div className="text-xs text-amber-200/80 leading-relaxed whitespace-pre-wrap font-serif">
                    {storyPackage.discussionGuide}
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="p-12 border border-dashed border-amber-900/20 bg-amber-950/5 text-center rounded-xl space-y-4">
              <Smile className="h-10 w-10 text-emerald-500/30 mx-auto animate-bounce" />
              <h3 className="font-serif text-base font-bold text-amber-100">Enter Fairy Tale Forest</h3>
              <p className="text-xs text-amber-200/60 max-w-md mx-auto leading-relaxed font-serif">
                Formulate elegant kids stories to inspire the next generation. Use the **Story Concept Architect** on the left to set moral foundations, and click **Sow Seed** to watch a customized fantasy book pack grow before your eyes!
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
