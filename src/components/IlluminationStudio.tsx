import React, { useState } from 'react';
import { 
  Sparkles, Palette, HelpCircle, FileText, Check, Clipboard, Image, Layers, 
  Loader2, AlertCircle, Award, Compass, Eye, Heart
} from 'lucide-react';

export default function IlluminationStudio() {
  const [projectTitle, setProjectTitle] = useState('Throne of Sacred Oak');
  const [projectType, setProjectType] = useState('Brand Style Guide');
  const [visualMood, setVisualMood] = useState('Noble, cinematic, royal fantasy parchment style with rich gold and emerald forest accents');
  const [brandElements, setBrandElements] = useState('A golden royal crown merged with intertwined ancient oak roots, a glowing emerald seal');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [creativeOutput, setCreativeOutput] = useState<any>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleGenerateCreative = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle || !visualMood) {
      setErrorMessage("Please enter a project title and visual mood.");
      return;
    }
    setErrorMessage("");
    setIsLoading(true);
    setCreativeOutput(null);

    try {
      const response = await fetch('/api/author/creative-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: projectTitle,
          projectType,
          mood: visualMood,
          brandElements
        })
      });

      if (!response.ok) {
        throw new Error("The Academy design guilds were unable to formulate the requested visual guide.");
      }

      const data = await response.json();
      setCreativeOutput(data);

    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during creative direction.");
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
            <Palette className="h-6 w-6 text-amber-500 animate-pulse" />
            Illumination Studio & Creative Branding Agency
          </h2>
          <p className="text-xs text-amber-200/60 mt-0.5">
            Formulate premium color palettes, map out graphic structures for presentation slides, and generate production-ready AI image-generation prompts for book covers or illustrations.
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
        
        {/* Left Input Parameters Panel (4 cols) */}
        <div className="lg:col-span-4 p-5 bg-amber-950/10 border border-amber-500/20 rounded-xl space-y-4 h-fit font-serif">
          <h3 className="font-serif text-sm font-bold text-amber-300 flex items-center gap-1.5 font-serif">
            <Eye className="h-4 w-4 text-amber-500" />
            Visual Style Architect
          </h3>
          <p className="text-[11px] text-amber-200/50 leading-relaxed font-serif">
            Describe your brand values and visual style goals. Let AI formulate comprehensive color theories, layout slide templates, and compile Midjourney/Imagen prompts.
          </p>

          <form onSubmit={handleGenerateCreative} className="space-y-4 text-xs font-serif">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-amber-400">Design Project Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Chronicles of the Royal Scribes"
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none focus:border-amber-500/50 font-serif"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-amber-400">Design Type</label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none focus:border-amber-500/50"
              >
                <option value="Brand Style Guide">🎨 Complete Book Cover & Brand Style Guide</option>
                <option value="Presentation Slides">📊 Instructional Presentation Slides Layout</option>
                <option value="Graphics/Cover Planner">📕 Professional Cover Layout Blueprint</option>
                <option value="Coloring Book Ideas">✏️ Coloring Book Vector Outlines planner</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-amber-400">Target Visual Mood & Tone</label>
              <textarea
                rows={2}
                required
                placeholder="e.g. Warm pastel colors, child-friendly illustration style, or deep rich dark royal watercolor theme..."
                value={visualMood}
                onChange={(e) => setVisualMood(e.target.value)}
                className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none focus:border-amber-500/50 leading-relaxed font-serif"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-amber-400">Existing Brand Icons / Symbols</label>
              <input
                type="text"
                placeholder="e.g. A flying eagle, golden stars, old scrolls"
                value={brandElements}
                onChange={(e) => setBrandElements(e.target.value)}
                className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none focus:border-amber-500/50"
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
                  Drawing Visual Moodboards...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-amber-950" />
                  Generate Visual Blueprint
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output Display Panel (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {creativeOutput ? (
            <div className="space-y-6 animate-fade-in font-serif">
              
              {/* Core palette display card */}
              <div className="p-5 bg-amber-950/10 border border-amber-500/20 rounded-xl space-y-3">
                <h3 className="font-serif text-sm font-bold text-amber-300 flex items-center gap-2 border-b border-amber-900/10 pb-2 font-serif">
                  <Palette className="h-4 w-4 text-amber-500" /> Color Theory & Palette Specs
                </h3>
                <div className="text-xs text-amber-100 leading-relaxed whitespace-pre-wrap font-serif bg-black/30 p-4 border border-amber-900/10 rounded-lg">
                  {creativeOutput.colorsProposal}
                </div>
              </div>

              {/* Graphic Slide / Covers structure layouts */}
              <div className="p-5 bg-amber-950/10 border border-amber-500/20 rounded-xl space-y-3">
                <h3 className="font-serif text-sm font-bold text-amber-300 flex items-center gap-2 border-b border-amber-900/10 pb-2">
                  <Layers className="h-4 w-4 text-amber-500" />
                  Structural Visual Layers / Slides breakdown
                </h3>
                <div className="text-xs text-amber-100 leading-relaxed whitespace-pre-wrap font-serif bg-black/30 p-4 border border-amber-900/10 rounded-lg">
                  {creativeOutput.visualLayouts}
                </div>
              </div>

              {/* AI Text to Image Generation prompt */}
              <div className="p-5 bg-emerald-950/10 border border-emerald-500/20 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-emerald-900/10 pb-2">
                  <h3 className="font-serif text-sm font-bold text-emerald-400 flex items-center gap-2 font-serif">
                    <Image className="h-4 w-4 text-emerald-400" />
                    Imagen / Midjourney Illustration prompt generator
                  </h3>
                  <button
                    onClick={() => handleCopyText(creativeOutput.imageGenerationPrompt, 'imgPrompt')}
                    className="px-2 py-1 border border-emerald-500/30 text-[10px] text-emerald-300 rounded font-mono hover:bg-emerald-950/60 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    {copiedKey === 'imgPrompt' ? 'Copied prompt!' : 'Copy to Clipboard'}
                  </button>
                </div>
                
                <div className="p-4 bg-black/55 text-xs text-amber-100 font-mono rounded-lg border border-emerald-900/20 leading-relaxed whitespace-pre-wrap select-all">
                  {creativeOutput.imageGenerationPrompt}
                </div>
                <p className="text-[10px] text-emerald-400 font-serif leading-relaxed">
                  💡 **Pro Tip:** Paste this generated prompt into Midjourney, Imagen, DALL-E 3 or stable diffusion to generate magnificent high-resolution book cover graphics or internal chapter decorations instantly!
                </p>
              </div>

            </div>
          ) : (
            <div className="p-12 border border-dashed border-amber-900/20 bg-amber-950/5 text-center rounded-xl space-y-4">
              <Palette className="h-10 w-10 text-amber-500/20 mx-auto" />
              <h3 className="font-serif text-base font-bold text-amber-100">Unlock Creative Art Direction</h3>
              <p className="text-xs text-amber-200/60 max-w-md mx-auto leading-relaxed font-serif">
                Acquire comprehensive brand designs, hex proposals, and high-fidelity text-to-image prompt specifications. Input your brand requirements on the left, and click **Generate Visual Blueprint** to begin.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
