import React, { useState, useEffect } from 'react';
import { 
  Book, Chapter, Character, Manuscript, PublishingProject, LaunchCampaign, Product, Course, AuthorWorkspaceState 
} from './types';

// Import specialized studio subcomponents
import RoyalLibrary from './components/RoyalLibrary';
import Scriptorium from './components/Scriptorium';
import FairyTaleForest from './components/FairyTaleForest';
import Sanctuary from './components/Sanctuary';
import CrownPublisher from './components/CrownPublisher';
import HeraldMarketing from './components/HeraldMarketing';
import ContentCathedral from './components/ContentCathedral';
import IlluminationStudio from './components/IlluminationStudio';

import { 
  Crown, Compass, BookMarked, Landmark, Sparkles, Database, Palette, 
  Megaphone, GraduationCap, PenTool, Flame, RefreshCcw, Save, Trash2, CheckCircle2, Award, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const LOCAL_STORAGE_WORKSPACE_KEY = 'kingdom_author_studio_workspace_v2';

const SEED_BOOKS: Book[] = [
  {
    id: 'seed_book_1',
    title: 'Throne of Sacred Oak',
    genre: 'Epic Fantasy',
    targetAudience: 'Young Adults & Fantasy Seekers',
    description: 'A magical quest detailing the trials of Captain Varis as he defends the wooden fortress of Eldoria from the rising Shadow Cabal.',
    createdAt: '07/05/2026'
  },
  {
    id: 'seed_book_2',
    title: 'The Grace-Filled Scribe',
    genre: 'Christian Devotional',
    targetAudience: 'Christian Writers & Coaches',
    description: 'A 30-day journaling workbook that equips creators to dedicate their writing talents and scribe with deep biblical wisdom.',
    createdAt: '07/05/2026'
  }
];

const SEED_CHAPTERS: Chapter[] = [
  {
    id: 'seed_chap_1',
    bookId: 'seed_book_1',
    title: 'The Great Betrayal',
    summary: 'The shadow forces infiltrate the outer gates of Eldoria. Captain Varis discovers a close counselor is leaking intelligence.',
    order: 1
  },
  {
    id: 'seed_chap_2',
    bookId: 'seed_book_1',
    title: 'Fires of the Ancient Oak',
    summary: 'Varis flees with the crown seal into the glowing magical wastes, seeking the reclusive Druids of the Crimson Canopies.',
    order: 2
  }
];

const SEED_CHARACTERS: Character[] = [
  {
    id: 'seed_char_1',
    bookId: 'seed_book_1',
    name: 'Captain Varis',
    role: 'protagonist',
    description: 'A grizzled commander of the forest keepers, bearing a deep scar and a crown seal.',
    traits: 'Steadfast, loyal, haunted by prior battlefield retreats.',
    backstory: 'Orphaned in the desert dunes, raised by the High Druid to become a master shieldbearer.'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'scriptorium' | 'library' | 'kids' | 'christian' | 'kdp' | 'marketing' | 'academy' | 'creative'>('scriptorium');
  
  // Primary state database
  const [workspace, setWorkspace] = useState<AuthorWorkspaceState>({
    books: [],
    chapters: [],
    manuscripts: [],
    characters: [],
    publishingProjects: [],
    launches: [],
    products: [],
    courses: []
  });

  const [stateLoaded, setStateLoaded] = useState(false);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_WORKSPACE_KEY);
    if (saved) {
      try {
        setWorkspace(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved author workspace:", e);
        // Fallback to seeds
        setWorkspace({
          books: SEED_BOOKS,
          chapters: SEED_CHAPTERS,
          manuscripts: [],
          characters: SEED_CHARACTERS,
          publishingProjects: [],
          launches: [],
          products: [],
          courses: []
        });
      }
    } else {
      // Use Seed defaults for a rich initial experience
      setWorkspace({
        books: SEED_BOOKS,
        chapters: SEED_CHAPTERS,
        manuscripts: [],
        characters: SEED_CHARACTERS,
        publishingProjects: [],
        launches: [],
        products: [],
        courses: []
      });
    }
    setStateLoaded(true);
  }, []);

  // Save to local storage
  const saveWorkspace = (newWorkspace: AuthorWorkspaceState) => {
    setWorkspace(newWorkspace);
    localStorage.setItem(LOCAL_STORAGE_WORKSPACE_KEY, JSON.stringify(newWorkspace));
  };

  const showNotification = (msg: string) => {
    setActiveNotification(msg);
    setTimeout(() => {
      setActiveNotification(null);
    }, 3000);
  };

  // State update callbacks
  const handleAddBook = (book: Book) => {
    const updated = { ...workspace, books: [...workspace.books, book] };
    saveWorkspace(updated);
    showNotification(`Book "${book.title}" added to Royal Library!`);
  };

  const handleAddChapter = (chapter: Chapter) => {
    const updated = { ...workspace, chapters: [...workspace.chapters, chapter] };
    saveWorkspace(updated);
    showNotification(`Chapter "${chapter.title}" created!`);
  };

  const handleAddCharacter = (char: Character) => {
    const updated = { ...workspace, characters: [...workspace.characters, char] };
    saveWorkspace(updated);
    showNotification(`Character "${char.name}" registered!`);
  };

  const handleAddPublishingProject = (project: PublishingProject) => {
    const updated = { ...workspace, publishingProjects: [...workspace.publishingProjects, project] };
    saveWorkspace(updated);
    showNotification(`KDP formatting specs compiled!`);
  };

  const handleAddLaunch = (launch: LaunchCampaign) => {
    const updated = { ...workspace, launches: [...workspace.launches, launch] };
    saveWorkspace(updated);
    showNotification(`Launch timeline formulated!`);
  };

  const handleAddProduct = (product: Product) => {
    const updated = { ...workspace, products: [...workspace.products, product] };
    saveWorkspace(updated);
    showNotification(`Content product "${product.title}" drafted!`);
  };

  const handleAddCourse = (course: Course) => {
    const updated = { ...workspace, courses: [...workspace.courses, course] };
    saveWorkspace(updated);
    showNotification(`Master course syllabus created!`);
  };

  const handleUpdateChapterSummary = (chapterId: string, summary: string) => {
    const updatedChapters = workspace.chapters.map(c => 
      c.id === chapterId ? { ...c, summary } : c
    );
    saveWorkspace({ ...workspace, chapters: updatedChapters });
    showNotification(`Chapter planner notes updated.`);
  };

  const handleDeleteEntity = (
    type: 'books' | 'chapters' | 'characters' | 'publishingProjects' | 'launches' | 'products' | 'courses', 
    id: string
  ) => {
    const list = workspace[type] as any[];
    const filtered = list.filter(item => item.id !== id);
    const updated = { ...workspace, [type]: filtered };
    saveWorkspace(updated);
    showNotification(`Asset deleted successfully.`);
  };

  const handleResetWorkspace = () => {
    if (confirm("Are you sure you want to restore initial sample books? This cleans all active manuscript sessions.")) {
      const resetState: AuthorWorkspaceState = {
        books: SEED_BOOKS,
        chapters: SEED_CHAPTERS,
        manuscripts: [],
        characters: SEED_CHARACTERS,
        publishingProjects: [],
        launches: [],
        products: [],
        courses: []
      };
      saveWorkspace(resetState);
      showNotification("Workspace restored to default seeds.");
    }
  };

  if (!stateLoaded) {
    return (
      <div className="min-h-screen bg-neutral-950 text-amber-100 flex items-center justify-center font-serif">
        <div className="text-center space-y-4">
          <RefreshCcw className="h-8 w-8 text-amber-500 animate-spin mx-auto" />
          <p className="text-xs text-amber-200/40 font-mono uppercase tracking-widest">Entering the Kingdom Studio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-amber-100 flex flex-col font-sans relative select-none selection:bg-amber-500/20">
      
      {/* Top Notification Toast */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 12 }}
            exit={{ opacity: 0, y: -40 }}
            className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-amber-950 font-serif text-xs font-bold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-amber-400"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{activeNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main majestic gold and obsidian header banner */}
      <header className="border-b border-amber-900/30 bg-zinc-950/80 backdrop-blur-md px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl border border-amber-500/30 bg-amber-950/30 text-amber-500 shadow-inner animate-pulse">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-serif text-xl font-extrabold tracking-wide text-amber-100 flex items-center gap-1.5 leading-none">
                Kingdom Author Studio
                <span className="text-[10px] bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono px-2 py-0.5 rounded-full font-bold uppercase">
                  v3.0 Supreme
                </span>
              </h1>
              <p className="text-xs text-amber-200/50 font-serif mt-1">
                The world's premier book composition, Christian publishing, children's storyboarding, and self-publishing blueprint suite.
              </p>
            </div>
          </div>

          {/* Quick HUD counts */}
          <div className="flex flex-wrap items-center gap-3 self-end md:self-auto font-mono text-[10px] uppercase">
            <div className="px-2.5 py-1 bg-black/40 border border-amber-900/15 rounded flex items-center gap-1">
              📕 <span className="text-amber-200">Books:</span> <span className="text-amber-400 font-bold">{workspace.books.length}</span>
            </div>
            <div className="px-2.5 py-1 bg-black/40 border border-amber-900/15 rounded flex items-center gap-1">
              🔖 <span className="text-amber-200">Chapters:</span> <span className="text-amber-400 font-bold">{workspace.chapters.length}</span>
            </div>
            <div className="px-2.5 py-1 bg-black/40 border border-amber-900/15 rounded flex items-center gap-1">
              📦 <span className="text-amber-200">Products:</span> <span className="text-amber-400 font-bold">{workspace.products.length}</span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Side Studio Selector Panel */}
        <div className="lg:col-span-1 space-y-4">
          <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block px-2">Creative Workshops</span>
          
          <nav className="flex flex-col gap-1.5 overflow-y-auto pr-1">
            {[
              { id: 'scriptorium', label: 'AI Scriptorium', desc: 'Book outlining & typewriter drafts', icon: PenTool, accentColor: 'text-amber-400' },
              { id: 'kids', label: "Children's Studio", desc: 'Fairy tale stories & parent guides', icon: Compass, accentColor: 'text-emerald-400' },
              { id: 'christian', label: 'Christian Sanctuary', desc: 'Daily devotionals & sermon outlines', icon: BookMarked, accentColor: 'text-amber-500' },
              { id: 'kdp', label: 'Crown Publisher', desc: 'KDP margins, bleeds & ISBN guides', icon: Award, accentColor: 'text-amber-300' },
              { id: 'marketing', label: 'Herald Publicity', desc: 'Author bios & launch campaigns', icon: Megaphone, accentColor: 'text-rose-400' },
              { id: 'academy', label: 'Content Academy', desc: 'Syllabi outlines & workbook templates', icon: GraduationCap, accentColor: 'text-cyan-400' },
              { id: 'creative', label: 'Creative Studio', desc: 'Color palettes & cover art prompt builders', icon: Palette, accentColor: 'text-purple-400' },
              { id: 'library', label: 'Imperial Database', desc: 'Manage assets & catalog registries', icon: Database, accentColor: 'text-yellow-500' }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-2.5 rounded-xl text-left border cursor-pointer transition-all flex items-start gap-2.5 ${
                    activeTab === tab.id
                      ? 'bg-amber-500/15 text-amber-100 border-amber-500/35'
                      : 'border-transparent text-amber-200/50 hover:bg-amber-950/10 hover:text-amber-200/85'
                  }`}
                >
                  <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${tab.accentColor}`} />
                  <div>
                    <div className="font-serif text-xs font-bold leading-none">{tab.label}</div>
                    <p className="text-[9px] text-amber-200/30 mt-0.5 leading-tight">{tab.desc}</p>
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Settings actions inside rail */}
          <div className="pt-4 border-t border-amber-900/10 space-y-2">
            <button
              onClick={handleResetWorkspace}
              className="w-full py-2 border border-amber-900/40 text-[9px] font-mono text-amber-400/80 hover:bg-amber-950/15 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5"
            >
              <RefreshCcw className="h-3 w-3" /> Restore Seed Data
            </button>
          </div>
        </div>

        {/* Main interactive Tab screen */}
        <div className="lg:col-span-4 bg-zinc-950/25 border border-amber-900/15 p-6 rounded-2xl shadow-2xl min-h-[520px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.15 }}
            >
              
              {activeTab === 'library' && (
                <RoyalLibrary
                  books={workspace.books}
                  chapters={workspace.chapters}
                  manuscripts={workspace.manuscripts}
                  characters={workspace.characters}
                  publishingProjects={workspace.publishingProjects}
                  launches={workspace.launches}
                  products={workspace.products}
                  courses={workspace.courses}
                  onAddBook={handleAddBook}
                  onAddChapter={handleAddChapter}
                  onAddCharacter={handleAddCharacter}
                  onAddPublishingProject={handleAddPublishingProject}
                  onAddLaunch={handleAddLaunch}
                  onAddProduct={handleAddProduct}
                  onAddCourse={handleAddCourse}
                  onDeleteEntity={handleDeleteEntity}
                />
              )}

              {activeTab === 'scriptorium' && (
                <Scriptorium
                  books={workspace.books}
                  chapters={workspace.chapters}
                  characters={workspace.characters}
                  onAddBook={handleAddBook}
                  onAddChapter={handleAddChapter}
                  onAddCharacter={handleAddCharacter}
                  onUpdateChapterSummary={handleUpdateChapterSummary}
                />
              )}

              {activeTab === 'kids' && (
                <FairyTaleForest
                  onAddBook={handleAddBook}
                  onAddProduct={handleAddProduct}
                />
              )}

              {activeTab === 'christian' && (
                <Sanctuary
                  onAddBook={handleAddBook}
                  onAddProduct={handleAddProduct}
                />
              )}

              {activeTab === 'kdp' && (
                <CrownPublisher
                  books={workspace.books}
                  onAddPublishingProject={handleAddPublishingProject}
                />
              )}

              {activeTab === 'marketing' && (
                <HeraldMarketing
                  books={workspace.books}
                  onAddLaunch={handleAddLaunch}
                />
              )}

              {activeTab === 'academy' && (
                <ContentCathedral
                  onAddCourse={handleAddCourse}
                  onAddProduct={handleAddProduct}
                />
              )}

              {activeTab === 'creative' && (
                <IlluminationStudio />
              )}

            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Custom majestic footer with clean credentials */}
      <footer className="border-t border-amber-900/10 py-5 bg-black/40 text-center text-[10px] font-mono text-amber-200/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <span>👑 Powered by Gemini 3.5 Flash Model • Enterprise Scriptorium Intelligence</span>
          <span>© 2026 Kingdom Author Studio • All manuscripts persistently archived in client state.</span>
        </div>
      </footer>

    </div>
  );
}
