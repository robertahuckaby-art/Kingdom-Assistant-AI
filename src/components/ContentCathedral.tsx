import React, { useState } from 'react';
import { 
  Sparkles, GraduationCap, FileText, Check, Clipboard, BookOpen, Layers, 
  Loader2, AlertCircle, Award, Compass, Heart
} from 'lucide-react';

interface ContentCathedralProps {
  onAddCourse: (course: any) => void;
  onAddProduct: (product: any) => void;
}

export default function ContentCathedral({ onAddCourse, onAddProduct }: ContentCathedralProps) {
  const [contentType, setContentType] = useState('Course Syllabus');
  const [assetTitle, setAssetTitle] = useState('Introduction to Kingdom Stewardship');
  const [targetAudience, setTargetAudience] = useState('Lay leaders, ministry coordinators, and community organizers');
  const [topics, setTopics] = useState('Stewardship, financial integrity, community building, ethical accounting, charity distribution');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [studioOutput, setStudioOutput] = useState<any>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 1500);
  };

  const handleConstructAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetTitle || !topics) {
      setErrorMessage("Please enter an asset title and focus topics.");
      return;
    }
    setErrorMessage("");
    setIsLoading(true);
    setStudioOutput(null);

    try {
      const response = await fetch('/api/author/content-studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType,
          title: assetTitle,
          audience: targetAudience,
          topics
        })
      });

      if (!response.ok) {
        throw new Error("The Academy scribes were unable to formulate the requested course material.");
      }

      const data = await response.json();
      setStudioOutput(data);

      // If they built a syllabus, save to course database
      if (contentType === 'Course Syllabus') {
        onAddCourse({
          id: 'course_' + Date.now(),
          title: assetTitle,
          audience: targetAudience,
          description: data.introduction || 'Professional lesson course.',
          syllabus: data.syllabus || []
        });
      }

      // Save general educational handouts/planners as Content Products
      onAddProduct({
        id: 'edu_prod_' + Date.now(),
        title: assetTitle,
        type: contentType === 'Course Syllabus' ? 'workbook' : 'pdf',
        description: `Educational draft for: ${contentType}. Audience: ${targetAudience}`,
        pagesCount: contentType === 'Course Syllabus' ? 24 : 4,
        contentStructure: `Introduction outline: ${data.introduction}\nPrinted exercises: ${data.exercises}`
      });

    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during instructional planning.");
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
            <GraduationCap className="h-6 w-6 text-amber-500 animate-pulse" />
            Academy Content Studio & Course Cathedral
          </h2>
          <p className="text-xs text-amber-200/60 mt-0.5">
            Construct courses, syllabi roadmaps, classroom worksheets, custom PDF planners, coloring-book plans, blogs, and faith-based workbooks.
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-950/20 border border-red-500/30 text-red-300 text-xs rounded-xl flex items-center gap-2 font-serif">
          <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column Input (4 cols) */}
        <div className="lg:col-span-4 p-5 bg-amber-950/10 border border-amber-500/20 rounded-xl space-y-4 h-fit">
          <h3 className="font-serif text-sm font-bold text-amber-300 flex items-center gap-1.5">
            <Compass className="h-4 w-4 text-amber-500" />
            Instructional Builder Catalyst
          </h3>
          <p className="text-[11px] text-amber-200/50 leading-relaxed font-serif">
            Draft structured materials to train disciples, educate classrooms, or distribute printable journals. AI generates comprehensive module timelines, syllabi, and exercises.
          </p>

          <form onSubmit={handleConstructAsset} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-amber-400">Content Type</label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none focus:border-amber-500/50"
              >
                <option value="Course Syllabus">🎓 Comprehensive Course Syllabus</option>
                <option value="Educational Worksheet">📑 Classroom Printable Worksheet</option>
                <option value="PDF Planner Template">📅 Daily PDF Planner Template</option>
                <option value="Journal Guide">✏️ 30-Day Devotional Journal Draft</option>
                <option value="Workbook Blueprint">📖 Faith-based Active Workbook</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-amber-400">Material / Course Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Masterclass in Classical Theology"
                value={assetTitle}
                onChange={(e) => setAssetTitle(e.target.value)}
                className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none focus:border-amber-500/50 font-serif"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-amber-400">Target Student Base / Audience</label>
              <input
                type="text"
                required
                placeholder="e.g. Aspiring coaches, church leaders, young adults"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono uppercase text-amber-400">Core Topic Bullet points (comma-sep)</label>
              <textarea
                rows={3}
                required
                placeholder="e.g. biblical hermeneutics, sermon preparation, local leadership, ethical coaching..."
                value={topics}
                onChange={(e) => setTopics(e.target.value)}
                className="w-full bg-black/40 border border-amber-900/30 text-amber-100 rounded-lg p-2 focus:outline-none leading-relaxed"
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
                  Drawing Lesson Curriculum...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-amber-950" />
                  Construct Educational Asset
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Display Materials Handout (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {studioOutput ? (
            <div className="space-y-6 animate-fade-in font-serif">
              
              {/* Materials PDF printable sheet style box */}
              <div className="p-6 bg-amber-950/10 border border-amber-500/25 rounded-xl space-y-4 shadow-xl">
                
                {/* Header block */}
                <div className="border-b border-amber-900/10 pb-3 flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">{contentType} Drafted</span>
                    <h3 className="text-xl font-bold text-amber-100 font-serif">{assetTitle}</h3>
                    <p className="text-[11px] text-amber-200/50 mt-1 font-sans">
                      Target Class: <span className="text-amber-200">{targetAudience}</span>
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopyText(JSON.stringify(studioOutput, null, 2), 'syllabus')}
                    className="px-2 py-1 border border-amber-500/30 text-[10px] text-amber-300 rounded font-mono hover:bg-amber-950 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    {copiedSection === 'syllabus' ? 'Copied Materials!' : 'Copy raw content'}
                  </button>
                </div>

                {/* Introduction brief */}
                <div className="space-y-1.5 pt-1">
                  <h4 className="text-xs font-mono uppercase text-amber-300 font-bold tracking-wider flex items-center gap-1">
                    <BookOpen className="h-4 w-4 text-amber-500" /> Syllabus Course Overview & Directives
                  </h4>
                  <p className="text-xs text-amber-200/90 leading-relaxed italic bg-black/20 p-3 rounded-lg border border-amber-900/10">
                    {studioOutput.introduction}
                  </p>
                </div>

                {/* Modules breakdown */}
                {studioOutput.syllabus && studioOutput.syllabus.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-mono uppercase text-amber-300 font-bold tracking-wider flex items-center gap-1.5">
                      <Layers className="h-4 w-4 text-amber-500" /> Lesson Roadmap & Classroom Modules
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {studioOutput.syllabus.map((mod: any, idx: number) => (
                        <div key={idx} className="p-3.5 bg-black/35 border border-amber-900/15 rounded-xl space-y-2 font-serif">
                          <strong className="text-amber-100 text-xs block truncate" title={mod.moduleTitle}>
                            {mod.moduleTitle}
                          </strong>
                          <ul className="space-y-1 text-[11px] text-amber-200/60 leading-tight">
                            {mod.lessons?.map((les: string, lIdx: number) => (
                              <li key={lIdx} className="flex items-start gap-1">
                                <span className="text-amber-500">•</span>
                                <span>{les}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Classroom Exercises */}
                <div className="space-y-1.5 pt-2">
                  <h4 className="text-xs font-mono uppercase text-amber-300 font-bold tracking-wider flex items-center gap-1">
                    <Award className="h-4 w-4 text-amber-500" /> Practical Student Worksheets & Workbook Exercises
                  </h4>
                  <div className="p-4 bg-amber-500/5 text-xs text-amber-100 leading-relaxed font-serif rounded-xl border border-amber-500/10 whitespace-pre-wrap">
                    {studioOutput.exercises}
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="p-12 border border-dashed border-amber-900/20 bg-amber-950/5 text-center rounded-xl space-y-4">
              <Award className="h-10 w-10 text-amber-500/20 mx-auto" />
              <h3 className="font-serif text-base font-bold text-amber-100">Draft Educational Curriculum Handouts</h3>
              <p className="text-xs text-amber-200/60 max-w-md mx-auto leading-relaxed font-serif">
                Formulate complete educational products, pdf handouts, daily planners, and courses to expand your academy. Define your title and topics on the left, and click **Construct Educational Asset** to generate materials.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
