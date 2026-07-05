import React, { useState } from 'react';
import { 
  Book, Chapter, Character, Manuscript, PublishingProject, LaunchCampaign, Product, Course 
} from '../types';
import { 
  Database, Plus, BookOpen, Layers, Users, Scroll, Rocket, ShieldAlert, 
  Trash2, Award, ClipboardList, BookMarked, HelpCircle, FileText
} from 'lucide-react';

interface RoyalLibraryProps {
  books: Book[];
  chapters: Chapter[];
  manuscripts: Manuscript[];
  characters: Character[];
  publishingProjects: PublishingProject[];
  launches: LaunchCampaign[];
  products: Product[];
  courses: Course[];
  onAddBook: (book: Book) => void;
  onAddChapter: (chapter: Chapter) => void;
  onAddCharacter: (char: Character) => void;
  onAddPublishingProject: (project: PublishingProject) => void;
  onAddLaunch: (launch: LaunchCampaign) => void;
  onAddProduct: (product: Product) => void;
  onAddCourse: (course: Course) => void;
  onDeleteEntity: (type: 'books' | 'chapters' | 'characters' | 'publishingProjects' | 'launches' | 'products' | 'courses', id: string) => void;
}

export default function RoyalLibrary({
  books,
  chapters,
  manuscripts,
  characters,
  publishingProjects,
  launches,
  products,
  courses,
  onAddBook,
  onAddChapter,
  onAddCharacter,
  onAddPublishingProject,
  onAddLaunch,
  onAddProduct,
  onAddCourse,
  onDeleteEntity
}: RoyalLibraryProps) {
  const [subTab, setSubTab] = useState<'books' | 'chapters' | 'characters' | 'publishing' | 'launches' | 'products' | 'courses'>('books');
  const [showAddForm, setShowAddForm] = useState(false);

  // Form states
  const [newBook, setNewBook] = useState({ title: '', genre: 'Fantasy', targetAudience: 'Young Adult', description: '' });
  const [newChapter, setNewChapter] = useState({ bookId: '', title: '', summary: '', order: 1 });
  const [newCharacter, setNewCharacter] = useState({ bookId: '', name: '', role: 'protagonist', description: '', traits: '', backstory: '' });
  const [newPublishing, setNewPublishing] = useState({ bookId: '', kdpFormat: 'paperback' as any, isbn: '', coverPlan: '', categories: '', keywords: '', metadata: '' });
  const [newLaunch, setNewLaunch] = useState({ bookId: '', launchDate: '', status: 'planning' as any });
  const [newProduct, setNewProduct] = useState({ title: '', type: 'journal' as any, description: '', pagesCount: 120, contentStructure: '' });
  const [newCourse, setNewCourse] = useState({ title: '', audience: '', description: '' });

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.title.trim()) return;
    onAddBook({
      id: 'book_' + Date.now(),
      title: newBook.title,
      genre: newBook.genre,
      targetAudience: newBook.targetAudience,
      description: newBook.description,
      createdAt: new Date().toLocaleDateString()
    });
    setNewBook({ title: '', genre: 'Fantasy', targetAudience: 'Young Adult', description: '' });
    setShowAddForm(false);
  };

  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChapter.title.trim() || !newChapter.bookId) return;
    onAddChapter({
      id: 'chapter_' + Date.now(),
      bookId: newChapter.bookId,
      title: newChapter.title,
      summary: newChapter.summary,
      order: Number(newChapter.order)
    });
    setNewChapter({ bookId: '', title: '', summary: '', order: chapters.filter(c => c.bookId === newChapter.bookId).length + 1 });
    setShowAddForm(false);
  };

  const handleCreateCharacter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCharacter.name.trim() || !newCharacter.bookId) return;
    onAddCharacter({
      id: 'char_' + Date.now(),
      bookId: newCharacter.bookId,
      name: newCharacter.name,
      role: newCharacter.role,
      description: newCharacter.description,
      traits: newCharacter.traits,
      backstory: newCharacter.backstory
    });
    setNewCharacter({ bookId: '', name: '', role: 'protagonist', description: '', traits: '', backstory: '' });
    setShowAddForm(false);
  };

  const handleCreatePublishing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPublishing.bookId) return;
    onAddPublishingProject({
      id: 'pub_' + Date.now(),
      bookId: newPublishing.bookId,
      kdpFormat: newPublishing.kdpFormat,
      isbn: newPublishing.isbn || 'Pending Auto-Assignment',
      coverPlan: newPublishing.coverPlan,
      categories: newPublishing.categories.split(',').map(c => c.trim()).filter(Boolean),
      keywords: newPublishing.keywords.split(',').map(k => k.trim()).filter(Boolean),
      metadata: newPublishing.metadata
    });
    setNewPublishing({ bookId: '', kdpFormat: 'paperback', isbn: '', coverPlan: '', categories: '', keywords: '', metadata: '' });
    setShowAddForm(false);
  };

  const handleCreateLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLaunch.bookId) return;
    onAddLaunch({
      id: 'launch_' + Date.now(),
      bookId: newLaunch.bookId,
      launchDate: newLaunch.launchDate || new Date().toLocaleDateString(),
      status: newLaunch.status,
      calendarEvents: [
        { id: 'ev1', date: newLaunch.launchDate, title: 'Release Date', task: 'Upload files to Amazon KDP and hit Publish' }
      ],
      socialPosts: []
    });
    setNewLaunch({ bookId: '', launchDate: '', status: 'planning' });
    setShowAddForm(false);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.title.trim()) return;
    onAddProduct({
      id: 'prod_' + Date.now(),
      title: newProduct.title,
      type: newProduct.type,
      description: newProduct.description,
      pagesCount: Number(newProduct.pagesCount),
      contentStructure: newProduct.contentStructure
    });
    setNewProduct({ title: '', type: 'journal', description: '', pagesCount: 120, contentStructure: '' });
    setShowAddForm(false);
  };

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title.trim()) return;
    onAddCourse({
      id: 'course_' + Date.now(),
      title: newCourse.title,
      audience: newCourse.audience,
      description: newCourse.description,
      syllabus: []
    });
    setNewCourse({ title: '', audience: '', description: '' });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* HUD Header */}
      <div className="flex items-center justify-between border-b border-amber-900/20 pb-4">
        <div>
          <h2 className="font-serif text-2xl font-bold tracking-wide text-amber-100 flex items-center gap-2">
            <Database className="h-6 w-6 text-amber-500" />
            Imperial Library Database
          </h2>
          <p className="text-xs text-amber-200/60 mt-0.5">
            Add and manage books, chapters, manuscripts, character registries, publishing layouts, launch plans, and educational courses.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-amber-950 rounded-xl font-serif text-xs font-bold shadow-md flex items-center gap-1 cursor-pointer transition-all"
        >
          <Plus className="h-4 w-4" />
          {showAddForm ? 'Close Intake' : 'Register New Asset'}
        </button>
      </div>

      {/* Database Navigation Grid */}
      <div className="flex flex-wrap gap-1.5 border-b border-amber-900/10 pb-px">
        {[
          { key: 'books', label: 'Books', icon: BookOpen, count: books.length },
          { key: 'chapters', label: 'Chapters', icon: Layers, count: chapters.length },
          { key: 'characters', label: 'Characters', icon: Users, count: characters.length },
          { key: 'publishing', label: 'KDP Layouts', icon: BookMarked, count: publishingProjects.length },
          { key: 'launches', label: 'Launches', icon: Rocket, count: launches.length },
          { key: 'products', label: 'Content Products', icon: FileText, count: products.length },
          { key: 'courses', label: 'Courses', icon: Award, count: courses.length }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => {
                setSubTab(tab.key as any);
                setShowAddForm(false);
              }}
              className={`px-3 py-2 border-b-2 font-serif text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                subTab === tab.key
                  ? 'border-amber-500 text-amber-300 bg-amber-950/10'
                  : 'border-transparent text-amber-200/50 hover:text-amber-200/80'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
              <span className="text-[10px] bg-black/40 text-amber-400 px-1.5 py-0.2 rounded font-mono">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Entry Forms */}
      {showAddForm && (
        <div className="p-5 bg-amber-950/10 border border-amber-500/30 rounded-xl space-y-4">
          <h3 className="font-serif text-sm font-bold text-amber-100 flex items-center gap-1">
            <Plus className="h-4 w-4 text-amber-500" />
            Intake Registry: {subTab.toUpperCase()}
          </h3>

          {/* Form: Book */}
          {subTab === 'books' && (
            <form onSubmit={handleCreateBook} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-amber-400">Book Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chronicles of the Royal Scribes"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-amber-400">Genre</label>
                  <select
                    value={newBook.genre}
                    onChange={(e) => setNewBook({ ...newBook, genre: e.target.value })}
                    className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="Fantasy">Fantasy</option>
                    <option value="Christian Devotional">Christian Devotional</option>
                    <option value="Children Story">Children's Book</option>
                    <option value="Science Fiction">Science Fiction</option>
                    <option value="Mystery/Thriller">Mystery/Thriller</option>
                    <option value="Biography/History">Biography/History</option>
                    <option value="Self-Help/Coaching">Self-Help/Coaching</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-amber-400">Target Audience</label>
                  <input
                    type="text"
                    placeholder="e.g. Middle Grade, Adults"
                    value={newBook.targetAudience}
                    onChange={(e) => setNewBook({ ...newBook, targetAudience: e.target.value })}
                    className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-mono uppercase text-amber-400">Core Premise & Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Write a brief synopsis of the plot, lessons or scope..."
                  value={newBook.description}
                  onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
                  className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <button
                type="submit"
                className="md:col-span-2 py-2 bg-amber-600 hover:bg-amber-500 text-amber-950 rounded-lg font-serif font-bold text-xs cursor-pointer transition-colors"
              >
                Inscribe Book to Library
              </button>
            </form>
          )}

          {/* Form: Chapter */}
          {subTab === 'chapters' && (
            <form onSubmit={handleCreateChapter} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-amber-400">Select Book</label>
                <select
                  required
                  value={newChapter.bookId}
                  onChange={(e) => setNewChapter({ ...newChapter, bookId: e.target.value })}
                  className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                >
                  <option value="">Choose Book...</option>
                  {books.map(b => (
                    <option key={b.id} value={b.id}>{b.title} ({b.genre})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-mono uppercase text-amber-400">Chapter Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chapter 1: The Call to Arms"
                    value={newChapter.title}
                    onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                    className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-amber-400">Order #</label>
                  <input
                    type="number"
                    value={newChapter.order}
                    onChange={(e) => setNewChapter({ ...newChapter, order: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-mono uppercase text-amber-400">Chapter summary objective</label>
                <textarea
                  rows={2}
                  placeholder="What conflict happens here? What are the key points?"
                  value={newChapter.summary}
                  onChange={(e) => setNewChapter({ ...newChapter, summary: e.target.value })}
                  className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <button
                type="submit"
                className="md:col-span-2 py-2 bg-amber-600 hover:bg-amber-500 text-amber-950 rounded-lg font-serif font-bold text-xs cursor-pointer transition-colors"
              >
                Inscribe Chapter Outline
              </button>
            </form>
          )}

          {/* Form: Character */}
          {subTab === 'characters' && (
            <form onSubmit={handleCreateCharacter} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-amber-400">Select Book</label>
                <select
                  required
                  value={newCharacter.bookId}
                  onChange={(e) => setNewCharacter({ ...newCharacter, bookId: e.target.value })}
                  className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                >
                  <option value="">Choose Book...</option>
                  {books.map(b => (
                    <option key={b.id} value={b.id}>{b.title}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-amber-400">Character Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Captain Varis"
                    value={newCharacter.name}
                    onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
                    className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-amber-400">Role</label>
                  <select
                    value={newCharacter.role}
                    onChange={(e) => setNewCharacter({ ...newCharacter, role: e.target.value })}
                    className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="protagonist">Protagonist (Hero)</option>
                    <option value="antagonist">Antagonist (Villain)</option>
                    <option value="supporting">Supporting Ally</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-amber-400">Key Personality Traits</label>
                <input
                  type="text"
                  placeholder="e.g. Loyal, stubborn, haunted by a dark secret"
                  value={newCharacter.traits}
                  onChange={(e) => setNewCharacter({ ...newCharacter, traits: e.target.value })}
                  className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-amber-400">Visual Description</label>
                <input
                  type="text"
                  placeholder="e.g. Tall, wears a silver cape and has a scar on left cheek"
                  value={newCharacter.description}
                  onChange={(e) => setNewCharacter({ ...newCharacter, description: e.target.value })}
                  className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-mono uppercase text-amber-400">Detailed Backstory</label>
                <textarea
                  rows={2}
                  placeholder="Where did they come from? What are their dramatic conflicts?"
                  value={newCharacter.backstory}
                  onChange={(e) => setNewCharacter({ ...newCharacter, backstory: e.target.value })}
                  className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <button
                type="submit"
                className="md:col-span-2 py-2 bg-amber-600 hover:bg-amber-500 text-amber-950 rounded-lg font-serif font-bold text-xs cursor-pointer transition-colors"
              >
                Inscribe Character Profile
              </button>
            </form>
          )}

          {/* Form: Publishing Project */}
          {subTab === 'publishing' && (
            <form onSubmit={handleCreatePublishing} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-amber-400">Select Book</label>
                <select
                  required
                  value={newPublishing.bookId}
                  onChange={(e) => setNewPublishing({ ...newPublishing, bookId: e.target.value })}
                  className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                >
                  <option value="">Choose Book...</option>
                  {books.map(b => (
                    <option key={b.id} value={b.id}>{b.title}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-amber-400">KDP Print Format</label>
                  <select
                    value={newPublishing.kdpFormat}
                    onChange={(e) => setNewPublishing({ ...newPublishing, kdpFormat: e.target.value })}
                    className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="paperback">Paperback (6x9 inches)</option>
                    <option value="hardcover">Hardcover (6x9 inches)</option>
                    <option value="ebook">Kindle eBook</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-amber-400">ISBN Code (if registered)</label>
                  <input
                    type="text"
                    placeholder="e.g. 978-3-16-148410-0"
                    value={newPublishing.isbn}
                    onChange={(e) => setNewPublishing({ ...newPublishing, isbn: e.target.value })}
                    className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-amber-400">Amazon Categories (comma-sep)</label>
                <input
                  type="text"
                  placeholder="e.g. Fiction > Fantasy > Epic, Christian Devotionals"
                  value={newPublishing.categories}
                  onChange={(e) => setNewPublishing({ ...newPublishing, categories: e.target.value })}
                  className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-amber-400">7 Amazon Keywords (comma-sep)</label>
                <input
                  type="text"
                  placeholder="e.g. magic quest, high adventure, daily bible devotion"
                  value={newPublishing.keywords}
                  onChange={(e) => setNewPublishing({ ...newPublishing, keywords: e.target.value })}
                  className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-mono uppercase text-amber-400">Cover Design Guidelines</label>
                <textarea
                  rows={2}
                  placeholder="Illustrate cover art specs, title alignments, fonts..."
                  value={newPublishing.coverPlan}
                  onChange={(e) => setNewPublishing({ ...newPublishing, coverPlan: e.target.value })}
                  className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <button
                type="submit"
                className="md:col-span-2 py-2 bg-amber-600 hover:bg-amber-500 text-amber-950 rounded-lg font-serif font-bold text-xs cursor-pointer transition-colors"
              >
                Inscribe KDP Formatting Specs
              </button>
            </form>
          )}

          {/* Form: Launches */}
          {subTab === 'launches' && (
            <form onSubmit={handleCreateLaunch} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-amber-400">Select Book</label>
                <select
                  required
                  value={newLaunch.bookId}
                  onChange={(e) => setNewLaunch({ ...newLaunch, bookId: e.target.value })}
                  className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                >
                  <option value="">Choose Book...</option>
                  {books.map(b => (
                    <option key={b.id} value={b.id}>{b.title}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-amber-400">Launch Release Date</label>
                  <input
                    type="date"
                    required
                    value={newLaunch.launchDate}
                    onChange={(e) => setNewLaunch({ ...newLaunch, launchDate: e.target.value })}
                    className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-amber-400">Campaign Status</label>
                  <select
                    value={newLaunch.status}
                    onChange={(e) => setNewLaunch({ ...newLaunch, status: e.target.value })}
                    className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="planning">Planning & Preorder</option>
                    <option value="active">Active Marketing Blitz</option>
                    <option value="completed">Completed Launch</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="md:col-span-2 py-2 bg-amber-600 hover:bg-amber-500 text-amber-950 rounded-lg font-serif font-bold text-xs cursor-pointer transition-colors"
              >
                Inscribe Launch Calendar
              </button>
            </form>
          )}

          {/* Form: Products */}
          {subTab === 'products' && (
            <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-amber-400">Content Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 90-Day Gratitude Prayer Journal"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-amber-400">Format Type</label>
                  <select
                    value={newProduct.type}
                    onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
                    className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                  >
                    <option value="journal">Devotional Journal</option>
                    <option value="planner">Interior Planner Booklet</option>
                    <option value="workbook">Faith-based Workbook</option>
                    <option value="coloring_book">Illustrated Coloring Book</option>
                    <option value="pdf">Custom PDF Handout</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase text-amber-400">Estimated Pages Count</label>
                  <input
                    type="number"
                    value={newProduct.pagesCount}
                    onChange={(e) => setNewProduct({ ...newProduct, pagesCount: Number(e.target.value) })}
                    className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-mono uppercase text-amber-400">Outline & Chapter layout of the product</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Day 1-10: Self-reflection. Day 11-30: Scriptural affirmations..."
                  value={newProduct.contentStructure}
                  onChange={(e) => setNewProduct({ ...newProduct, contentStructure: e.target.value })}
                  className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <button
                type="submit"
                className="md:col-span-2 py-2 bg-amber-600 hover:bg-amber-500 text-amber-950 rounded-lg font-serif font-bold text-xs cursor-pointer transition-colors"
              >
                Inscribe Custom Content Product
              </button>
            </form>
          )}

          {/* Form: Courses */}
          {subTab === 'courses' && (
            <form onSubmit={handleCreateCourse} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-amber-400">Course Master Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Masterclass in High Fantasy Storytelling"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-amber-400">Target Student/Audience</label>
                <input
                  type="text"
                  placeholder="e.g. Aspiring authors, teachers, creative writing students"
                  value={newCourse.audience}
                  onChange={(e) => setNewCourse({ ...newCourse, audience: e.target.value })}
                  className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-mono uppercase text-amber-400">Course Description & Focus</label>
                <textarea
                  rows={2}
                  placeholder="Describe what key achievements and certifications students obtain..."
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 text-xs focus:outline-none focus:border-amber-500/50"
                />
              </div>
              <button
                type="submit"
                className="md:col-span-2 py-2 bg-amber-600 hover:bg-amber-500 text-amber-950 rounded-lg font-serif font-bold text-xs cursor-pointer transition-colors"
              >
                Inscribe Master Course
              </button>
            </form>
          )}
        </div>
      )}

      {/* Database Lists display */}
      <div className="grid grid-cols-1 gap-4">
        {/* Render List: Books */}
        {subTab === 'books' && (
          <div className="space-y-2">
            {books.length === 0 ? (
              <div className="p-8 border border-dashed border-amber-900/20 bg-amber-950/5 text-center text-xs text-amber-200/40 font-serif rounded-xl">
                No registered books in your database yet. Register one above to initiate your writing empire.
              </div>
            ) : (
              books.map((b) => (
                <div key={b.id} className="p-4 bg-amber-950/5 border border-amber-900/15 rounded-xl flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-sm font-bold text-amber-100">{b.title}</span>
                      <span className="text-[9px] font-mono bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded uppercase">
                        {b.genre}
                      </span>
                    </div>
                    <p className="text-xs text-amber-200/60 leading-relaxed">{b.description}</p>
                    <div className="text-[10px] text-amber-200/40 font-mono">
                      Target Audience: <span className="text-amber-300">{b.targetAudience}</span> • Registered: {b.createdAt}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteEntity('books', b.id)}
                    className="p-1 rounded text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Render List: Chapters */}
        {subTab === 'chapters' && (
          <div className="space-y-2">
            {chapters.length === 0 ? (
              <div className="p-8 border border-dashed border-amber-900/20 bg-amber-950/5 text-center text-xs text-amber-200/40 font-serif rounded-xl">
                No chapter plans defined. Head to Scriptorium or add some chapters manually above.
              </div>
            ) : (
              chapters.map((c) => {
                const associatedBook = books.find(b => b.id === c.bookId);
                return (
                  <div key={c.id} className="p-4 bg-amber-950/5 border border-amber-900/15 rounded-xl flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-sm font-bold text-amber-100">{c.title}</span>
                        <span className="text-[9px] font-mono bg-black/40 text-amber-400 border border-amber-900/20 px-1.5 py-0.5 rounded">
                          Order: #{c.order}
                        </span>
                      </div>
                      <p className="text-xs text-amber-200/60 leading-relaxed">{c.summary}</p>
                      {associatedBook && (
                        <div className="text-[10px] text-amber-200/40 font-mono">
                          Linked Novel: <span className="text-amber-100 italic">"{associatedBook.title}"</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => onDeleteEntity('chapters', c.id)}
                      className="p-1 rounded text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Render List: Characters */}
        {subTab === 'characters' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {characters.length === 0 ? (
              <div className="col-span-2 p-8 border border-dashed border-amber-900/20 bg-amber-950/5 text-center text-xs text-amber-200/40 font-serif rounded-xl">
                No characters registered yet.
              </div>
            ) : (
              characters.map((ch) => {
                const associatedBook = books.find(b => b.id === ch.bookId);
                return (
                  <div key={ch.id} className="p-4 bg-amber-950/5 border border-amber-900/15 rounded-xl flex flex-col justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-sm font-bold text-amber-100">{ch.name}</span>
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase border ${
                          ch.role === 'protagonist' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' :
                          ch.role === 'antagonist' ? 'bg-red-500/15 border-red-500/30 text-red-400' :
                          'bg-purple-500/15 border-purple-500/30 text-purple-400'
                        }`}>
                          {ch.role}
                        </span>
                      </div>
                      <p className="text-xs text-amber-200/80 leading-relaxed italic">"{ch.description}"</p>
                      <div className="text-[11px] text-amber-200/50"><strong className="text-amber-300/80 font-mono">Traits:</strong> {ch.traits}</div>
                      <div className="text-[11px] text-amber-200/50"><strong className="text-amber-300/80 font-mono">Backstory:</strong> {ch.backstory}</div>
                    </div>
                    
                    <div className="border-t border-amber-900/10 pt-2.5 flex items-center justify-between">
                      <span className="text-[10px] text-amber-200/40 font-mono truncate">
                        Novel: {associatedBook ? associatedBook.title : 'External registry'}
                      </span>
                      <button
                        onClick={() => onDeleteEntity('characters', ch.id)}
                        className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Render List: Publishing layouts */}
        {subTab === 'publishing' && (
          <div className="space-y-2">
            {publishingProjects.length === 0 ? (
              <div className="p-8 border border-dashed border-amber-900/20 bg-amber-950/5 text-center text-xs text-amber-200/40 font-serif rounded-xl">
                No formatting specs loaded. Register KDP configurations above.
              </div>
            ) : (
              publishingProjects.map((p) => {
                const associatedBook = books.find(b => b.id === p.bookId);
                return (
                  <div key={p.id} className="p-4 bg-amber-950/5 border border-amber-900/15 rounded-xl space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-sm font-bold text-amber-100">KDP Print Spec</span>
                          <span className="text-[9px] font-mono bg-amber-500/15 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20 uppercase">
                            {p.kdpFormat}
                          </span>
                        </div>
                        {associatedBook && (
                          <div className="text-xs text-amber-200/40 font-mono mt-0.5">
                            Target Book: <span className="text-amber-200 italic">"{associatedBook.title}"</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => onDeleteEntity('publishingProjects', p.id)}
                        className="p-1 rounded text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs border-t border-amber-900/10 pt-2">
                      <div className="space-y-1">
                        <div className="font-semibold text-amber-300 font-mono uppercase text-[9px] tracking-wider">Acquired ISBN:</div>
                        <div className="text-amber-200 font-mono text-[11px]">{p.isbn}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="font-semibold text-amber-300 font-mono uppercase text-[9px] tracking-wider">KDP Cover Art parameters:</div>
                        <div className="text-amber-200/70">{p.coverPlan}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-amber-900/10">
                      {p.categories.map((cat, idx) => (
                        <span key={idx} className="text-[9px] bg-black/40 text-amber-400 px-1.5 py-0.5 rounded border border-amber-900/25">
                          🏷️ {cat}
                        </span>
                      ))}
                      {p.keywords.map((kw, idx) => (
                        <span key={idx} className="text-[9px] bg-amber-950/10 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/10 font-mono">
                          🔑 {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Render List: Launches */}
        {subTab === 'launches' && (
          <div className="space-y-2">
            {launches.length === 0 ? (
              <div className="p-8 border border-dashed border-amber-900/20 bg-amber-950/5 text-center text-xs text-amber-200/40 font-serif rounded-xl">
                No active launches scheduled. Initiate a marketing launch cycle above.
              </div>
            ) : (
              launches.map((l) => {
                const associatedBook = books.find(b => b.id === l.bookId);
                return (
                  <div key={l.id} className="p-4 bg-amber-950/5 border border-amber-900/15 rounded-xl space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-sm font-bold text-amber-100">Marketing Launch Strategy</span>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase ${
                            l.status === 'active' ? 'bg-amber-500/15 border-amber-500/30 text-amber-400' :
                            l.status === 'completed' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400' :
                            'bg-stone-500/15 border-stone-500/30 text-stone-400'
                          }`}>
                            {l.status}
                          </span>
                        </div>
                        <div className="text-xs text-amber-200/40 font-mono mt-0.5">
                          Target Novel: {associatedBook ? associatedBook.title : 'N/A'} • Release Date: <span className="text-amber-200 font-semibold">{l.launchDate}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onDeleteEntity('launches', l.id)}
                        className="p-1 rounded text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-amber-900/10">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-amber-500 font-bold block">Launch Timeline Calendar Tasks:</span>
                      {l.calendarEvents.map((ev) => (
                        <div key={ev.id} className="p-2 bg-black/30 border border-amber-900/10 rounded flex items-center justify-between text-xs font-serif">
                          <div>
                            <strong className="text-amber-400">{ev.title}:</strong> <span className="text-amber-100/95">{ev.task}</span>
                          </div>
                          <span className="text-[10px] font-mono text-amber-200/40 flex-shrink-0 ml-4">{ev.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Render List: Products */}
        {subTab === 'products' && (
          <div className="space-y-2">
            {products.length === 0 ? (
              <div className="p-8 border border-dashed border-amber-900/20 bg-amber-950/5 text-center text-xs text-amber-200/40 font-serif rounded-xl">
                No registered worksheets or coloring books. Build custom planner formats above.
              </div>
            ) : (
              products.map((p) => (
                <div key={p.id} className="p-4 bg-amber-950/5 border border-amber-900/15 rounded-xl space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-sm font-bold text-amber-100">{p.title}</span>
                        <span className="text-[9px] font-mono bg-purple-500/15 border border-purple-500/20 text-purple-400 px-2 py-0.5 rounded uppercase">
                          {p.type.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-amber-200/60 mt-1 leading-relaxed">{p.description}</p>
                    </div>
                    <button
                      onClick={() => onDeleteEntity('products', p.id)}
                      className="p-1 rounded text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {p.contentStructure && (
                    <div className="p-2.5 bg-black/30 border border-amber-900/10 rounded text-xs text-amber-200 font-mono whitespace-pre-wrap">
                      <strong className="text-amber-500">Page structure layouts:</strong> {p.contentStructure}
                    </div>
                  )}
                  <div className="text-[10px] text-amber-200/40 font-mono">Pages count: <span className="text-amber-400">{p.pagesCount} pages</span></div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Render List: Courses */}
        {subTab === 'courses' && (
          <div className="space-y-2">
            {courses.length === 0 ? (
              <div className="p-8 border border-dashed border-amber-900/20 bg-amber-950/5 text-center text-xs text-amber-200/40 font-serif rounded-xl">
                No active courses mapped out yet. Create professional syllabi above.
              </div>
            ) : (
              courses.map((cr) => (
                <div key={cr.id} className="p-4 bg-amber-950/5 border border-amber-900/15 rounded-xl space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-serif text-sm font-bold text-amber-100 block">{cr.title}</span>
                      <p className="text-xs text-amber-200/60 leading-relaxed mt-1">{cr.description}</p>
                    </div>
                    <button
                      onClick={() => onDeleteEntity('courses', cr.id)}
                      className="p-1 rounded text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-[10px] text-amber-200/40 font-mono">
                    Target Student Base: <span className="text-amber-300 font-semibold">{cr.audience}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
