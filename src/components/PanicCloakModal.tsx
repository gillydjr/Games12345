import React, { useState, useEffect } from 'react';
import { Eye, FileText, Share2, MessageSquare, Lock } from 'lucide-react';

interface PanicCloakModalProps {
  onExit: () => void;
}

export const PanicCloakModal: React.FC<PanicCloakModalProps> = ({ onExit }) => {
  const [docContent, setDocContent] = useState(`
Unit 4: Photosynthesis and Cellular Respiration Lecture Notes
Instructor: Dr. Henderson | AP Biology Period 3

1. Overview of Metabolic Pathways
Metabolism is the totality of an organism's chemical reactions, consisting of catabolic and anabolic pathways.
- Catabolic pathways: Release energy by breaking down complex molecules into simpler compounds (e.g., cellular respiration).
- Anabolic pathways: Consume energy to build complicated molecules from simpler ones (e.g., photosynthesis synthesizing glucose).

2. The Light Reactions of Photosynthesis
Photosynthesis converts light energy to chemical energy in two stages:
- Location: Thylakoid membranes of chloroplasts
- Reactants: H2O, NADP+, ADP + Pi
- Products: O2, NADPH, ATP
- Photolysis of water: 2 H2O -> 4 H+ + 4 e- + O2

3. The Calvin Cycle (Light-Independent Reactions)
Carbon fixation occurs in the stroma using the enzyme RuBisCO.
- Phase 1: Carbon fixation catalyzed by RuBisCO.
- Phase 2: Reduction of 3-PGA to G3P utilizing ATP and NADPH.
- Phase 3: Regeneration of RuBP (Ribulose 1,5-bisphosphate).
Net requirement for one G3P molecule: 9 ATP, 6 NADPH.

Upcoming Homework:
- Complete Chapter 9 Review questions #1-18.
- Lab Report on enzyme catalase denaturation due Friday.
  `.trim());

  // Escape to return to game
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onExit]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#f8f9fa] text-[#202124] flex flex-col font-sans select-text">
      
      {/* Fake Google Docs Header */}
      <div className="bg-white border-b border-[#dadce0] px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-11 bg-blue-600 rounded-sm flex items-center justify-center text-white font-bold text-xs shadow-sm">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-[#202124]">AP Bio Unit 4 - Photosynthesis Notes</span>
              <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">Saved to Drive</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#5f6368] mt-0.5">
              <span className="hover:underline cursor-pointer">File</span>
              <span className="hover:underline cursor-pointer">Edit</span>
              <span className="hover:underline cursor-pointer">View</span>
              <span className="hover:underline cursor-pointer">Insert</span>
              <span className="hover:underline cursor-pointer">Format</span>
              <span className="hover:underline cursor-pointer">Tools</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#c2e7ff] text-[#001d35] px-4 py-2 rounded-full text-xs font-semibold cursor-pointer">
            <Lock className="w-3.5 h-3.5" /> Private to only me
          </div>
          
          {/* Secret Exit Button disguised as user avatar */}
          <button
            onClick={onExit}
            className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center transition-all shadow-sm"
            title="Click to resume games (or press Escape)"
          >
            B
          </button>
        </div>
      </div>

      {/* Fake Toolbar */}
      <div className="bg-[#edf2fa] border-b border-[#dadce0] px-4 py-1.5 flex items-center gap-4 text-xs text-[#444746]">
        <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-[#dadce0]">
          <span>100%</span>
        </div>
        <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-[#dadce0]">
          <span>Normal text</span>
        </div>
        <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-[#dadce0]">
          <span>Arial</span>
        </div>
        <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border border-[#dadce0]">
          <span>11</span>
        </div>
        <div className="flex items-center gap-1 font-bold text-gray-700 px-2 cursor-pointer">B</div>
        <div className="flex items-center gap-1 italic text-gray-700 px-2 cursor-pointer">I</div>
        <div className="flex items-center gap-1 underline text-gray-700 px-2 cursor-pointer">U</div>
        <div className="ml-auto text-xs text-gray-400">
          Stealth Mode Active • Click 'B' or press Esc to return
        </div>
      </div>

      {/* Document Sheet Body */}
      <div className="flex-1 bg-[#f0f4f9] overflow-y-auto p-4 sm:p-8 flex justify-center">
        <div className="w-full max-w-[850px] bg-white min-h-[900px] shadow-md border border-[#dadce0] p-12 sm:p-16">
          <textarea
            value={docContent}
            onChange={(e) => setDocContent(e.target.value)}
            className="w-full h-full min-h-[750px] resize-none border-none outline-none font-serif text-[15px] leading-relaxed text-[#202124] bg-transparent"
          />
        </div>
      </div>

    </div>
  );
};
