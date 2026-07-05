import React, { useState } from 'react';
import { Book } from '../types';
import { 
  Megaphone, Sparkles, Check, Clipboard, Calendar, FileText, Share2, Users, 
  Loader2, AlertCircle, Bookmark, Compass
} from 'lucide-react';

interface HeraldMarketingProps {
  books: Book[];
  onAddLaunch: (launch: any) => void;
}

export default function HeraldMarketing({ books, onAddLaunch }: HeraldMarketingProps) {
  const [selectedBookId, setSelectedBookId] = useState(books[0]?.id || '');
  const [authorBioGoal, setAuthorBioGoal] = useState('An innovative author seeking to write faith-based stories that impact youth and inspire moral courage.');
  const [targetReleaseDate, setTargetReleaseDate] = useState('Autumn 2026');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [marketingKit, setMarketingKit] = useState<any>(null);
  const [activeKitTab, setActiveKitTab] = useState<'bio' | 'press' | 'calendar' | 'social'>('bio');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const currentBook = books.find(b => b.id === selectedBookId);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleForgeCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookId) {
      setErrorMessage("Please select or create a book project first.");
      return;
    }
    setErrorMessage("");
    setIsLoading(true);
    setMarketingKit(null);

    try {
      const targetBook = books.find(b => b.id === selectedBookId);
      if (!targetBook) throw new Error("Selected book was not found.");

      const response = await fetch('/api/author/marketing-suite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: targetBook.title,
          genre: targetBook.genre,
          authorBioGoal,
          targetReleaseDate
        })
      });

      if (!response.ok) {
        throw new Error("Unable to forge marketing assets. Check server connection or secrets.");
      }

      const data = await response.json();
      setMarketingKit(data);
      setActiveKitTab('bio');

      // Auto add launch campaign representing state
      onAddLaunch({
        id: 'launch_camp_' + Date.now(),
        bookId: selectedBookId,
        launchDate: targetReleaseDate,
        status: 'planning',
        calendarEvents: [
          { id: 'l1', date: targetReleaseDate, title: 'Release Push', task: 'Activate launch email sequences and broadcast press releases.' }
        ],
        socialPosts: data.socialPosts || []
      });

    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during marketing synthesis.");
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
            <Megaphone className="h-6 w-6 text-amber-500 animate-bounce" />
            Herald Marketing & Book Publicity Suite
          </h2>
          <p className="text-xs text-amber-200/60 mt-0.5">
            Construct premium launch calendars, compile media-ready press releases, write high-converting author bios, and write engagement-optimized social media posts.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-950/20 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-center gap-2 font-serif">
          <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Grid Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Intake (4 cols) */}
        <div className="lg:col-span-4 p-5 bg-amber-950/10 border border-amber-500/20 rounded-xl space-y-4 h-fit">
          <h3 className="font-serif text-sm font-bold text-amber-300 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Publicity Campaign Architect
          </h3>
          <p className="text-[11px] text-amber-200/50 leading-relaxed font-serif">
            Synthesize promotional copy. Scribes will draft complete press announcements, social posts, timeline goals, and bios.
          </p>

          <form onSubmit={handleForgeCampaign} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-amber-400">Select Target Book</label>
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

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-amber-400">Target Launch Date</label>
              <input
                type="text"
                required
                placeholder="e.g. October 2026, or Christmas Eve"
                value={targetReleaseDate}
                onChange={(e) => setTargetReleaseDate(e.target.value)}
                className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-amber-400">Author Background / Bio Prompt</label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Founder of a tech non-profit, passionate about ancient scrolls, and lives with three golden retrievers..."
                value={authorBioGoal}
                onChange={(e) => setAuthorBioGoal(e.target.value)}
                className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !selectedBookId}
              className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-serif font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Synthesizing Launch Assets...
                </>
              ) : (
                <>
                  <Megaphone className="h-3.5 w-3.5 text-amber-950" />
                  Forge Campaign Materials
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Tabbed Outputs (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {marketingKit ? (
            <div className="space-y-4 animate-fade-in font-serif">
              
              {/* Tabs list */}
              <div className="flex border-b border-amber-900/15">
                {[
                  { key: 'bio', label: 'Author Biography', icon: Users },
                  { key: 'press', label: 'Press Release', icon: FileText },
                  { key: 'calendar', label: 'Launch Calendar', icon: Calendar },
                  { key: 'social', label: 'Social Post copies', icon: Share2 }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveKitTab(tab.key as any)}
                      className={`px-4 py-2 border-b-2 font-serif text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        activeKitTab === tab.key
                          ? 'border-amber-500 text-amber-300 bg-amber-950/10'
                          : 'border-transparent text-amber-200/50 hover:text-amber-200/80'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab: Author Bio */}
              {activeKitTab === 'bio' && (
                <div className="p-5 bg-amber-950/10 border border-amber-500/20 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
                    <h4 className="font-serif text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                      <Users className="h-4 w-4" /> Professional Author Biography
                    </h4>
                    <button
                      onClick={() => handleCopyText(marketingKit.authorBio, 'bio')}
                      className="px-2 py-0.5 border border-amber-500/30 text-[10px] text-amber-300 rounded font-mono hover:bg-amber-950 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'bio' ? 'Copied!' : 'Copy Bio'}
                    </button>
                  </div>
                  <p className="text-sm text-amber-100 leading-relaxed whitespace-pre-wrap pt-1 font-serif text-justify">
                    {marketingKit.authorBio}
                  </p>
                </div>
              )}

              {/* Tab: Press Release */}
              {activeKitTab === 'press' && (
                <div className="p-5 bg-amber-950/10 border border-amber-500/20 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
                    <h4 className="font-serif text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                      <FileText className="h-4 w-4" /> Ready-to-Publish Press Release
                    </h4>
                    <button
                      onClick={() => handleCopyText(marketingKit.pressRelease, 'press')}
                      className="px-2 py-0.5 border border-amber-500/30 text-[10px] text-amber-300 rounded font-mono hover:bg-amber-950 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'press' ? 'Copied!' : 'Copy Press Draft'}
                    </button>
                  </div>
                  <div className="text-xs text-amber-100/90 leading-relaxed font-serif whitespace-pre-wrap bg-black/30 p-4 border border-amber-900/10 rounded-lg max-h-[380px] overflow-y-auto">
                    {marketingKit.pressRelease}
                  </div>
                </div>
              )}

              {/* Tab: Launch Calendar */}
              {activeKitTab === 'calendar' && (
                <div className="p-5 bg-amber-950/10 border border-amber-500/20 rounded-xl space-y-3">
                  <div className="flex items-center justify-between border-b border-amber-900/10 pb-2">
                    <h4 className="font-serif text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> Chronological Release Timeline Goals
                    </h4>
                    <button
                      onClick={() => handleCopyText(marketingKit.launchCalendar, 'cal')}
                      className="px-2 py-0.5 border border-amber-500/30 text-[10px] text-amber-300 rounded font-mono hover:bg-amber-950 transition-all cursor-pointer"
                    >
                      {copiedKey === 'cal' ? 'Copied!' : 'Copy Plan'}
                    </button>
                  </div>
                  <div className="text-xs text-amber-200/95 leading-relaxed font-serif whitespace-pre-wrap bg-black/30 p-4 border border-amber-900/10 rounded-lg">
                    {marketingKit.launchCalendar}
                  </div>
                </div>
              )}

              {/* Tab: Social Posts */}
              {activeKitTab === 'social' && (
                <div className="space-y-3">
                  {marketingKit.socialPosts?.map((post: any, idx: number) => (
                    <div key={idx} className="p-4 bg-amber-950/10 border border-amber-500/10 rounded-xl space-y-2">
                      <div className="flex items-center justify-between border-b border-amber-900/5 pb-1">
                        <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider flex items-center gap-1">
                          <Share2 className="h-3.5 w-3.5 text-amber-500" /> Channel: {post.channel}
                        </span>
                        <button
                          onClick={() => handleCopyText(post.text, `soc_${idx}`)}
                          className="px-2 py-0.5 border border-amber-500/20 text-[9px] text-amber-300 rounded font-mono hover:bg-amber-950 transition-all cursor-pointer"
                        >
                          {copiedKey === `soc_${idx}` ? 'Copied' : 'Copy copytext'}
                        </button>
                      </div>
                      <p className="text-xs text-amber-100 font-serif leading-relaxed italic">
                        "{post.text}"
                      </p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 border border-dashed border-amber-900/20 bg-amber-950/5 text-center rounded-xl space-y-4">
              <Megaphone className="h-10 w-10 text-amber-500/20 mx-auto" />
              <h3 className="font-serif text-base font-bold text-amber-100">Unlock publicity & Book Marketing</h3>
              <p className="text-xs text-amber-200/60 max-w-md mx-auto leading-relaxed font-serif">
                Formulate elegant media templates, press packages, biographies, and campaign timetables to maximize book release visibility. Select a book project on the left and invoke **Forge Campaign Materials** to proceed.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
