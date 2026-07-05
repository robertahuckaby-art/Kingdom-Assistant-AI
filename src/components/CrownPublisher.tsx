import React, { useState } from 'react';
import { Book } from '../types';
import { 
  BookMarked, Sparkles, Check, Clipboard, Info, Layers, Loader2, AlertCircle, 
  HelpCircle, Settings, Tag, Key, FileText, Globe
} from 'lucide-react';

interface CrownPublisherProps {
  books: Book[];
  onAddPublishingProject: (project: any) => void;
}

export default function CrownPublisher({ books, onAddPublishingProject }: CrownPublisherProps) {
  const [selectedBookId, setSelectedBookId] = useState(books[0]?.id || '');
  const [format, setFormat] = useState('paperback');
  const [pageCount, setPageCount] = useState(180);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [publishGuide, setPublishGuide] = useState<any>(null);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const currentBook = books.find(b => b.id === selectedBookId);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleGenerateKDPPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId) {
      setErrorMessage("Please select or create a book project first.");
      return;
    }
    setErrorMessage("");
    setIsLoading(true);
    setPublishGuide(null);

    try {
      const targetBook = books.find(b => b.id === selectedBookId);
      if (!targetBook) throw new Error("Selected book was not found.");

      const response = await fetch('/api/author/publish-helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: targetBook.title,
          genre: targetBook.genre,
          format: format === 'paperback' ? 'Paperback (6x9 inches)' : format === 'hardcover' ? 'Hardcover (6x9 inches)' : 'Kindle eBook',
          pageCount
        })
      });

      if (!response.ok) {
        throw new Error("Unable to fetch KDP guidelines from the printer servers.");
      }

      const data = await response.json();
      setPublishGuide(data);

      // Auto save publishing spec to state database
      onAddPublishingProject({
        id: 'pub_project_' + Date.now(),
        bookId: selectedBookId,
        kdpFormat: format as any,
        isbn: 'Assigned Auto-KDP ID: ' + Math.floor(Math.random() * 10000000000),
        coverPlan: `Specifications for ${pageCount} pages. Bleeds and alignment calibrated. Colors: Matte velvet finish.`,
        categories: data.categories || [],
        keywords: data.keywords || [],
        metadata: data.metadataBlurb || ''
      });

    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during publisher mapping.");
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
            <BookMarked className="h-6 w-6 text-amber-500 animate-pulse" />
            Crown Publisher KDP Layout & ISBN Suite
          </h2>
          <p className="text-xs text-amber-200/60 mt-0.5">
            Format books according to Amazon KDP requirements. Generate interior specs, bleed values, step-by-step ISBN registry guides, high-converting categories, and metadata keywords.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-950/20 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-center gap-2 font-serif">
          <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column: Setup parameters */}
        <div className="lg:col-span-4 p-5 bg-amber-950/10 border border-amber-500/20 rounded-xl space-y-4 h-fit">
          <h3 className="font-serif text-sm font-bold text-amber-300 flex items-center gap-1.5">
            <Settings className="h-4 w-4 text-amber-500" />
            Publication Specs Architect
          </h3>
          <p className="text-[11px] text-amber-200/50 leading-relaxed font-serif">
            Configure your printing details. Scribes will calculate margins, gutters, bleed alignments, and select premium metadata listings.
          </p>

          <form onSubmit={handleGenerateKDPPlan} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-amber-400">Select Book Project</label>
              <select
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
                className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none focus:border-amber-500/50"
              >
                <option value="">-- Choose Book --</option>
                {books.map(b => (
                  <option key={b.id} value={b.id}>{b.title} ({b.genre})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-amber-400">Print Trim Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none"
                >
                  <option value="paperback">Paperback (6x9 Trim)</option>
                  <option value="hardcover">Hardcover (6x9 Trim)</option>
                  <option value="ebook">Kindle E-Book Only</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-amber-400">Estimated Page Count</label>
                <input
                  type="number"
                  min={10}
                  max={1000}
                  value={pageCount}
                  onChange={(e) => setPageCount(Number(e.target.value))}
                  className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !selectedBookId}
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-serif font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Calibrating Printer Tolerances...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  Generate KDP Print Plan
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right column: Specs Display */}
        <div className="lg:col-span-8 space-y-6">
          {publishGuide ? (
            <div className="space-y-6 animate-fade-in font-serif">
              
              {/* specs grid: margins and bleeds */}
              <div className="p-5 bg-amber-950/15 border border-amber-500/20 rounded-xl space-y-3">
                <h3 className="font-serif text-sm font-bold text-amber-300 flex items-center gap-2 border-b border-amber-900/10 pb-2">
                  <Layers className="h-4 w-4 text-amber-500" />
                  KDP Interior Specifications & Trim Layout
                </h3>
                <div className="text-xs text-amber-200/80 leading-relaxed whitespace-pre-wrap font-mono bg-black/40 p-4 border border-amber-900/15 rounded-lg">
                  {publishGuide.interiorSpecifications}
                </div>
              </div>

              {/* isbn registration */}
              <div className="p-5 bg-amber-950/5 border border-amber-900/15 rounded-xl space-y-3">
                <h3 className="font-serif text-sm font-bold text-amber-300 flex items-center gap-2 border-b border-amber-900/10 pb-2">
                  <Globe className="h-4 w-4 text-amber-500" />
                  Bowker & Bowker-Alternative ISBN Registration Guides
                </h3>
                <p className="text-xs text-amber-200/80 leading-relaxed">
                  {publishGuide.isbnGuidance}
                </p>
              </div>

              {/* Listing HTML Description */}
              <div className="p-5 bg-amber-950/5 border border-amber-900/15 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
                  <h3 className="font-serif text-sm font-bold text-amber-300 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-amber-500" />
                    High-Converting Amazon Listing Blurb (HTML Formatted)
                  </h3>
                  <button
                    onClick={() => handleCopyText(publishGuide.metadataBlurb, 'blurb')}
                    className="px-2 py-1 border border-amber-500/30 text-[10px] text-amber-300 rounded font-mono hover:bg-amber-950 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    {copiedIndex === 'blurb' ? 'Copied HTML!' : 'Copy HTML to Clipboard'}
                  </button>
                </div>
                <div className="p-3 bg-black/40 text-[11px] text-amber-200 font-mono rounded-lg border border-amber-900/10 whitespace-pre-wrap max-h-52 overflow-y-auto">
                  {publishGuide.metadataBlurb}
                </div>
              </div>

              {/* Keyword & Category mapping */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Amazon Categories path */}
                <div className="p-4 bg-amber-950/10 border border-amber-500/15 rounded-xl space-y-3">
                  <h4 className="font-serif text-xs font-bold uppercase text-amber-300 flex items-center gap-1.5 border-b border-amber-900/10 pb-1.5">
                    <Tag className="h-4 w-4 text-amber-500" /> Recommended Amazon Categories
                  </h4>
                  <ul className="space-y-2">
                    {publishGuide.categories?.map((cat: string, idx: number) => (
                      <li key={idx} className="text-xs text-amber-200/90 flex items-start gap-1.5 font-serif">
                        <span className="text-amber-500">▶</span>
                        <span>{cat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Kindle Keyword tags */}
                <div className="p-4 bg-amber-950/10 border border-amber-500/15 rounded-xl space-y-3">
                  <h4 className="font-serif text-xs font-bold uppercase text-amber-300 flex items-center gap-1.5 border-b border-amber-900/10 pb-1.5">
                    <Key className="h-4 w-4 text-amber-500" /> Amazon 7-Keyword Backend Phrases
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {publishGuide.keywords?.map((kw: string, idx: number) => (
                      <span 
                        key={idx} 
                        onClick={() => handleCopyText(kw, `kw_${idx}`)}
                        className="text-[10px] font-mono bg-black/40 text-amber-400 border border-amber-900/25 px-2.5 py-1 rounded-lg cursor-pointer hover:border-amber-500/30 transition-all flex items-center gap-1"
                      >
                        {copiedIndex === `kw_${idx}` ? 'Copied' : kw}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="p-12 border border-dashed border-amber-900/20 bg-amber-950/5 text-center rounded-xl space-y-4">
              <Info className="h-10 w-10 text-amber-500/20 mx-auto animate-pulse" />
              <h3 className="font-serif text-base font-bold text-amber-100">Unlock Printing & Listing Blueprints</h3>
              <p className="text-xs text-amber-200/60 max-w-md mx-auto leading-relaxed font-serif">
                Acquire layout specification details and formatting guides to self-publish smoothly on Amazon KDP. Select your active book project on the left and click **Generate KDP Print Plan** to begin.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
